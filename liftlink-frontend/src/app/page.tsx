'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { FaCar, FaMapMarkerAlt, FaComments, FaShieldAlt, FaMoneyBillWave } from "react-icons/fa";
import Link from "next/link";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

export default function Home() {
  const textColor = '#4a5568'; // gray.700 equivalent
  const user = null; // Temporarily disable auth for now

  return (
    <Box>
      {/* <Navbar /> */}
      {/* Hero Section */}
      <Box
        bg="#0080ff"
        color="white"
        py={20}
        backgroundImage="linear-gradient(135deg, #0080ff 0%, #004d99 100%)"
      >
        <Container maxW="container.xl">
          <Flex direction={{ base: "column", md: "row" }} align="center">
            <Box
              flex={1}
              textAlign={{ base: "center", md: "left" }}
              mb={{ base: 10, md: 0 }}
              display="flex"
              flexDirection="column"
              alignItems={{ base: "center", md: "flex-start" }}
              gap={6}
            >
              <Heading as="h1" size="2xl" fontWeight="bold">
                LiftLink
              </Heading>
              <Text fontSize="xl" maxW="600px">
                Affordable, Smart Ride Matching for Everyday Commuters
              </Text>
              <Text fontSize="md" maxW="600px">
                Connect with drivers and passengers headed in the same direction. Save money, reduce traffic, and build community.
              </Text>
              <Flex gap={4}>
                <Button
                  as={Link}
                  href={user ? "/find-ride" : "/register"}
                  size="lg"
                  colorScheme="white"
                  variant="outline"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  {user ? "Find a Ride" : "Get Started"}
                </Button>
                <Button
                  as={Link}
                  href={user ? "/offer-ride" : "/login"}
                  size="lg"
                  bg="white"
                  color="#0080ff"
                  _hover={{ bg: "gray.100" }}
                >
                  {user ? "Offer a Ride" : "Sign In"}
                </Button>
              </Flex>
            </Box>
            <Box flex={1} display={{ base: "none", md: "block" }}>
              <Box
                width="500px"
                height="400px"
                bg="whiteAlpha.200"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="6xl"
              >
                🚗💨
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <Flex direction="column" gap={16}>
            <Flex direction="column" gap={4} textAlign="center" alignItems="center">
              <Heading as="h2" size="xl">Key Features</Heading>
              <Text fontSize="lg" color={textColor} maxW="800px">
                LiftLink makes ride sharing simple, affordable, and safe for everyone.
              </Text>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={10}>
              <FeatureCard
                icon={FaCar}
                title="Ride Posting & Matching"
                description="Post or find rides based on route, time, and price preferences."
              />
              <FeatureCard
                icon={FaComments}
                title="Smart Matching"
                description="Our AI automatically matches rides based on similar routes and times."
              />
              <FeatureCard
                icon={FaMoneyBillWave}
                title="Flexible Payment"
                description="Pay what you can model within suggested limits."
              />
              <FeatureCard
                icon={FaShieldAlt}
                title="Safety & Trust"
                description="Verified profiles, ratings, and real-time trip sharing."
              />
              <FeatureCard
                icon={FaMapMarkerAlt}
                title="Live Tracking"
                description="Real-time GPS tracking and ETA predictions."
              />
              <FeatureCard
                icon={FaCar}
                title="Recurring Rides"
                description="Schedule weekly or daily rides for regular commutes."
              />
            </SimpleGrid>
          </Flex>
        </Container>
      </Box>

      {/* <Footer /> */}
    </Box>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const bgColor = 'white';
  const borderColor = '#e2e8f0'; // gray.200 equivalent

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="md"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "lg"
      }}
    >
      <Icon as={icon} boxSize={10} color="#0080ff" mb={4} />
      <Heading as="h3" size="md" mb={2}>{title}</Heading>
      <Text>{description}</Text>
    </Box>
  );
}