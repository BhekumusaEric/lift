'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Avatar,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  Badge,
  HStack,
  VStack,
  Divider,
  SimpleGrid,
  IconButton,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react'
import { EditIcon, StarIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons'
import { FaCar, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaLeaf } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Mock user data
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+27 71 234 5678',
  profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
  bio: 'Regular commuter between Johannesburg and Pretoria. I enjoy meeting new people and sharing rides to reduce costs and traffic.',
  userType: 'both',
  isDriverVerified: true,
  trustScore: 4.7,
  memberSince: '2022-03-15',
  totalRides: 42,
  totalRatings: 38,
  co2Saved: 156,
}

// Mock rides data
const mockRides = [
  {
    id: 1,
    role: 'driver',
    departure: 'Johannesburg',
    destination: 'Pretoria',
    departureTime: '2023-06-10T08:00:00',
    status: 'completed',
    passengers: 3,
    price: 50,
  },
  {
    id: 2,
    role: 'passenger',
    departure: 'Pretoria',
    destination: 'Johannesburg',
    departureTime: '2023-06-11T17:30:00',
    status: 'completed',
    price: 45,
  },
  {
    id: 3,
    role: 'driver',
    departure: 'Johannesburg',
    destination: 'Soweto',
    departureTime: '2023-06-15T09:00:00',
    status: 'scheduled',
    passengers: 2,
    price: 35,
  },
]

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    reviewer: {
      name: 'Sarah Williams',
      profilePic: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    rating: 5,
    comment: 'John is a fantastic driver! Very punctual and friendly. The car was clean and the ride was smooth.',
    date: '2023-06-01',
  },
  {
    id: 2,
    reviewer: {
      name: 'Mike Johnson',
      profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    rating: 4,
    comment: 'Good conversation and reliable driver. Would ride with him again.',
    date: '2023-05-20',
  },
  {
    id: 3,
    reviewer: {
      name: 'Emily Davis',
      profilePic: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    rating: 5,
    comment: 'Very accommodating and friendly. Made the commute much more enjoyable!',
    date: '2023-05-15',
  },
]

export default function ProfilePage() {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editForm, setEditForm] = useState({
    name: mockUser.name,
    phone: mockUser.phone,
    bio: mockUser.bio,
  })

  const handleEditProfile = () => {
    // This would be replaced with actual API call
    console.log('Updated profile:', editForm)
    
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
    
    onClose()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

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

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Container maxW="container.xl" py={8} flex="1">
        <Stack spacing={8}>
          {/* Profile Header */}
          <Card>
            <CardBody>
              <Flex 
                direction={{ base: 'column', md: 'row' }} 
                align={{ base: 'center', md: 'flex-start' }}
                gap={6}
              >
                <Avatar 
                  size="2xl" 
                  src={mockUser.profilePic} 
                  name={mockUser.name}
                  border="4px solid"
                  borderColor="brand.500"
                />
                
                <Box flex="1">
                  <Flex 
                    justify="space-between" 
                    align="center"
                    direction={{ base: 'column', sm: 'row' }}
                    gap={{ base: 4, sm: 0 }}
                    mb={4}
                  >
                    <Box>
                      <Heading as="h1" size="xl">
                        {mockUser.name}
                      </Heading>
                      <HStack mt={1}>
                        <Badge colorScheme="brand">
                          {mockUser.userType === 'driver' ? 'Driver' : 
                           mockUser.userType === 'passenger' ? 'Passenger' : 
                           'Driver & Passenger'}
                        </Badge>
                        {mockUser.isDriverVerified && (
                          <Badge colorScheme="green">Verified Driver</Badge>
                        )}
                        <HStack>
                          <StarIcon color="yellow.400" />
                          <Text fontWeight="bold">{mockUser.trustScore}</Text>
                        </HStack>
                      </HStack>
                    </Box>
                    
                    <Button 
                      leftIcon={<EditIcon />} 
                      colorScheme="brand" 
                      variant="outline"
                      onClick={onOpen}
                    >
                      Edit Profile
                    </Button>
                  </Flex>
                  
                  <Text mb={4}>{mockUser.bio}</Text>
                  
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                    <HStack>
                      <Box color="gray.500" w="100px">Email:</Box>
                      <Text>{mockUser.email}</Text>
                    </HStack>
                    <HStack>
                      <Box color="gray.500" w="100px">Phone:</Box>
                      <Text>{mockUser.phone}</Text>
                    </HStack>
                    <HStack>
                      <Box color="gray.500" w="100px">Member since:</Box>
                      <Text>{formatDate(mockUser.memberSince)}</Text>
                    </HStack>
                  </SimpleGrid>
                </Box>
              </Flex>
            </CardBody>
          </Card>
          
          {/* Stats */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Rides</StatLabel>
                  <StatNumber>{mockUser.totalRides}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Trust Score</StatLabel>
                  <HStack>
                    <StatNumber>{mockUser.trustScore}</StatNumber>
                    <StarIcon color="yellow.400" />
                  </HStack>
                  <Progress 
                    value={(mockUser.trustScore / 5) * 100} 
                    colorScheme="yellow" 
                    size="sm" 
                    mt={2}
                  />
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Reviews</StatLabel>
                  <StatNumber>{mockUser.totalRatings}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>CO₂ Saved</StatLabel>
                  <HStack>
                    <StatNumber>{mockUser.co2Saved}</StatNumber>
                    <Text>kg</Text>
                    <FaLeaf color="green" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
          
          {/* Tabs for Rides and Reviews */}
          <Tabs colorScheme="brand" isLazy>
            <TabList>
              <Tab>My Rides</Tab>
              <Tab>Reviews</Tab>
            </TabList>
            
            <TabPanels>
              {/* Rides Tab */}
              <TabPanel px={0}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {mockRides.map((ride) => (
                    <Card key={ride.id} variant="outline">
                      <CardHeader bg={ride.status === 'completed' ? 'gray.50' : 'brand.50'}>
                        <Flex justify="space-between" align="center">
                          <HStack>
                            <Box 
                              bg={ride.role === 'driver' ? 'blue.100' : 'green.100'} 
                              color={ride.role === 'driver' ? 'blue.700' : 'green.700'}
                              p={2}
                              borderRadius="md"
                            >
                              {ride.role === 'driver' ? <FaCar /> : <FaUser />}
                            </Box>
                            <Text fontWeight="bold">
                              {ride.role === 'driver' ? 'You drove' : 'You rode with'}
                            </Text>
                          </HStack>
                          <Badge 
                            colorScheme={
                              ride.status === 'completed' ? 'gray' : 
                              ride.status === 'scheduled' ? 'green' : 
                              'red'
                            }
                          >
                            {ride.status}
                          </Badge>
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <VStack align="stretch" spacing={3}>
                          <HStack>
                            <FaMapMarkerAlt />
                            <Text fontWeight="medium">{ride.departure} → {ride.destination}</Text>
                          </HStack>
                          <HStack>
                            <FaCalendarAlt />
                            <Text>{formatDateTime(ride.departureTime)}</Text>
                          </HStack>
                          {ride.role === 'driver' && (
                            <HStack>
                              <FaUser />
                              <Text>{ride.passengers} passenger{ride.passengers !== 1 ? 's' : ''}</Text>
                            </HStack>
                          )}
                          <HStack>
                            <FaMoneyBillWave />
                            <Text>R{ride.price}</Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </TabPanel>
              
              {/* Reviews Tab */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  {mockReviews.map((review) => (
                    <Card key={review.id} variant="outline">
                      <CardBody>
                        <HStack mb={4}>
                          <Avatar 
                            size="md" 
                            src={review.reviewer.profilePic} 
                            name={review.reviewer.name} 
                          />
                          <Box>
                            <Text fontWeight="bold">{review.reviewer.name}</Text>
                            <HStack>
                              {[...Array(5)].map((_, i) => (
                                <StarIcon 
                                  key={i} 
                                  color={i < review.rating ? 'yellow.400' : 'gray.200'} 
                                />
                              ))}
                              <Text color="gray.500" fontSize="sm">
                                {formatDate(review.date)}
                              </Text>
                            </HStack>
                          </Box>
                        </HStack>
                        <Text>{review.comment}</Text>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Container>
      
      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea 
                  value={editForm.bio} 
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleEditProfile}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      <Footer />
    </Box>
  )
}
