export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          first_name: string
          last_name: string
          phone_number: string | null
          user_type: 'passenger' | 'driver' | 'both'
          is_driver_verified: boolean
          bio: string | null
          trust_score: number
          co2_saved: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          phone_number?: string | null
          user_type?: 'passenger' | 'driver' | 'both'
          is_driver_verified?: boolean
          bio?: string | null
          trust_score?: number
          co2_saved?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          phone_number?: string | null
          user_type?: 'passenger' | 'driver' | 'both'
          is_driver_verified?: boolean
          bio?: string | null
          trust_score?: number
          co2_saved?: number
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          user_id: string
          make: string
          model: string
          year: number
          color: string
          license_plate: string
          capacity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          make: string
          model: string
          year: number
          color: string
          license_plate: string
          capacity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          make?: string
          model?: string
          year?: number
          color?: string
          license_plate?: string
          capacity?: number
          created_at?: string
          updated_at?: string
        }
      }
      rides: {
        Row: {
          id: string
          driver_id: string
          vehicle_id: string | null
          departure_location: string
          destination: string
          departure_time: string
          available_seats: number
          price_per_seat: number
          is_flexible_price: boolean
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          driver_id: string
          vehicle_id?: string | null
          departure_location: string
          destination: string
          departure_time: string
          available_seats: number
          price_per_seat: number
          is_flexible_price?: boolean
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          driver_id?: string
          vehicle_id?: string | null
          departure_location?: string
          destination?: string
          departure_time?: string
          available_seats?: number
          price_per_seat?: number
          is_flexible_price?: boolean
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ride_requests: {
        Row: {
          id: string
          ride_id: string
          passenger_id: string
          status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
          seats_requested: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ride_id: string
          passenger_id: string
          status?: 'pending' | 'accepted' | 'rejected' | 'cancelled'
          seats_requested?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ride_id?: string
          passenger_id?: string
          status?: 'pending' | 'accepted' | 'rejected' | 'cancelled'
          seats_requested?: number
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          reviewer_id: string
          reviewee_id: string
          ride_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          reviewee_id: string
          ride_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reviewer_id?: string
          reviewee_id?: string
          ride_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
    Functions: {
      calculate_trust_score: {
        Args: { user_id: string }
        Returns: number
      }
    }
  }
}