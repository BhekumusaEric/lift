'use client'

import { useState } from 'react'
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
  IconButton,
  InputGroup,
  InputLeftElement,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { SearchIcon, TimeIcon, StarIcon } from '@chakra-ui/icons'
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaCar, FaMoneyBillWave, FaFilter } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Mock data for rides
const mockRides = [
  {
    id: 1,
    driver: {
      id: 101,
      name: 'John Doe',
      rating: 4.8,
      profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
      isVerified: true,
    },
    departure: 'Johannesburg',
    destination: 'Pretoria',
    departureTime: '2023-06-15T08:00:00',
    availableSeats: 3,
    price: 50,
    isFlexiblePrice: true,
  },
  {
    id: 2,
    driver: {
      id: 102,
      name: 'Jane Smith',
      rating: 4.5,
      profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
      isVerified: true,
    },
    departure: 'Johannesburg',
    destination: 'Soweto',
    departureTime: '2023-06-15T09:30:00',
    availableSeats: 2,
    price: 35,
    isFlexiblePrice: false,
  },
  {
    id: 3,
    driver: {
      id: 103,
      name: 'Mike Johnson',
      rating: 4.2,
      profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
      isVerified: false,
    },
    departure: 'Johannesburg',
    destination: 'Sandton',
    departureTime: '2023-06-15T10:15:00',
    availableSeats: 1,
    price: 45,
    isFlexiblePrice: true,
  },
  {
    id: 4,
    driver: {
      id: 104,
      name: 'Sarah Williams',
      rating: 4.9,
      profilePic: 'https://randomuser.me/api/portraits/women/4.jpg',
      isVerified: true,
    },
    departure: 'Pretoria',
    destination: 'Johannesburg',
    departureTime: '2023-06-15T16:00:00',
    availableSeats: 4,
    price: 55,
    isFlexiblePrice: false,
  },
]

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
  const [filteredRides, setFilteredRides] = useState(mockRides)
  const toast = useToast()

  const handleSearch = () => {
    // In a real app, this would make an API call with the search parameters
    // For now, we'll just filter the mock data
    const filtered = mockRides.filter(ride => {
      const departureMatch = !searchParams.departure || 
        ride.departure.toLowerCase().includes(searchParams.departure.toLowerCase())
      
      const destinationMatch = !searchParams.destination || 
        ride.destination.toLowerCase().includes(searchParams.destination.toLowerCase())
      
      const dateMatch = !searchParams.date || 
        new Date(ride.departureTime).toDateString() === new Date(searchParams.date).toDateString()
      
      const seatsMatch = !searchParams.seats || ride.availableSeats >= searchParams.seats
      
      const priceMatch = ride.price <= maxPrice
      
      return departureMatch && destinationMatch && dateMatch && seatsMatch && priceMatch
    })
    
    // Sort the results
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'departureTime') {
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
      } else if (sortBy === 'price') {
        return a.price - b.price
      } else if (sortBy === 'rating') {
        return b.driver.rating - a.driver.rating
      }
      return 0
    })
    
    setFilteredRides(sorted)
    
    if (sorted.length === 0) {
      toast({
        title: 'No rides found',
        description: 'Try adjusting your search criteria',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    }
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

  return (
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
              Available Rides
            </Heading>
            
            {filteredRides.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredRides.map((ride) => (
                  <Card key={ride.id} variant="outline" transition="transform 0.3s" _hover={{ transform: 'translateY(-5px)' }}>
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <HStack>
                          <Avatar src={ride.driver.profilePic} name={ride.driver.name} />
                          <Box>
                            <Text fontWeight="bold">{ride.driver.name}</Text>
                            <HStack>
                              <StarIcon color="yellow.400" />
                              <Text>{ride.driver.rating}</Text>
                              {ride.driver.isVerified && (
                                <Badge colorScheme="green">Verified</Badge>
                              )}
                            </HStack>
                          </Box>
                        </HStack>
                        <Text fontWeight="bold" fontSize="xl" color="brand.500">
                          R{ride.price}
                          {ride.isFlexiblePrice && <Text as="span" fontSize="xs"> (Negotiable)</Text>}
                        </Text>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <HStack>
                          <FaMapMarkerAlt />
                          <Text fontWeight="medium">{ride.departure} → {ride.destination}</Text>
                        </HStack>
                        <HStack>
                          <TimeIcon />
                          <Text>{formatDate(ride.departureTime)}</Text>
                        </HStack>
                        <HStack>
                          <FaUser />
                          <Text>{ride.availableSeats} seat{ride.availableSeats !== 1 ? 's' : ''} available</Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      <Button colorScheme="brand" width="full">
                        Request Ride
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <Box textAlign="center" py={10}>
                <Text fontSize="lg" color="gray.500">
                  No rides found matching your criteria
                </Text>
                <Text color="gray.500">
                  Try adjusting your search parameters
                </Text>
              </Box>
            )}
          </Box>
        </Stack>
      </Container>
      <Footer />
    </Box>
  )
}
