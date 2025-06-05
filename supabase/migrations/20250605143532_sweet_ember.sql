-- Create custom types
CREATE TYPE user_type AS ENUM ('passenger', 'driver', 'both');
CREATE TYPE ride_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone_number text,
  user_type user_type NOT NULL DEFAULT 'passenger',
  is_driver_verified boolean DEFAULT false,
  bio text,
  trust_score numeric(3,2) DEFAULT 5.00,
  co2_saved numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  color text NOT NULL,
  license_plate text NOT NULL,
  capacity integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rides table
CREATE TABLE IF NOT EXISTS rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES users(id) NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id),
  departure_location text NOT NULL,
  destination text NOT NULL,
  departure_time timestamptz NOT NULL,
  available_seats integer NOT NULL,
  price_per_seat numeric NOT NULL,
  is_flexible_price boolean DEFAULT false,
  status ride_status DEFAULT 'scheduled',
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ride_requests table
CREATE TABLE IF NOT EXISTS ride_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES rides(id) NOT NULL,
  passenger_id uuid REFERENCES users(id) NOT NULL,
  status request_status DEFAULT 'pending',
  seats_requested integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid REFERENCES users(id) NOT NULL,
  reviewee_id uuid REFERENCES users(id) NOT NULL,
  ride_id uuid REFERENCES rides(id) NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Vehicles policies
CREATE POLICY "Drivers can create vehicles"
  ON vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Drivers can update their vehicles"
  ON vehicles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Drivers can delete their vehicles"
  ON vehicles
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (true);

-- Rides policies
CREATE POLICY "Drivers can create rides"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (driver_id = auth.uid());

CREATE POLICY "Drivers can update their rides"
  ON rides
  FOR UPDATE
  TO authenticated
  USING (driver_id = auth.uid());

CREATE POLICY "Drivers can delete their rides"
  ON rides
  FOR DELETE
  TO authenticated
  USING (driver_id = auth.uid());

CREATE POLICY "Anyone can view rides"
  ON rides
  FOR SELECT
  TO authenticated
  USING (true);

-- Ride requests policies
CREATE POLICY "Passengers can create requests"
  ON ride_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (passenger_id = auth.uid());

CREATE POLICY "Passengers can update their requests"
  ON ride_requests
  FOR UPDATE
  TO authenticated
  USING (passenger_id = auth.uid());

CREATE POLICY "Passengers can delete their requests"
  ON ride_requests
  FOR DELETE
  TO authenticated
  USING (passenger_id = auth.uid());

CREATE POLICY "Drivers can view requests for their rides"
  ON ride_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rides
      WHERE rides.id = ride_requests.ride_id
      AND rides.driver_id = auth.uid()
    )
  );

-- Reviews policies
CREATE POLICY "Users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rides
      WHERE rides.id = reviews.ride_id
      AND rides.status = 'completed'
      AND (rides.driver_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM ride_requests
             WHERE ride_requests.ride_id = rides.id
             AND ride_requests.passenger_id = auth.uid()
             AND ride_requests.status = 'accepted'
           ))
    )
  );

CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION calculate_trust_score(user_id uuid)
RETURNS numeric AS $$
DECLARE
  avg_rating numeric;
BEGIN
  SELECT COALESCE(AVG(rating), 5.0) INTO avg_rating
  FROM reviews
  WHERE reviewee_id = user_id;
  
  RETURN avg_rating;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update trust score after review
CREATE OR REPLACE FUNCTION update_trust_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET trust_score = calculate_trust_score(NEW.reviewee_id)
  WHERE id = NEW.reviewee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_trust_score_after_review
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_trust_score();

-- Function to update CO2 saved
CREATE OR REPLACE FUNCTION update_co2_saved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    -- Assuming average of 2.3 kg CO2 saved per passenger per ride
    UPDATE users
    SET co2_saved = co2_saved + 2.3
    WHERE id IN (
      SELECT passenger_id
      FROM ride_requests
      WHERE ride_id = NEW.id
      AND status = 'accepted'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_co2_saved_after_ride
  AFTER UPDATE ON rides
  FOR EACH ROW
  WHEN (OLD.status != 'completed' AND NEW.status = 'completed')
  EXECUTE FUNCTION update_co2_saved();