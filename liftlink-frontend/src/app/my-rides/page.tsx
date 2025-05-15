'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
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
  Avatar,
  IconButton,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
  Textarea,
  Select,
} from '@chakra-ui/react'
import { ChevronDownIcon, StarIcon } from '@chakra-ui/icons'
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaMoneyBillWave, FaEllipsisV } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Mock data for rides
const mockRides = [
  {
    id: 1,
    role: 'driver',
    departure: 'Johannesburg',
    destination: 'Pretoria',
    departureTime: '2023-06-20T08:00:00',
    status: 'scheduled',
    passengers: [
      {
        id: 101,
        name: 'Sarah Williams',
        profilePic: 'https://randomuser.me/api/portraits/women/4.jpg',
        rating: 4.9,
        status: 'accepted',
      },
      {
        id: 102,
        name: 'Mike Johnson',
        profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
        rating: 4.2,
        status: 'pending',
      },
    ],
    availableSeats: 2,
    price: 50,
  },
  {
    id: 2,
    role: 'passenger',
    departure: 'Pretoria',
    destination: 'Johannesburg',
    departureTime: '2023-06-21T17:30:00',
    status: 'scheduled',
    driver: {
      id: 201,
      name: 'John Smith',
      profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 4.7,
    },
    price: 45,
    requestStatus: 'accepted',
  },
  {
    id: 3,
    role: 'driver',
    departure: 'Johannesburg',
    destination: 'Soweto',
    departureTime: '2023-06-15T09:00:00',
    status: 'completed',
    passengers: [
      {
        id: 103,
        name: 'Emily Davis',
        profilePic: 'https://randomuser.me/api/portraits/women/5.jpg',
        rating: 4.8,
        status: 'accepted',
      },
    ],
    availableSeats: 0,
    price: 35,
  },
  {
    id: 4,
    role: 'passenger',
    departure: 'Soweto',
    destination: 'Sandton',
    departureTime: '2023-06-10T10:15:00',
    status: 'completed',
    driver: {
      id: 202,
      name: 'Jane Doe',
      profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
      rating: 4.5,
    },
    price: 40,
    requestStatus: 'accepted',
  },
]

