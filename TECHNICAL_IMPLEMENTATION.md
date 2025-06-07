# LiftLink Technical Implementation Guide
## Critical Features for Uber/Bolt Competition

### 🚀 **Priority 1: Payment Integration (Week 1)**

#### **Stripe Integration Setup**
```typescript
// lib/stripe.ts
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export { stripePromise };
```

#### **Payment Component**
```typescript
// components/PaymentForm.tsx
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = ({ amount, onSuccess }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });

    if (!error) {
      // Process payment with backend
      await processPayment(paymentMethod.id, amount);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay ${amount}
      </button>
    </form>
  );
};
```

#### **Backend Payment Processing**
```typescript
// supabase/functions/payments/index.ts
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

export const processPayment = async (paymentMethodId: string, amount: number) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
    payment_method: paymentMethodId,
    confirm: true,
    return_url: 'https://your-app.com/payment-success',
  });

  return paymentIntent;
};
```

---

### 🔔 **Priority 2: Real-time Notifications (Week 1)**

#### **Supabase Realtime Setup**
```typescript
// lib/realtime.ts
import { supabase } from './supabase';

export const subscribeToRideUpdates = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('ride-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'ride_requests',
        filter: `passenger_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToDriverUpdates = (driverId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('driver-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rides',
        filter: `driver_id=eq.${driverId}`,
      },
      callback
    )
    .subscribe();
};
```

#### **Push Notification Component**
```typescript
// hooks/useNotifications.ts
import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { subscribeToRideUpdates } from '@/lib/realtime';

export const useNotifications = (userId: string) => {
  const toast = useToast();

  useEffect(() => {
    const subscription = subscribeToRideUpdates(userId, (payload) => {
      const { eventType, new: newRecord } = payload;
      
      if (eventType === 'INSERT') {
        toast({
          title: 'New Ride Request',
          description: 'You have a new ride request!',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      } else if (eventType === 'UPDATE' && newRecord.status === 'accepted') {
        toast({
          title: 'Ride Accepted!',
          description: 'Your ride request has been accepted.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, toast]);
};
```

---

### 📍 **Priority 3: Live GPS Tracking (Week 2)**

#### **GPS Tracking Hook**
```typescript
// hooks/useGPSTracking.ts
import { useState, useEffect } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export const useGPSTracking = (isActive: boolean) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setError(null);
      },
      (error) => {
        setError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isActive]);

  return { location, error };
};
```

#### **Live Tracking Component**
```typescript
// components/LiveTracking.tsx
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useGPSTracking } from '@/hooks/useGPSTracking';

const LiveTracking = ({ rideId, isDriver }: LiveTrackingProps) => {
  const { location } = useGPSTracking(true);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (location && isDriver) {
      // Update driver location in database
      updateDriverLocation(rideId, location);
    }
  }, [location, rideId, isDriver]);

  const updateDriverLocation = async (rideId: string, location: Location) => {
    await supabase
      .from('ride_locations')
      .upsert({
        ride_id: rideId,
        latitude: location.latitude,
        longitude: location.longitude,
        updated_at: new Date().toISOString(),
      });
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px' }}
      center={location ? { lat: location.latitude, lng: location.longitude } : undefined}
      zoom={15}
    >
      {location && (
        <Marker
          position={{ lat: location.latitude, lng: location.longitude }}
          icon={isDriver ? '/driver-icon.png' : '/passenger-icon.png'}
        />
      )}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};
```

---

### 🛡️ **Priority 4: Safety Features (Week 2)**

#### **Emergency Button Component**
```typescript
// components/EmergencyButton.tsx
import { useState } from 'react';
import { Button, AlertDialog, AlertDialogOverlay, AlertDialogContent } from '@chakra-ui/react';
import { useGPSTracking } from '@/hooks/useGPSTracking';

const EmergencyButton = ({ rideId }: { rideId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { location } = useGPSTracking(true);

  const handleEmergency = async () => {
    if (!location) return;

    // Send emergency alert
    await supabase.from('emergency_alerts').insert({
      ride_id: rideId,
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date().toISOString(),
    });

    // Notify emergency contacts
    await notifyEmergencyContacts(rideId, location);
    
    // Send to local authorities if configured
    await sendEmergencyAlert(location);
  };

  return (
    <>
      <Button
        colorScheme="red"
        size="lg"
        onClick={() => setIsOpen(true)}
        position="fixed"
        bottom="20px"
        right="20px"
        borderRadius="50%"
        width="60px"
        height="60px"
      >
        🚨
      </Button>
      
      <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Emergency Alert</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to send an emergency alert? This will notify your emergency contacts and share your location.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button colorScheme="red" onClick={handleEmergency} ml={3}>
                Send Alert
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
```

---

### 💬 **Priority 5: In-App Chat (Week 3)**

#### **Chat Component**
```typescript
// components/RideChat.tsx
import { useState, useEffect, useRef } from 'react';
import { Box, Input, Button, VStack, HStack, Text } from '@chakra-ui/react';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

const RideChat = ({ rideId, currentUserId }: RideChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load existing messages
    loadMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`ride-chat-${rideId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ride_messages',
          filter: `ride_id=eq.${rideId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [rideId]);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('ride_messages')
      .select('*')
      .eq('ride_id', rideId)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await supabase.from('ride_messages').insert({
      ride_id: rideId,
      sender_id: currentUserId,
      message: newMessage,
    });

    setNewMessage('');
  };

  return (
    <VStack spacing={4} height="400px">
      <Box flex={1} overflowY="auto" width="100%">
        {messages.map((message) => (
          <HStack
            key={message.id}
            justify={message.sender_id === currentUserId ? 'flex-end' : 'flex-start'}
            mb={2}
          >
            <Box
              bg={message.sender_id === currentUserId ? 'blue.500' : 'gray.200'}
              color={message.sender_id === currentUserId ? 'white' : 'black'}
              px={3}
              py={2}
              borderRadius="lg"
              maxWidth="70%"
            >
              <Text>{message.message}</Text>
            </Box>
          </HStack>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      
      <HStack width="100%">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage} colorScheme="blue">
          Send
        </Button>
      </HStack>
    </VStack>
  );
};
```

---

### 📱 **Database Schema Updates**

```sql
-- Add new tables for enhanced features

-- Real-time locations
CREATE TABLE ride_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES rides(id) NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Chat messages
CREATE TABLE ride_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES rides(id) NOT NULL,
  sender_id uuid REFERENCES users(id) NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Emergency alerts
CREATE TABLE emergency_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES rides(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Payment records
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES rides(id) NOT NULL,
  payer_id uuid REFERENCES users(id) NOT NULL,
  amount numeric NOT NULL,
  stripe_payment_intent_id text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
```

This implementation guide provides the foundation for the most critical features needed to compete with Uber and Bolt. Each feature is designed to be implemented incrementally while maintaining the existing codebase structure.
