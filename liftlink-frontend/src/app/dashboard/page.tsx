'use client'

import { useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Card,
  CardBody,
  Button,
  Stack,
  HStack,
  Avatar,
  Badge,
  Flex,
  Spacer,
  IconButton,
} from '@chakra-ui/react'
import {
  FaCar,
  FaUser,
  FaMapMarkerAlt,
  FaPlus,
  FaHistory,
  FaCreditCard,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaStar
} from 'react-icons/fa'
import Link from 'next/link'
import AuthGuard from '@/components/AuthGuard'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, profile, signOut, fetchProfile } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (user && !profile) {
      fetchProfile()
    }
  }, [user, profile, fetchProfile])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      router.push('/')
    } catch (error: any) {
      toast.error('Error signing out')
    }
  }

  const handleBookRide = () => {
    toast.success('Ride booking coming soon!')
    // TODO: Navigate to ride booking page
  }

  const handleBecomeDriver = () => {
    toast.success('Driver registration coming soon!')
    // TODO: Navigate to driver registration
  }

  if (!user) {
    return null
  }

  return (
    <AuthGuard requireAuth={true}>
      <Box minH="100vh" bg="gray.50">
        {/* Header */}
        <Box bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200">
          <Container maxW="7xl" py={4}>
            <Flex align="center">
              <Heading size="lg" color="blue.600">
                LiftLink
              </Heading>
              <Spacer />
              <HStack spacing={4}>
                <IconButton
                  aria-label="Notifications"
                  icon={<FaBell />}
                  variant="ghost"
                  size="sm"
                />
                <IconButton
                  aria-label="Settings"
                  icon={<FaCog />}
                  variant="ghost"
                  size="sm"
                />
                <Avatar
                  size="sm"
                  name={profile ? `${profile.first_name} ${profile.last_name}` : 'User'}
                />
                <IconButton
                  aria-label="Sign out"
                  icon={<FaSignOutAlt />}
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                />
              </HStack>
            </Flex>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxW="7xl" py={8}>
          <Stack spacing={8}>
            {/* Welcome Section */}
            <Box>
              <Heading size="xl" mb={2}>
                Welcome back, {profile?.first_name || 'User'}! 👋
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Ready for your next ride?
              </Text>
            </Box>

            {/* Quick Actions */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              <GridItem>
                <Card>
                  <CardBody>
                    <Stack spacing={4}>
                      <Flex align="center">
                        <Box p={3} bg="blue.100" borderRadius="lg" mr={4}>
                          <FaCar color="blue.600" size={24} />
                        </Box>
                        <Box>
                          <Heading size="md">Book a Ride</Heading>
                          <Text color="gray.600">Get where you need to go</Text>
                        </Box>
                      </Flex>
                      <Button
                        colorScheme="blue"
                        leftIcon={<FaPlus />}
                        onClick={handleBookRide}
                      >
                        Book Now
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem>
                <Card>
                  <CardBody>
                    <Stack spacing={4}>
                      <Flex align="center">
                        <Box p={3} bg="green.100" borderRadius="lg" mr={4}>
                          <FaUser color="green.600" size={24} />
                        </Box>
                        <Box>
                          <Heading size="md">Become a Driver</Heading>
                          <Text color="gray.600">Start earning with LiftLink</Text>
                        </Box>
                      </Flex>
                      <Button
                        colorScheme="green"
                        variant="outline"
                        onClick={handleBecomeDriver}
                      >
                        Get Started
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            {/* Dashboard Stats */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
              <GridItem>
                <Card>
                  <CardBody textAlign="center">
                    <Box p={3} bg="purple.100" borderRadius="lg" mx="auto" mb={3} w="fit-content">
                      <FaHistory color="purple.600" size={20} />
                    </Box>
                    <Heading size="lg">0</Heading>
                    <Text color="gray.600" fontSize="sm">Total Rides</Text>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem>
                <Card>
                  <CardBody textAlign="center">
                    <Box p={3} bg="orange.100" borderRadius="lg" mx="auto" mb={3} w="fit-content">
                      <FaMapMarkerAlt color="orange.600" size={20} />
                    </Box>
                    <Heading size="lg">0</Heading>
                    <Text color="gray.600" fontSize="sm">Miles Traveled</Text>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem>
                <Card>
                  <CardBody textAlign="center">
                    <Box p={3} bg="teal.100" borderRadius="lg" mx="auto" mb={3} w="fit-content">
                      <FaCreditCard color="teal.600" size={20} />
                    </Box>
                    <Heading size="lg">$0</Heading>
                    <Text color="gray.600" fontSize="sm">Total Spent</Text>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem>
                <Card>
                  <CardBody textAlign="center">
                    <Box p={3} bg="pink.100" borderRadius="lg" mx="auto" mb={3} w="fit-content">
                      <FaStar color="pink.600" size={20} />
                    </Box>
                    <HStack justify="center">
                      <Heading size="lg">{profile?.trust_score || 5.0}</Heading>
                      <FaStar color="gold" size={16} />
                    </HStack>
                    <Text color="gray.600" fontSize="sm">Trust Score</Text>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            {/* Recent Activity */}
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>Recent Activity</Heading>
                <Box textAlign="center" py={8}>
                  <Text color="gray.500" fontSize="lg">
                    No recent activity
                  </Text>
                  <Text color="gray.400" fontSize="sm" mt={2}>
                    Your ride history will appear here
                  </Text>
                </Box>
              </CardBody>
            </Card>

            {/* Quick Links */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
              <GridItem>
                <Link href="/profile">
                  <Card cursor="pointer" _hover={{ shadow: 'md' }}>
                    <CardBody textAlign="center">
                      <FaUser size={24} color="gray.600" />
                      <Text mt={2} fontWeight="medium">Profile Settings</Text>
                    </CardBody>
                  </Card>
                </Link>
              </GridItem>

              <GridItem>
                <Link href="/payment-methods">
                  <Card cursor="pointer" _hover={{ shadow: 'md' }}>
                    <CardBody textAlign="center">
                      <FaCreditCard size={24} color="gray.600" />
                      <Text mt={2} fontWeight="medium">Payment Methods</Text>
                    </CardBody>
                  </Card>
                </Link>
              </GridItem>

              <GridItem>
                <Link href="/ride-history">
                  <Card cursor="pointer" _hover={{ shadow: 'md' }}>
                    <CardBody textAlign="center">
                      <FaHistory size={24} color="gray.600" />
                      <Text mt={2} fontWeight="medium">Ride History</Text>
                    </CardBody>
                  </Card>
                </Link>
              </GridItem>
            </Grid>

            {/* Account Type Badge */}
            <Card>
              <CardBody textAlign="center">
                <Badge
                  colorScheme={profile?.user_type === 'driver' ? 'green' : profile?.user_type === 'both' ? 'purple' : 'blue'}
                  fontSize="md"
                  px={4}
                  py={2}
                >
                  {profile?.user_type === 'both' ? 'Driver & Passenger' :
                   profile?.user_type === 'driver' ? 'Driver' : 'Passenger'} Account
                </Badge>
                <Text color="gray.600" fontSize="sm" mt={2}>
                  {profile?.user_type === 'passenger' ? 'Want to earn money? Become a driver!' :
                   profile?.user_type === 'driver' ? 'Thanks for being a LiftLink driver!' :
                   'You have full access to all LiftLink features!'}
                </Text>
              </CardBody>
            </Card>
          </Stack>
        </Container>
      </Box>
    </AuthGuard>
  )
}