'use client'

import { useState } from 'react'
import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  VStack,
  Text,
  HStack,
  Icon,
  Box,
} from '@chakra-ui/react'
import { FaExclamationTriangle, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import { useEmergencyNotifications } from '@/hooks/useRealTimeNotifications'

interface EmergencyButtonProps {
  rideId?: string
  position?: 'fixed' | 'relative'
}

const EmergencyButton = ({ rideId, position = 'fixed' }: EmergencyButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const { sendEmergencyAlert } = useEmergencyNotifications()

  const getCurrentLocation = () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      )
    })
  }

  const handleEmergencyClick = () => {
    onOpen()
    // Get location when emergency button is clicked
    getCurrentLocation()
      .then((loc) => {
        setLocation(loc)
      })
      .catch((error) => {
        console.error('Failed to get location:', error)
        // Still allow emergency alert without location
        setLocation(null)
      })
  }

  const handleConfirmEmergency = async () => {
    setIsLoading(true)

    try {
      let currentLocation = location

      // Try to get fresh location if we don't have one
      if (!currentLocation) {
        try {
          currentLocation = await getCurrentLocation()
        } catch (error) {
          console.error('Could not get location:', error)
          // Use default location or continue without
          currentLocation = { latitude: 0, longitude: 0 }
        }
      }

      await sendEmergencyAlert(currentLocation)
      onClose()
    } catch (error) {
      console.error('Emergency alert failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const callEmergencyServices = () => {
    // This will work on mobile devices
    window.location.href = 'tel:911'
  }

  const buttonStyle = position === 'fixed' ? {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    fontSize: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  } : {
    borderRadius: '8px',
    width: '100%',
    height: '48px',
  }

  return (
    <>
      <Button
        colorScheme="red"
        onClick={handleEmergencyClick}
        {...buttonStyle}
        _hover={{ transform: 'scale(1.05)' }}
        _active={{ transform: 'scale(0.95)' }}
      >
        🚨
      </Button>

      <AlertDialog isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent mx={4}>
            <AlertDialogHeader>
              <HStack>
                <Icon as={FaExclamationTriangle} color="red.500" />
                <Text>Emergency Alert</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack spacing={4} align="stretch">
                <Text>
                  Are you in an emergency situation? This will:
                </Text>
                
                <VStack spacing={2} align="stretch" pl={4}>
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="blue.500" />
                    <Text fontSize="sm">Share your current location</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaPhone} color="green.500" />
                    <Text fontSize="sm">Notify your emergency contacts</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaExclamationTriangle} color="orange.500" />
                    <Text fontSize="sm">Alert LiftLink safety team</Text>
                  </HStack>
                </VStack>

                {location && (
                  <Box p={3} bg="blue.50" borderRadius="md">
                    <Text fontSize="sm" color="blue.700">
                      📍 Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </Text>
                  </Box>
                )}

                <Text fontSize="sm" color="gray.600">
                  For immediate help, call emergency services directly.
                </Text>
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <VStack spacing={3} width="100%">
                <HStack spacing={3} width="100%">
                  <Button
                    colorScheme="red"
                    onClick={callEmergencyServices}
                    flex={1}
                    leftIcon={<FaPhone />}
                  >
                    Call 911
                  </Button>
                  <Button
                    colorScheme="orange"
                    onClick={handleConfirmEmergency}
                    isLoading={isLoading}
                    loadingText="Sending..."
                    flex={1}
                  >
                    Send Alert
                  </Button>
                </HStack>
                
                <Button
                  variant="ghost"
                  onClick={onClose}
                  width="100%"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </VStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default EmergencyButton
