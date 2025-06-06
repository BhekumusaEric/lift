'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Badge,
  HStack,
  Divider,
  InputGroup,
  InputLeftElement,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { SearchIcon, TimeIcon, StarIcon } from '@chakra-ui/icons'
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaMoneyBillWave, FaFilter } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthGuard from '@/components/AuthGuard'
import { useRidesStore } from '@/store/ridesStore'

export default function FindRidePage() {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    destination: '',
    date: '',
    seats: 1,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [maxPrice, setMaxPrice] = useState(100)
  const [showMaxPriceTooltip, setShowMaxPriceTooltip] = useState(false)
  const [sortBy, setSortBy] = useState('departureTime')
  const [selectedRide, setSelectedRide] = useState<any>(null)
  const [seatsToRequest, setSeatsToRequest] = useState(1)
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { rides, loading, searchRides, requestRide } = useRidesStore()
  const toast = useToast()

  useEffect(() => {
    // Load initial rides
    searchRides({})
  }, [searchRides])

  const handleSearch = async () => {
    try {
      await searchRides({
        departure: searchParams.departure || undefined,
        destination: searchParams.destination || undefined,
        date: searchParams.date || undefined,
        seats: searchParams.seats || undefined,
      })
    } catch (error: any) {
      toast({
        title: 'Search failed',
        description: error.message || 'Failed to search rides',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleRequestRide = async () => {
    if (!selectedRide) return

    try {
      await requestRide(selectedRide.id, seatsToRequest)
      
      toast({
        title: 'Ride request sent',
        description: 'Your request has been sent to the driver',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      onClose()
      setSelectedRide(null)
      setSeatsToRequest(1)
    } catch (error: any) {
      toast({
        title: 'Request failed',
        description: error.message || 'Failed to send ride request',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const openRequestModal = (ride: any) => {
    setSelectedRide(ride)
    setSeatsToRequest(1)
    onOpen()
  }

  const formatDate = (dateString: string) => {
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

  // Filter and sort rides
  const filteredAndSortedRides = rides
    .filter(ride => ride.price_per_seat <= maxPrice)
    .sort((a, b) => {
      if (sortBy === 'departureTime') {
        return new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime()
      } else if (sortBy === 'price') {
        return a.price_per_seat - b.price_per_seat
      } else if (sortBy === 'rating') {
        return b.driver.trust_score - a.driver.trust_score
      }
      return 0
    })

  return (
    <AuthGuard>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Container maxW="container.xl" py={8} flex="1">
          <Stack spacing={8}>
            <Box>
              <Heading as="h1" size="xl" mb={2}>
                Find a Ride
              </Heading>
              <Text color="gray.600">
                Search for rides and connect with drivers headed your way
              </Text>
            </Box>
            
            {/* Search Form */}
            <Card>
              <CardBody>
                <Stack spacing={4}>
                  <Flex 
                    direction={{ base: 'column', md: 'row' }} 
                    gap={4}
                    align={{ md: 'flex-end' }}
                  >
                    <FormControl>
                      <FormLabel>From</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FaMapMarkerAlt color="gray.300" />
                        </InputLeftElement>
                        <Input 
                          placeholder="Departure location" 
                          value={searchParams.departure}
                          onChange={(e) => setSearchParams({...searchParams, departure: e.target.value})}
                        />
                      </InputGroup>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>To</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FaMapMarkerAlt color="gray.300" />
                        </InputLeftElement>
                        <Input 
                          placeholder="Destination" 
                          value={searchParams.destination}
                          onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                        />
                      </InputGroup>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Date</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FaCalendarAlt color="gray.300" />
                        </InputLeftElement>
                        <Input 
                          type="date" 
                          value={searchParams.date}
                          onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                        />
                      </InputGroup>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Seats</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FaUser color="gray.300" />
                        </InputLeftElement>
                        <Input 
                          type="number" 
                          min={1}
                          value={searchParams.seats}
                          onChange={(e) => setSearchParams({...searchParams, seats: parseInt(e.target.value)})}
                        />
                      </InputGroup>
                    </FormControl>
                    
                    <Button 
                      colorScheme="brand" 
                      leftIcon={<SearchIcon />}
                      onClick={handleSearch}
                      isLoading={loading}
                      minW={{ base: 'full', md: '120px' }}
                    >
                      Search
                    </Button>
                  </Flex>
                  
                  <Flex justify="space-between" align="center">
                    <Button 
                      variant="ghost" 
                      leftIcon={<FaFilter />}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                    
                    <FormControl maxW="200px">
                      <Select 
                        size="sm" 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="departureTime">Sort by: Departure Time</option>
                        <option value="price">Sort by: Price</option>
                        <option value="rating">Sort by: Driver Rating</option>
                      </Select>
                    </FormControl>
                  </Flex>
                  
                  {showFilters && (
                    <Box pt={4}>
                      <Divider mb={4} />
                      <FormControl>
                        <FormLabel>Maximum Price (R{maxPrice})</FormLabel>
                        <Slider
                          id="price-slider"
                          defaultValue={100}
                          min={0}
                          max={200}
                          step={5}
                          onChange={(val) => setMaxPrice(val)}
                          onMouseEnter={() => setShowMaxPriceTooltip(true)}
                          onMouseLeave={() => setShowMaxPriceTooltip(false)}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <Tooltip
                            hasArrow
                            bg="brand.500"
                            color="white"
                            placement="top"
                            isOpen={showMaxPriceTooltip}
                            label={`R${maxPrice}`}
                          >
                            <SliderThumb />
                          </Tooltip>
                        </Slider>
                      </FormControl>
                    </Box>
                  )}
                </Stack>
              </CardBody>
            </Card>
            
            {/* Results */}
            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Available Rides ({filteredAndSortedRides.length})
              </Heading>
              
              {filteredAndSortedRides.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredAndSortedRides.map((ride) => (
                    <Card key={ride.id} variant="outline" transition="transform 0.3s" _hover={{ transform: 'translateY(-5px)' }}>
                      <CardHeader>
                        <Flex justify="space-between" align="center">
                          <HStack>
                            <Avatar name={`${ride.driver.first_name} ${ride.driver.last_name}`} />
                            <Box>
                              <Text fontWeight="bold">{ride.driver.first_name} {ride.driver.last_name}</Text>
                              <HStack>
                                <StarIcon color="yellow.400" />
                                <Text>{ride.driver.trust_score}</Text>
                                {ride.driver.is_driver_verified && (
                                  <Badge colorScheme="green">Verified</Badge>
                                )}
                              </HStack>
                            </Box>
                          </HStack>
                          <Text fontWeight="bold" fontSize="xl" color="brand.500">
                            R{ride.price_per_seat}
                            {ride.is_flexible_price && <Text as="span\" fontSize="xs"> (Negotiable)</Text>}
                          </Text>
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <VStack align="stretch" spacing={3}>
                          <HStack>
                            <FaMapMarkerAlt />
                            <Text fontWeight="medium">{ride.departure_location} → {ride.destination}</Text>
                          </HStack>
                          <HStack>
                            <TimeIcon />
                            <Text>{formatDate(ride.departure_time)}</Text>
                          </HStack>
                          <HStack>
                            <FaUser />
                            <Text>{ride.available_seats} seat{ride.available_seats !== 1 ? 's' : ''} available</Text>
                          </HStack>
                          {ride.description && (
                            <Text fontSize="sm" color="gray.600" noOfLines={2}>
                              {ride.description}
                            </Text>
                          )}
                        </VStack>
                      </CardBody>
                      <Divider />
                      <CardFooter>
                        <Button 
                          colorScheme="brand" 
                          width="full"
                          onClick={() => openRequestModal(ride)}
                        >
                          Request Ride
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Text fontSize="lg" color="gray.500">
                    {loading ? 'Searching for rides...' : 'No rides found matching your criteria'}
                  </Text>
                  {!loading && (
                    <Text color="gray.500">
                      Try adjusting your search parameters
                    </Text>
                  )}
                </Box>
              )}
            </Box>
          </Stack>
        </Container>

        {/* Request Ride Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Request Ride</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedRide && (
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontWeight="bold" mb={2}>Ride Details</Text>
                    <Card variant="outline">
                      <CardBody>
                        <VStack spacing={2} align="stretch">
                          <Text><strong>Route:</strong> {selectedRide.departure_location} → {selectedRide.destination}</Text>
                          <Text><strong>Date:</strong> {formatDate(selectedRide.departure_time)}</Text>
                          <Text><strong>Driver:</strong> {selectedRide.driver.first_name} {selectedRide.driver.last_name}</Text>
                          <Text><strong>Price:</strong> R{selectedRide.price_per_seat} per seat</Text>
                          <Text><strong>Available Seats:</strong> {selectedRide.available_seats}</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </Box>
                  
                  <FormControl>
                    <FormLabel>Number of Seats</FormLabel>
                    <NumberInput 
                      min={1} 
                      max={selectedRide.available_seats}
                      value={seatsToRequest}
                      onChange={(_, val) => setSeatsToRequest(val)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <Box p={4} bg="blue.50" borderRadius="md">
                    <Text fontWeight="bold">Total Cost: R{selectedRide.price_per_seat * seatsToRequest}</Text>
                  </Box>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleRequestRide}>
                Send Request
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Footer />
      </Box>
    </AuthGuard>
  )
}