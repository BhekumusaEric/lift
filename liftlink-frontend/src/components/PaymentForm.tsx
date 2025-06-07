'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
)

interface PaymentFormProps {
  amount: number
  rideId: string
  onSuccess: () => void
  onCancel: () => void
}

const CheckoutForm = ({ amount, rideId, onSuccess, onCancel }: PaymentFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setError('Card element not found')
      setLoading(false)
      return
    }

    try {
      // Create payment method
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (paymentError) {
        setError(paymentError.message || 'Payment failed')
        setLoading(false)
        return
      }

      // TODO: Send payment method to your backend
      // For now, simulate successful payment
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: 'Payment Successful!',
        description: `$${amount} has been charged for your ride.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6}>
        <Text fontSize="lg" fontWeight="bold">
          Complete Payment: ${amount}
        </Text>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Box
          p={4}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          width="100%"
        >
          <CardElement options={cardElementOptions} />
        </Box>

        <VStack spacing={3} width="100%">
          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            width="100%"
            isLoading={loading}
            loadingText="Processing..."
            disabled={!stripe || loading}
          >
            {loading ? <Spinner size="sm" /> : `Pay $${amount}`}
          </Button>

          <Button
            variant="outline"
            size="lg"
            width="100%"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </VStack>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          Your payment is secured by Stripe. We never store your card details.
        </Text>
      </VStack>
    </Box>
  )
}

const PaymentForm = (props: PaymentFormProps) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}

export default PaymentForm
