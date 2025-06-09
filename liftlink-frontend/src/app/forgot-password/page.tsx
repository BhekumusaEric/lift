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
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthGuard from '@/components/AuthGuard'
import { supabase } from '@/lib/supabase'

// Form validation schema
const schema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
}).required()

type ForgotPasswordFormData = yup.InferType<typeof schema>

// Custom form components for Chakra UI v3 compatibility
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

export default function ForgotPasswordPage() {
  const [isEmailSent, setIsEmailSent] = useState(false)
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setIsEmailSent(true)
      toast.success('Password reset email sent!')
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while sending the reset email')
    }
  }

  const handleResendEmail = async () => {
    const email = getValues('email')
    if (!email) {
      toast.error('Please enter your email address first')
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      toast.success('Password reset email sent again!')
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while resending the email')
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
                Forgot your password?
              </Heading>
              <Text color="gray.500">
                {isEmailSent 
                  ? "We've sent a password reset link to your email"
                  : "No worries! Enter your email and we'll send you a reset link"
                }
              </Text>
            </Stack>
            
            <Box
              py={{ base: '0', sm: '8' }}
              px={{ base: '4', sm: '10' }}
              bg={{ base: 'transparent', sm: 'white' }}
              boxShadow={{ base: 'none', sm: 'md' }}
              borderRadius={{ base: 'none', sm: 'xl' }}
            >
              {isEmailSent ? (
                <Stack spacing="6">
                  <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold">Email sent successfully!</Text>
                      <Text fontSize="sm">
                        Check your inbox and click the reset link to create a new password.
                      </Text>
                    </Box>
                  </Alert>
                  
                  <Stack spacing="4">
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Didn't receive the email? Check your spam folder or try again.
                    </Text>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleResendEmail}
                      leftIcon={<FaEnvelope />}
                    >
                      Resend Email
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsEmailSent(false)}
                    >
                      Try Different Email
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing="6">
                    <Stack spacing="5">
                      <FormControl isInvalid={!!errors.email}>
                        <FormLabel htmlFor="email">Email Address</FormLabel>
                        <Input 
                          id="email" 
                          type="email" 
                          {...register('email')} 
                          placeholder="Enter your email address"
                          size="lg"
                        />
                        <FormErrorMessage>
                          {errors.email?.message}
                        </FormErrorMessage>
                      </FormControl>
                    </Stack>
                    
                    <Stack spacing="4">
                      <Button 
                        type="submit" 
                        colorScheme="blue"
                        size="lg"
                        isLoading={isSubmitting}
                        loadingText="Sending..."
                        leftIcon={<FaEnvelope />}
                      >
                        Send Reset Link
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              )}
              
              <HStack spacing="1" justify="center" mt={6}>
                <Link href="/login" passHref>
                  <Button variant="link" colorScheme="blue" leftIcon={<FaArrowLeft />}>
                    Back to Login
                  </Button>
                </Link>
              </HStack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </AuthGuard>
  )
}
