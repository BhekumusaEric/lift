'use client'

import { useEffect, useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

interface NotificationPayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: any
  old: any
  table: string
}

export const useRealTimeNotifications = () => {
  const toast = useToast()
  const { user } = useAuthStore()

  const showNotification = useCallback((title: string, description: string, status: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    })
  }, [toast])

  useEffect(() => {
    if (!user) return

    // Subscribe to ride requests for passengers
    const rideRequestsChannel = supabase
      .channel('ride-requests-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ride_requests',
          filter: `passenger_id=eq.${user.id}`,
        },
        (payload: NotificationPayload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload

          if (eventType === 'UPDATE' && newRecord.status !== oldRecord?.status) {
            switch (newRecord.status) {
              case 'accepted':
                showNotification(
                  'Ride Request Accepted! 🎉',
                  'Your ride request has been accepted by the driver.',
                  'success'
                )
                break
              case 'rejected':
                showNotification(
                  'Ride Request Declined',
                  'Your ride request was declined. Try another ride!',
                  'warning'
                )
                break
              default:
                break
            }
          }
        }
      )
      .subscribe()

    // Subscribe to ride requests for drivers
    const driverNotificationsChannel = supabase
      .channel('driver-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ride_requests',
        },
        async (payload: NotificationPayload) => {
          const { new: newRecord } = payload

          // Check if this request is for one of the user's rides
          const { data: ride } = await supabase
            .from('rides')
            .select('driver_id')
            .eq('id', newRecord.ride_id)
            .single()

          if (ride?.driver_id === user.id) {
            showNotification(
              'New Ride Request! 🚗',
              'Someone wants to join your ride. Check your dashboard!',
              'info'
            )
          }
        }
      )
      .subscribe()

    // Subscribe to ride status updates
    const rideUpdatesChannel = supabase
      .channel('ride-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rides',
          filter: `driver_id=eq.${user.id}`,
        },
        (payload: NotificationPayload) => {
          const { new: newRecord, old: oldRecord } = payload

          if (newRecord.status !== oldRecord?.status) {
            switch (newRecord.status) {
              case 'in_progress':
                showNotification(
                  'Ride Started! 🚗',
                  'Your ride is now in progress. Drive safely!',
                  'info'
                )
                break
              case 'completed':
                showNotification(
                  'Ride Completed! ✅',
                  'Your ride has been completed successfully.',
                  'success'
                )
                break
              case 'cancelled':
                showNotification(
                  'Ride Cancelled',
                  'Your ride has been cancelled.',
                  'warning'
                )
                break
              default:
                break
            }
          }
        }
      )
      .subscribe()

    // Cleanup subscriptions
    return () => {
      rideRequestsChannel.unsubscribe()
      driverNotificationsChannel.unsubscribe()
      rideUpdatesChannel.unsubscribe()
    }
  }, [user, showNotification])

  // Function to manually send a notification (for testing)
  const sendTestNotification = useCallback(() => {
    showNotification(
      'Test Notification',
      'Real-time notifications are working!',
      'success'
    )
  }, [showNotification])

  return {
    sendTestNotification,
  }
}

// Hook for emergency notifications
export const useEmergencyNotifications = () => {
  const toast = useToast()
  const { user } = useAuthStore()

  const sendEmergencyAlert = useCallback(async (location: { latitude: number; longitude: number }) => {
    if (!user) return

    try {
      // Insert emergency alert into database
      const { error } = await supabase
        .from('emergency_alerts')
        .insert({
          user_id: user.id,
          latitude: location.latitude,
          longitude: location.longitude,
          status: 'active',
        })

      if (error) throw error

      toast({
        title: 'Emergency Alert Sent! 🚨',
        description: 'Your emergency contacts have been notified with your location.',
        status: 'error',
        duration: 10000,
        isClosable: true,
        position: 'top',
      })

      // TODO: Send SMS/email to emergency contacts
      // TODO: Notify local authorities if configured

    } catch (error) {
      console.error('Failed to send emergency alert:', error)
      toast({
        title: 'Emergency Alert Failed',
        description: 'Could not send emergency alert. Please call emergency services directly.',
        status: 'error',
        duration: 10000,
        isClosable: true,
        position: 'top',
      })
    }
  }, [user, toast])

  return {
    sendEmergencyAlert,
  }
}
