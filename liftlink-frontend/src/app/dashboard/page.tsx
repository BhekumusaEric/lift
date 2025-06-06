'use client'

import { useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  VStack,
  HStack,
  Avatar,
  Badge,
  Divider,
  useToast,
} from '@chakra-ui/react'
import { FaCar, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaPlus } from 'react-icons/fa'
import { StarIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthGuard from '@/components/AuthGuard'
import { useAuthStore } from '@/store/authStore'
import { useRidesStore } from '@/store/ridesStore'

export default function DashboardPage() {
  const { profile } = useAuthStore()
  const { userRides, rideRequests, fetchUserRides, fetchRideRequests } = useRidesStore()
  const toast = useToast()

  useEffect(() => {
    if (profile) {
      fetchUserRides()
      fetchRideRequests()
    }
  }, [profile, fetchUserRides, fetchRideRequests])

  const upcomingRides = userRides.filter(ride => 
    ride.status === 'scheduled' && new Date(ride.departure_time) > new Date()
  )

  const pendingRequests = rideRequests.filter(request => 
    request.status === 'pending'
  )

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
  }

  if (!profile) {
    return null
  }

  return (
    <AuthGuard>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Container maxW="container.xl" py={8} flex="1">
          <VStack spacing={8} align="stretch">
            {/* Welcome Section */}
            <Box>
              <Heading as="h1" size="xl" mb={2}>
                Welcome back, {profile.first_name}!
              </Heading>
              <Text color="gray.600">
                Here's what's happening with your rides
              </Text>
            </Box>

            {/* Stats Overview */}
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Total Rides</StatLabel>
                    <StatNumber>{userRides.length}</StatNumber>
                    <StatHelpText>All time</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Trust Score</StatLabel>
                    <HStack>
                      <StatNumber>{profile.trust_score}</StatNumber>
                      <StarIcon color="yellow.400" />
                    </HStack>
                    <StatHelpText>Based on reviews</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>CO₂ Saved</StatLabel>
                    <HStack>
                      <StatNumber>{profile.co2_saved}</StatNumber>
                      <Text>kg</Text>
                    </HStack>
                    <StatHelpText>Environmental impact</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Upcoming Rides</StatLabel>
                    <StatNumber>{upcomingRides.length}</StatNumber>
                    <StatHelpText>Next 30 days</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Quick Actions */}
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>Quick Actions</Heading>
                <HStack spacing={4} wrap="wrap">
                  <Button 
                    as={Link}
                    href="/find-ride"
                    leftIcon={<FaMapMarkerAlt />}
                    colorScheme="brand"
                    variant="outline"
                  >
                    Find a Ride
                  </Button>
                  <Button 
                    as={Link}
                    href="/offer-ride"
                    leftIcon={<FaPlus />}
                    colorScheme="brand"
                  >
                    Offer a Ride
                  </Button>
                  <Button 
                    as={Link}
                    href="/my-rides"
                    leftIcon={<FaCar />}
                    variant="ghost"
                  >
                    View All Rides
                  </Button>
                  <Button 
                    as={Link}
                    href="/profile"
                    leftIcon={<FaUser />}
                    variant="ghost"
                  >
                    Edit Profile
                  </Button>
                </HStack>
              </CardBody>
            </Card>

            {/* Upcoming Rides */}
            {upcomingRides.length > 0 && (
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>Upcoming Rides</Heading>
                  <VStack spacing={4} align="stretch">
                    {upcomingRides.slice(0, 3).map((ride) => (
                      <Box key={ride.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                        <HStack justify="space-between" mb={2}>
                          <HStack>
                            <Badge colorScheme="blue">
                              {ride.driver_id === profile.id ? 'Driving' : 'Passenger'}
                            </Badge>
                            <Text fontWeight="bold">
                              {ride.departure_location} → {ride.destination}
                            </Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.500">
                            {formatDateTime(ride.departure_time)}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          R{ride.price_per_seat} per seat • {ride.available_seats} seats available
                        </Text>
                      </Box>
                    ))}
                    {upcomingRides.length > 3 && (
                      <Button as={Link} href="/my-rides" variant="ghost" size="sm">
                        View all {upcomingRides.length} upcoming rides
                      </Button>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>Pending Ride Requests</Heading>
                  <VStack spacing={4} align="stretch">
                    {pendingRequests.slice(0, 3).map((request) => (
                      <Box key={request.id} p={4} border="1px" borderColor="orange.200" borderRadius="md">
                        <HStack justify="space-between" mb={2}>
                          <HStack>
                            <Avatar size="sm" name={request.passenger.first_name} />
                            <Text fontWeight="bold">
                              {request.passenger.first_name} {request.passenger.last_name}
                            </Text>
                            <Badge colorScheme="orange">Pending</Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.500">
                            {request.seats_requested} seat{request.seats_requested !== 1 ? 's' : ''}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          {request.ride.departure_location} → {request.ride.destination}
                        </Text>
                      </Box>
                    ))}
                    {pendingRequests.length > 3 && (
                      <Button as={Link} href="/my-rides" variant="ghost" size="sm">
                        View all {pendingRequests.length} pending requests
                      </Button>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Empty State */}
            {upcomingRides.length === 0 && pendingRequests.length === 0 && (
              <Card>
                <CardBody textAlign="center" py={12}>
                  <FaCar size={48} color="gray.300" style={{ margin: '0 auto 16px' }} />
                  <Heading size="md" mb={2} color="gray.500">
                    No upcoming rides
                  </Heading>
                  <Text color="gray.500" mb={6}>
                    Start by finding a ride or offering one to other passengers
                  </Text>
                  <HStack justify="center" spacing={4}>
                    <Button as={Link} href="/find-ride" colorScheme="brand">
                      Find a Ride
                    </Button>
                    <Button as={Link} href="/offer-ride" variant="outline">
                      Offer a Ride
                    </Button>
                  </HStack>
                </CardBody>
              </Card>
            )}
          </VStack>
        </Container>
        <Footer />
      </Box>
    </AuthGuard>
  )
}