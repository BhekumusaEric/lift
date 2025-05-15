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
  InputRightElement,
  InputRightAddon,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
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
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Form validation schema
const schema = yup.object({
  departureLocation: yup.string().required('Departure location is required'),
  destination: yup.string().required('Destination is required'),
  departureDate: yup.string().required('Departure date is required'),
  departureTime: yup.string().required('Departure time is required'),
  availableSeats: yup.number()
    .required('Number of seats is required')
    .min(1, 'At least 1 seat must be available')
    .max(8, 'Maximum 8 seats allowed'),
  pricePerSeat: yup.number()
    .required('Price per seat is required')
    .min(0, 'Price cannot be negative'),
  isFlexiblePrice: yup.boolean(),
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
  const toast = useToast()
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OfferRideFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      availableSeats: 1,
      pricePerSeat: 50,
      isFlexiblePrice: true,
    }
  })

  // Watch form values for the review step
  const watchedValues = watch()

  const onSubmit = async (data: OfferRideFormData) => {
    try {
      // This would be replaced with actual API call
      console.log('Ride offer data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Ride created successfully',
        description: "Your ride has been posted and is now visible to passengers",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      // Reset the stepper to the first step
      setActiveStep(0)
    } catch (error) {
      toast({
        title: 'Failed to create ride',
        description: error instanceof Error ? error.message : 'An error occurred',
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
                    <FormControl isInvalid={!!errors.departureLocation}>
                      <FormLabel>Departure Location</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FaMapMarkerAlt color="gray.300" />
                        </InputLeftElement>
                        <Input 
                          placeholder="Where are you starting from?" 
                          {...register('departureLocation')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.departureLocation?.message}
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
                    
                    <FormControl isInvalid={!!errors.departureDate}>
                      <FormLabel>Departure Date</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FaCalendarAlt color="gray.300" />
                        </InputLeftElement>
                        <Input 
                          type="date" 
                          {...register('departureDate')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.departureDate?.message}
                      </FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors.departureTime}>
                      <FormLabel>Departure Time</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FaClock color="gray.300" />
                        </InputLeftElement>
                        <Input 
                          type="time" 
                          {...register('departureTime')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.departureTime?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                )}
                
                {activeStep === 1 && (
                  <Stack spacing={6}>
                    <FormControl isInvalid={!!errors.availableSeats}>
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
                            {...register('availableSeats', { valueAsNumber: true })}
                          />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.availableSeats?.message}
                      </FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors.pricePerSeat}>
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
                            {...register('pricePerSeat', { valueAsNumber: true })}
                          />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <InputRightAddon children="ZAR" />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.pricePerSeat?.message}
                      </FormErrorMessage>
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="isFlexiblePrice" mb="0">
                        Flexible Price (Allow passengers to negotiate)
                      </FormLabel>
                      <Switch 
                        id="isFlexiblePrice" 
                        colorScheme="brand"
                        {...register('isFlexiblePrice')}
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
                              <Text>{watchedValues.departureLocation}</Text>
                            </Flex>
                            <Flex>
                              <Box w="120px" fontWeight="medium">To:</Box>
                              <Text>{watchedValues.destination}</Text>
                            </Flex>
                            <Flex>
                              <Box w="120px" fontWeight="medium">Date:</Box>
                              <Text>{watchedValues.departureDate}</Text>
                            </Flex>
                            <Flex>
                              <Box w="120px" fontWeight="medium">Time:</Box>
                              <Text>{watchedValues.departureTime}</Text>
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
                              <Text>{watchedValues.availableSeats}</Text>
                            </Flex>
                            <Flex>
                              <Box w="120px" fontWeight="medium">Price:</Box>
                              <Text>R{watchedValues.pricePerSeat} per seat</Text>
                            </Flex>
                            <Flex>
                              <Box w="120px" fontWeight="medium">Flexible:</Box>
                              <Text>{watchedValues.isFlexiblePrice ? 'Yes' : 'No'}</Text>
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
  )
}
