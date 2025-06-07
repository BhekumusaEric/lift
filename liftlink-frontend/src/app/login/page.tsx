'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Container,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  IconButton,
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

// Form validation schema
const schema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required()

type LoginFormData = yup.InferType<typeof schema>

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

const Divider = () => (
  <Box height="1px" bg="gray.200" width="100%" />
)

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { signIn } = useAuthStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password)

      toast.success("Welcome back to LiftLink!")

      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Invalid email or password')
    }
  }

  return (
    <AuthGuard requireAuth={false}>
      <Box minH="100vh" display="flex" flexDirection="column">
        {/* <Navbar /> */}
        <Container
          maxW="lg"
          py={{ base: '12', md: '24' }}
          px={{ base: '0', sm: '8' }}
          flex="1"
        >
          <Stack spacing="8">
            <Stack spacing="6" textAlign="center">
              <Heading size="xl" fontWeight="bold" color="blue.600">
                Welcome back to LiftLink
              </Heading>
              <Text color="gray.500">
                Please sign in to your account
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
                  </Stack>
                  <HStack justify="space-between">
                    <Checkbox
                      isChecked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    >
                      Remember me
                    </Checkbox>
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
                      loadingText="Signing in..."
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
        {/* <Footer /> */}
      </Box>
    </AuthGuard>
  )
}