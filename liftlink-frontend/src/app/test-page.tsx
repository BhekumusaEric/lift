'use client'

import { Box, Text, Heading } from '@chakra-ui/react'

export default function TestPage() {
  return (
    <Box p={8}>
      <Heading color="#0080ff">LiftLink Test Page</Heading>
      <Text mt={4}>This is a simple test to see if Chakra UI is working.</Text>
      <Box 
        mt={4} 
        p={4} 
        bg="#0080ff" 
        color="white" 
        borderRadius="md"
      >
        If you can see this blue box with white text, Chakra UI is working!
      </Box>
    </Box>
  )
}
