'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  FormErrorMessage,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaMoneyBillWave } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthGuard from '@/components/AuthGuard'
import { useRidesStore } from '@/store/ridesStore'

// Form validation schema
const schema = yup.object({
  departure_location: yup.string().required('Departure location is required'),
  destination: yup.string().required('Destination is required'),
  departure_date: yup.string().required('Departure date is required'),
  departure_time: yup.string().required('Departure time is required'),
  available_seats: yup.number()
    .required('Number of seats is required')
    .min(1, 'At least 1 seat must be available')
    .max(8, 'Maximum 8 seats allowed'),
  price_per_seat: yup.number()
    .required('Price per seat is required')
    .min(0, 'Price cannot be negative'),
  is_flexible_price: yup.boolean(),
  description: yup.string(),
}).required()

type OfferRideFormData = yup.InferType<typeof schema>

// Steps for the ride creation process
const steps = [
  { title: 'Route', description: 'Set your journey' },
  { title: 'Details', description: 'Seats & pricing' },
  { title: 'Review', description: 'Confirm details' },
]

export default function OfferRidePage() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })
  
  const { createRide } = useRidesStore()
  const router = useRouter()
  const toast = useToast()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OfferRideFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      available_seats: 1,
      price_per_seat: 50,
      is_flexible_price: true,
    }
  })

  // Watch form values for the review step
  const watchedValues = watch()

  const onSubmit = async (data: OfferRideFormData) => {
    try {
      // Combine date and time
      const departureDateTime = new Date(`${data.departure_date}T${data.departure_time}`)
      
      await createRide({
        departure_location: data.departure_location,
        destination: data.destination,
        departure_time: departureDateTime.toISOString(),
        available_seats: data.available_seats,
        price_per_seat: data.price_per_seat,
        is_flexible_price: data.is_flexible_price,
        description: data.description || null,
      })
      
      toast({
        title: 'Ride created successfully',
        description: "Your ride has been posted and is now visible to passengers",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      router.push('/my-rides')
    } catch (error: any) {
      toast({
        title: 'Failed to create ride',
        description: error.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const nextStep = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const prevStep = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  return (
    <AuthGuard>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Container maxW="container.md" py={8} flex="1">
          <Stack spacing={8}>
            <Box>
              <Heading as="h1" size="xl" mb={2}>
                Offer a Ride
              </Heading>
              <Text color="gray.600">
                Share your journey and help others while covering your costs
              </Text>
            </Box>
            
            <Stepper index={activeStep} colorScheme="brand" mb={8}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink={0}>
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
            
            <Card>
              <CardHeader>
                <Heading size="md">
                  {activeStep === 0 && 'Set Your Route'}
                  {activeStep === 1 && 'Ride Details'}
                  {activeStep === 2 && 'Review Your Ride'}
                </Heading>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {activeStep === 0 && (
                    <Stack spacing={6}>
                      <FormControl isInvalid={!!errors.departure_location}>
                        <FormLabel>Departure Location</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaMapMarkerAlt color="gray.300" />
                          </InputLeftElement>
                          <Input 
                            placeholder="Where are you starting from?" 
                            {...register('departure_location')}
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          {errors.departure_location?.message}
                        </FormErrorMessage>
                      </FormControl>
                      
                      <FormControl isInvalid={!!errors.destination}>
                        <FormLabel>Destination</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaMapMarkerAlt color="gray.300" />
                          </InputLeftElement>
                          <Input 
                            placeholder="Where are you going?" 
                            {...register('destination')}
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          {errors.destination?.message}
                        </FormErrorMessage>
                      </FormControl>
                      
                      <FormControl isInvalid={!!errors.departure_date}>
                        <FormLabel>Departure Date</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaCalendarAlt color="gray.300" />
                          </InputLeftElement>
                          <Input 
                            type="date" 
                            {...register('departure_date')}
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          {errors.departure_date?.message}
                        </FormErrorMessage>
                      </FormControl>
                      
                      <FormControl isInvalid={!!errors.departure_time}>
                        <FormLabel>Departure Time</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaClock color="gray.300" />
                          </InputLeftElement>
                          <Input 
                            type="time" 
                            {...register('departure_time')}
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          {errors.departure_time?.message}
                        </FormErrorMessage>
                      </FormControl>
                    </Stack>
                  )}
                  
                  {activeStep === 1 && (
                    <Stack spacing={6}>
                      <FormControl isInvalid={!!errors.available_seats}>
                        <FormLabel>Available Seats</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaUser color="gray.300" />
                          </InputLeftElement>
                          <NumberInput 
                            min={1} 
                            max={8} 
                            defaultValue={1}
                            w="100%"
                          >
                            <NumberInputField 
                              pl="40px"
                              {...register('available_seats', { valueAsNumber: true })}
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </InputGroup>
                        <FormErrorMessage>
                          {errors.available_seats?.message}
                        </FormErrorMessage>
                      </FormControl>
                      
                      <FormControl isInvalid={!!errors.price_per_seat}>
                        <FormLabel>Price per Seat</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaMoneyBillWave color="gray.300" />
                          </InputLeftElement>
                          <NumberInput 
                            min={0} 
                            defaultValue={50}
                            w="100%"
                          >
                            <NumberInputField 
                              pl="40px"
                              {...register('price_per_seat', { valueAsNumber: true })}
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <InputRightAddon children="ZAR" />
                        </InputGroup>
                        <FormErrorMessage>
                          {errors.price_per_seat?.message}
                        </FormErrorMessage>
                      </FormControl>
                      
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="is_flexible_price" mb="0">
                          Flexible Price (Allow passengers to negotiate)
                        </FormLabel>
                        <Switch 
                          id="is_flexible_price" 
                          colorScheme="brand"
                          {...register('is_flexible_price')}
                        />
                      </FormControl>
                      
                      <FormControl isInvalid={!!errors.description}>
                        <FormLabel>Description (Optional)</FormLabel>
                        <Textarea 
                          placeholder="Add any additional details about your ride..."
                          {...register('description')}
                          rows={4}
                        />
                        <FormErrorMessage>
                          {errors.description?.message}
                        </FormErrorMessage>
                      </FormControl>
                    </Stack>
                  )}
                  
                  {activeStep === 2 && (
                    <Stack spacing={6}>
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Almost there!</AlertTitle>
                          <AlertDescription>
                            Please review your ride details before submitting.
                          </AlertDescription>
                        </Box>
                      </Alert>
                      
                      <Box>
                        <Text fontWeight="bold" mb={2}>Route</Text>
                        <Card variant="outline">
                          <CardBody>
                            <Stack spacing={3}>
                              <Flex>
                                <Box w="120px" fontWeight="medium">From:</Box>
                                <Text>{watchedValues.departure_location}</Text>
                              </Flex>
                              <Flex>
                                <Box w="120px" fontWeight="medium">To:</Box>
                                <Text>{watchedValues.destination}</Text>
                              </Flex>
                              <Flex>
                                <Box w="120px" fontWeight="medium">Date:</Box>
                                <Text>{watchedValues.departure_date}</Text>
                              </Flex>
                              <Flex>
                                <Box w="120px" fontWeight="medium">Time:</Box>
                                <Text>{watchedValues.departure_time}</Text>
                              </Flex>
                            </Stack>
                          </CardBody>
                        </Card>
                      </Box>
                      
                      <Box>
                        <Text fontWeight="bold" mb={2}>Details</Text>
                        <Card variant="outline">
                          <CardBody>
                            <Stack spacing={3}>
                              <Flex>
                                <Box w="120px" fontWeight="medium">Seats:</Box>
                                <Text>{watchedValues.available_seats}</Text>
                              </Flex>
                              <Flex>
                                <Box w="120px" fontWeight="medium">Price:</Box>
                                <Text>R{watchedValues.price_per_seat} per seat</Text>
                              </Flex>
                              <Flex>
                                <Box w="120px" fontWeight="medium">Flexible:</Box>
                                <Text>{watchedValues.is_flexible_price ? 'Yes' : 'No'}</Text>
                              </Flex>
                              {watchedValues.description && (
                                <Flex>
                                  <Box w="120px" fontWeight="medium">Notes:</Box>
                                  <Text>{watchedValues.description}</Text>
                                </Flex>
                              )}
                            </Stack>
                          </CardBody>
                        </Card>
                      </Box>
                    </Stack>
                  )}
                  
                  <Flex justify="space-between" mt={8}>
                    {activeStep > 0 ? (
                      <Button onClick={prevStep} variant="outline">
                        Previous
                      </Button>
                    ) : (
                      <Box /> // Empty box for spacing
                    )}
                    
                    {activeStep < steps.length - 1 ? (
                      <Button colorScheme="brand" onClick={nextStep}>
                        Next
                      </Button>
                    ) : (
                      <Button 
                        colorScheme="brand" 
                        type="submit"
                        isLoading={isSubmitting}
                      >
                        Create Ride
                      </Button>
                    )}
                  </Flex>
                </form>
              </CardBody>
            </Card>
          </Stack>
        </Container>
        <Footer />
      </Box>
    </AuthGuard>
  )
}