'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  IconButton,
  Select,
  Checkbox,
} from '@chakra-ui/react'
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthGuard from '@/components/AuthGuard'
import { useAuthStore } from '@/store/authStore'

// Validation schema
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  userType: yup.string().required('Please select user type'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  termsAccepted: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
})

type RegisterFormData = yup.InferType<typeof schema>

// Simple form components
const FormControl = ({ children, isInvalid }: { children: React.ReactNode; isInvalid?: boolean }) => (
  <Box>{children}</Box>
)

const FormLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <Text as="label" htmlFor={htmlFor} fontSize="sm" fontWeight="medium" mb={2} display="block">
    {children}
  </Text>
)

const FormErrorMessage = ({ children }: { children: React.ReactNode }) => (
  <Text color="red.500" fontSize="sm" mt={1}>
    {children}
  </Text>
)

const InputGroup = ({ children }: { children: React.ReactNode }) => (
  <Box position="relative">{children}</Box>
)

const InputRightElement = ({ children }: { children: React.ReactNode }) => (
  <Box position="absolute" right={2} top="50%" transform="translateY(-50%)" zIndex={2}>
    {children}
  </Box>
)

const Divider = () => (
  <Box height="1px" bg="gray.200" width="100%" />
)

export default function RegisterPageNew() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signUp } = useAuthStore()
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        userType: data.userType as 'passenger' | 'driver' | 'both',
      })
      
      toast.success("Welcome to LiftLink! Please check your email to verify your account.")
      
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during registration')
    }
  }

  return (
    <AuthGuard requireAuth={false}>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Container 
          maxW="lg" 
          py={{ base: '12', md: '24' }} 
          px={{ base: '0', sm: '8' }}
          flex="1"
        >
          <Stack spacing="8">
            <Stack spacing="6" textAlign="center">
              <Heading size="xl" fontWeight="bold" color="blue.600">
                Create your LiftLink account
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
                            icon={showPassword ? <FaEyeSlash /> : <FaEye />}
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
                            icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
      </Box>
    </AuthGuard>
  )
}
