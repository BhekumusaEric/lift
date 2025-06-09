'use client'

import { useState, useEffect } from 'react'
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
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AuthGuard from '@/components/AuthGuard'
import { supabase } from '@/lib/supabase'

// Form validation schema
const schema = yup.object({
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
}).required()

type ResetPasswordFormData = yup.InferType<typeof schema>

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

const InputGroup = ({ children }: { children: React.ReactNode }) => (
  <Box position="relative">{children}</Box>
)

const InputRightElement = ({ children }: { children: React.ReactNode }) => (
  <Box position="absolute" right={2} top="50%" transform="translateY(-50%)" zIndex={2}>
    {children}
  </Box>
)

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPasswordReset, setIsPasswordReset] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
  })

  const password = watch('password')

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsValidSession(true)
      } else {
        // Check for access token in URL (from email link)
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          
          if (!error) {
            setIsValidSession(true)
          } else {
            toast.error('Invalid or expired reset link')
            router.push('/forgot-password')
          }
        } else {
          toast.error('Invalid reset link')
          router.push('/forgot-password')
        }
      }
    }

    checkSession()
  }, [searchParams, router])

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      })

      if (error) throw error

      setIsPasswordReset(true)
      toast.success('Password updated successfully!')
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating your password')
    }
  }

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '' }
    
    let strength = 0
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[@$!%*?&]/.test(password),
    ]
    
    strength = checks.filter(Boolean).length
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['red', 'orange', 'yellow', 'blue', 'green']
    
    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'gray'
    }
  }

  const passwordStrength = getPasswordStrength(password || '')

  if (!isValidSession) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text>Validating reset link...</Text>
      </Box>
    )
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
                {isPasswordReset ? 'Password Updated!' : 'Create New Password'}
              </Heading>
              <Text color="gray.500">
                {isPasswordReset 
                  ? "Your password has been successfully updated. You'll be redirected to login shortly."
                  : "Please enter your new password below"
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
              {isPasswordReset ? (
                <Stack spacing="6">
                  <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold">Password updated successfully!</Text>
                      <Text fontSize="sm">
                        You can now log in with your new password.
                      </Text>
                    </Box>
                  </Alert>
                  
                  <Button 
                    as={Link}
                    href="/login"
                    colorScheme="blue"
                    leftIcon={<FaCheck />}
                  >
                    Go to Login
                  </Button>
                </Stack>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing="6">
                    <Stack spacing="5">
                      <FormControl isInvalid={!!errors.password}>
                        <FormLabel htmlFor="password">New Password</FormLabel>
                        <InputGroup>
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            placeholder="Enter your new password"
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
                        {password && (
                          <Box mt={2}>
                            <Text fontSize="xs" color={`${passwordStrength.color}.500`}>
                              Password strength: {passwordStrength.label}
                            </Text>
                            <Box w="100%" bg="gray.200" borderRadius="full" h="2" mt={1}>
                              <Box
                                bg={`${passwordStrength.color}.500`}
                                h="2"
                                borderRadius="full"
                                w={`${(passwordStrength.strength / 5) * 100}%`}
                                transition="all 0.3s"
                              />
                            </Box>
                          </Box>
                        )}
                        <FormErrorMessage>
                          {errors.password?.message}
                        </FormErrorMessage>
                      </FormControl>
                      
                      <FormControl isInvalid={!!errors.confirmPassword}>
                        <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
                        <InputGroup>
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...register('confirmPassword')}
                            placeholder="Confirm your new password"
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
                    </Stack>
                    
                    <Stack spacing="4">
                      <Button 
                        type="submit" 
                        colorScheme="blue"
                        size="lg"
                        isLoading={isSubmitting}
                        loadingText="Updating..."
                      >
                        Update Password
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>
    </AuthGuard>
  )
}