export default function MyRidesPage() {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedRide, setSelectedRide] = useState<any>(null)
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  })
  const [activeTab, setActiveTab] = useState(0)
  
  const upcomingRides = mockRides.filter(ride => 
    ride.status === 'scheduled' || ride.status === 'in_progress'
  )
  
  const pastRides = mockRides.filter(ride => 
    ride.status === 'completed' || ride.status === 'cancelled'
  )

  const handleRideAction = (action: string, ride: any) => {
    // This would be replaced with actual API calls
    console.log(`Action: ${action}, Ride ID: ${ride.id}`)
    
    switch (action) {
      case 'cancel':
        toast({
          title: 'Ride cancelled',
          description: 'Your ride has been cancelled successfully',
          status: 'info',
          duration: 5000,
          isClosable: true,
        })
        break
      case 'start':
        toast({
          title: 'Ride started',
          description: 'Your ride has been marked as in progress',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        break
      case 'complete':
        toast({
          title: 'Ride completed',
          description: 'Your ride has been marked as completed',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        break
      case 'review':
        setSelectedRide(ride)
        onOpen()
        break
      default:
        break
    }
  }

  const handleSubmitReview = () => {
    // This would be replaced with actual API call
    console.log('Review data:', {
      rideId: selectedRide.id,
      ...reviewData,
    })
    
    toast({
      title: 'Review submitted',
      description: 'Thank you for your feedback!',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
    
    onClose()
    setReviewData({
      rating: 5,
      comment: '',
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
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              My Rides
            </Heading>
            <Text color="gray.600">
              Manage your upcoming and past rides
            </Text>
          </Box>
          
          <Tabs 
            colorScheme="brand" 
            index={activeTab} 
            onChange={(index) => setActiveTab(index)}
          >
            <TabList>
              <Tab>Upcoming ({upcomingRides.length})</Tab>
              <Tab>Past ({pastRides.length})</Tab>
            </TabList>
            
            <TabPanels>
              {/* Upcoming Rides Tab */}
              <TabPanel px={0}>
                {upcomingRides.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    {upcomingRides.map((ride) => (
                      <Card key={ride.id} variant="outline">
                        <CardHeader bg={ride.role === 'driver' ? 'blue.50' : 'green.50'}>
                          <Flex justify="space-between" align="center">
                            <HStack>
                              <Badge 
                                colorScheme={ride.role === 'driver' ? 'blue' : 'green'}
                                px={2}
                                py={1}
                                borderRadius="md"
                              >
                                {ride.role === 'driver' ? 'As Driver' : 'As Passenger'}
                              </Badge>
                              <Text fontWeight="bold">
                                {ride.departure} → {ride.destination}
                              </Text>
                            </HStack>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<FaEllipsisV />}
                                variant="ghost"
                                aria-label="Options"
                              />
                              <MenuList>
                                {ride.role === 'driver' && (
                                  <>
                                    <MenuItem onClick={() => handleRideAction('start', ride)}>
                                      Start Ride
                                    </MenuItem>
                                    <MenuItem onClick={() => handleRideAction('complete', ride)}>
                                      Complete Ride
                                    </MenuItem>
                                  </>
                                )}
                                <MenuItem onClick={() => handleRideAction('cancel', ride)}>
                                  Cancel Ride
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Flex>
                        </CardHeader>
                        <CardBody>
                          <VStack align="stretch" spacing={4}>
                            <HStack>
                              <Box color="gray.500" minW="100px">
                                <FaCalendarAlt />
                              </Box>
                              <Text>{formatDateTime(ride.departureTime)}</Text>
                            </HStack>
                            
                            {ride.role === 'driver' ? (
                              <>
                                <HStack>
                                  <Box color="gray.500" minW="100px">
                                    <FaUser />
                                  </Box>
                                  <Text>{ride.passengers.length} passenger(s), {ride.availableSeats} seat(s) available</Text>
                                </HStack>
                                
                                <Divider />
                                
                                <Box>
                                  <Text fontWeight="medium" mb={2}>Passengers:</Text>
                                  {ride.passengers.map((passenger: any) => (
                                    <HStack key={passenger.id} mb={2}>
                                      <Avatar size="sm" src={passenger.profilePic} name={passenger.name} />
                                      <Text>{passenger.name}</Text>
                                      <Badge colorScheme={passenger.status === 'accepted' ? 'green' : 'yellow'}>
                                        {passenger.status}
                                      </Badge>
                                    </HStack>
                                  ))}
                                </Box>
                              </>
                            ) : (
                              <>
                                <HStack>
                                  <Box color="gray.500" minW="100px">
                                    <FaUser />
                                  </Box>
                                  <HStack>
                                    <Avatar size="sm" src={ride.driver.profilePic} name={ride.driver.name} />
                                    <Text>{ride.driver.name}</Text>
                                    <HStack>
                                      <StarIcon color="yellow.400" />
                                      <Text>{ride.driver.rating}</Text>
                                    </HStack>
                                  </HStack>
                                </HStack>
                                
                                <HStack>
                                  <Box color="gray.500" minW="100px">
                                    <FaMoneyBillWave />
                                  </Box>
                                  <Text>R{ride.price}</Text>
                                </HStack>
                                
                                <HStack>
                                  <Box color="gray.500" minW="100px">
                                    Status:
                                  </Box>
                                  <Badge colorScheme={ride.requestStatus === 'accepted' ? 'green' : 'yellow'}>
                                    {ride.requestStatus}
                                  </Badge>
                                </HStack>
                              </>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Box textAlign="center" py={10}>
                    <Text fontSize="lg" color="gray.500">
                      You don't have any upcoming rides
                    </Text>
                    <HStack justify="center" mt={4} spacing={4}>
                      <Button 
                        as="a" 
                        href="/find-ride" 
                        colorScheme="brand" 
                        variant="outline"
                      >
                        Find a Ride
                      </Button>
                      <Button 
                        as="a" 
                        href="/offer-ride" 
                        colorScheme="brand"
                      >
                        Offer a Ride
                      </Button>
                    </HStack>
                  </Box>
                )}
              </TabPanel>
              
              {/* Past Rides Tab */}
              <TabPanel px={0}>
                {pastRides.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    {pastRides.map((ride) => (
                      <Card key={ride.id} variant="outline">
                        <CardHeader bg="gray.50">
                          <Flex justify="space-between" align="center">
                            <HStack>
                              <Badge 
                                colorScheme={ride.role === 'driver' ? 'blue' : 'green'}
                                px={2}
                                py={1}
                                borderRadius="md"
                              >
                                {ride.role === 'driver' ? 'As Driver' : 'As Passenger'}
                              </Badge>
                              <Text fontWeight="bold">
                                {ride.departure} → {ride.destination}
                              </Text>
                            </HStack>
                            <Badge 
                              colorScheme={
                                ride.status === 'completed' ? 'green' : 
                                ride.status === 'cancelled' ? 'red' : 'gray'
                              }
                            >
                              {ride.status}
                            </Badge>
                          </Flex>
                        </CardHeader>
                        <CardBody>
                          <VStack align="stretch" spacing={4}>
                            <HStack>
                              <Box color="gray.500" minW="100px">
                                <FaCalendarAlt />
                              </Box>
                              <Text>{formatDateTime(ride.departureTime)}</Text>
                            </HStack>
                            
                            {ride.role === 'driver' ? (
                              <>
                                <HStack>
                                  <Box color="gray.500" minW="100px">
                                    <FaUser />
                                  </Box>
                                  <Text>{ride.passengers.length} passenger(s)</Text>
                                </HStack>
                                
                                <Divider />
                                
                                <Box>
                                  <Text fontWeight="medium" mb={2}>Passengers:</Text>
                                  {ride.passengers.map((passenger: any) => (
                                    <HStack key={passenger.id} mb={2}>
                                      <Avatar size="sm" src={passenger.profilePic} name={passenger.name} />
                                      <Text>{passenger.name}</Text>
                                      <Button 
                                        size="xs" 
                                        colorScheme="yellow"
                                        leftIcon={<StarIcon />}
                                        onClick={() => handleRideAction('review', {
                                          ...ride,
                                          reviewTarget: passenger
                                        })}
                                      >
                                        Review
                                      </Button>
                                    </HStack>
                                  ))}
                                </Box>
                              </>
                            ) : (
                              <>
                                <HStack>
                                  <Box color="gray.500" minW="100px">
                                    <FaUser />
                                  </Box>
                                  <HStack>
                                    <Avatar size="sm" src={ride.driver.profilePic} name={ride.driver.name} />
                                    <Text>{ride.driver.name}</Text>
                                    <HStack>
                                      <StarIcon color="yellow.400" />
                                      <Text>{ride.driver.rating}</Text>
                                    </HStack>
                                  </HStack>
                                </HStack>
                                
                                <HStack>
                                  <Box color="gray.500" minW="100px">
                                    <FaMoneyBillWave />
                                  </Box>
                                  <Text>R{ride.price}</Text>
                                </HStack>
                                
                                <Button 
                                  colorScheme="yellow"
                                  leftIcon={<StarIcon />}
                                  onClick={() => handleRideAction('review', {
                                    ...ride,
                                    reviewTarget: ride.driver
                                  })}
                                >
                                  Review Driver
                                </Button>
                              </>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Box textAlign="center" py={10}>
                    <Text fontSize="lg" color="gray.500">
                      You don't have any past rides
                    </Text>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Container>
      
      {/* Review Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Review {selectedRide?.reviewTarget?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Rating</FormLabel>
                <Select 
                  value={reviewData.rating} 
                  onChange={(e) => setReviewData({...reviewData, rating: parseInt(e.target.value)})}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Below Average</option>
                  <option value="1">1 - Poor</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Comment</FormLabel>
                <Textarea 
                  value={reviewData.comment} 
                  onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                  placeholder="Share your experience..."
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleSubmitReview}>
              Submit Review
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      <Footer />
    </Box>
  )
}
