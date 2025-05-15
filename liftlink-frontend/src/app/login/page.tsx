'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
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
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
}).required()

type LoginFormData = yup.InferType<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const toast = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      // This would be replaced with actual API call
      console.log('Login data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Login successful',
        description: "You've been successfully logged in",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Login failed',
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
              Log in to your account
            </Heading>
            <Text color="gray.500">
              Welcome back! Please enter your details.
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
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <InputGroup>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="Enter your password"
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
                </Stack>
                <HStack justify="space-between">
                  <Checkbox defaultChecked>Remember me</Checkbox>
                  <Link href="/forgot-password" passHref>
                    <Button variant="link" colorScheme="brand" size="sm">
                      Forgot password?
                    </Button>
                  </Link>
                </HStack>
                <Stack spacing="4">
                  <Button 
                    type="submit" 
                    colorScheme="brand"
                    isLoading={isSubmitting}
                  >
                    Sign in
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
                    onClick={() => console.log('Google sign-in')}
                  >
                    Continue with Google
                  </Button>
                  <Button 
                    leftIcon={<FaFacebook />} 
                    colorScheme="facebook" 
                    variant="outline"
                    onClick={() => console.log('Facebook sign-in')}
                  >
                    Continue with Facebook
                  </Button>
                </Stack>
                <HStack spacing="1" justify="center">
                  <Text color="gray.500">Don't have an account?</Text>
                  <Link href="/register" passHref>
                    <Button variant="link" colorScheme="brand">
                      Sign up
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
