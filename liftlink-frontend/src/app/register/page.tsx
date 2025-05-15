'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
  VStack,
  Checkbox,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Form validation schema
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  userType: yup.string().oneOf(['passenger', 'driver', 'both'], 'Please select a valid user type').required('User type is required'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  termsAccepted: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
}).required()

type RegisterFormData = yup.InferType<typeof schema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const toast = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // This would be replaced with actual API call
      console.log('Registration data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Registration successful',
        description: "Your account has been created. You can now log in.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Container 
        maxW="lg" 
        py={{ base: '12', md: '24' }} 
        px={{ base: '0', sm: '8' }}
        flex="1"
      >
        <Stack spacing="8">
          <Stack spacing="6" textAlign="center">
            <Heading size="xl" fontWeight="bold">
              Create your account
            </Heading>
            <Text color="gray.500">
              Join our community of drivers and passengers
            </Text>
          </Stack>
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={{ base: 'transparent', sm: 'white' }}
            boxShadow={{ base: 'none', sm: 'md' }}
            borderRadius={{ base: 'none', sm: 'xl' }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing="6">
                <Stack spacing="5">
                  <HStack spacing={4}>
                    <FormControl isInvalid={!!errors.firstName}>
                      <FormLabel htmlFor="firstName">First Name</FormLabel>
                      <Input 
                        id="firstName" 
                        {...register('firstName')} 
                        placeholder="First name"
                      />
                      <FormErrorMessage>
                        {errors.firstName?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.lastName}>
                      <FormLabel htmlFor="lastName">Last Name</FormLabel>
                      <Input 
                        id="lastName" 
                        {...register('lastName')} 
                        placeholder="Last name"
                      />
                      <FormErrorMessage>
                        {errors.lastName?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </HStack>
                  
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input 
                      id="email" 
                      type="email" 
                      {...register('email')} 
                      placeholder="Enter your email"
                    />
                    <FormErrorMessage>
                      {errors.email?.message}
                    </FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.phoneNumber}>
                    <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                    <Input 
                      id="phoneNumber" 
                      type="tel" 
                      {...register('phoneNumber')} 
                      placeholder="Enter your phone number"
                    />
                    <FormErrorMessage>
                      {errors.phoneNumber?.message}
                    </FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.userType}>
                    <FormLabel htmlFor="userType">I want to join as a</FormLabel>
                    <Select 
                      id="userType" 
                      placeholder="Select option" 
                      {...register('userType')}
                    >
                      <option value="passenger">Passenger</option>
                      <option value="driver">Driver</option>
                      <option value="both">Both Driver and Passenger</option>
                    </Select>
                    <FormErrorMessage>
                      {errors.userType?.message}
                    </FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <InputGroup>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="Create a password"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.password?.message}
                    </FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    <InputGroup>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        placeholder="Confirm your password"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.confirmPassword?.message}
                    </FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.termsAccepted}>
                    <Checkbox {...register('termsAccepted')}>
                      I agree to the Terms of Service and Privacy Policy
                    </Checkbox>
                    <FormErrorMessage>
                      {errors.termsAccepted?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
                
                <Stack spacing="4">
                  <Button 
                    type="submit" 
                    colorScheme="brand"
                    isLoading={isSubmitting}
                  >
                    Create Account
                  </Button>
                  <HStack>
                    <Divider />
                    <Text fontSize="sm" color="gray.500">
                      OR
                    </Text>
                    <Divider />
                  </HStack>
                  <Button 
                    leftIcon={<FaGoogle />} 
                    variant="outline"
                    onClick={() => console.log('Google sign-up')}
                  >
                    Sign up with Google
                  </Button>
                  <Button 
                    leftIcon={<FaFacebook />} 
                    colorScheme="facebook" 
                    variant="outline"
                    onClick={() => console.log('Facebook sign-up')}
                  >
                    Sign up with Facebook
                  </Button>
                </Stack>
                <HStack spacing="1" justify="center">
                  <Text color="gray.500">Already have an account?</Text>
                  <Link href="/login" passHref>
                    <Button variant="link" colorScheme="brand">
                      Log in
                    </Button>
                  </Link>
                </HStack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
      <Footer />
    </Box>
  )
}
