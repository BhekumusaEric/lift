'use client'

import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  VisuallyHidden,
  chakra,

} from '@chakra-ui/react';
import { FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import NextLink from 'next/link';

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: React.ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={'blackAlpha.100'}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: 'blackAlpha.200',
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  return (
    <Box
      bg={'gray.50'}
      color={'gray.700'}>
      <Container as={Stack} maxW={'container.xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }}
          spacing={8}>
          <Stack spacing={6}>
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="brand.500">
                LiftLink
              </Text>
            </Box>
            <Text fontSize={'sm'}>
              © {new Date().getFullYear()} LiftLink. All rights reserved
            </Text>
            <Stack direction={'row'} spacing={6}>
              <SocialButton label={'Twitter'} href={'#'}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={'YouTube'} href={'#'}>
                <FaYoutube />
              </SocialButton>
              <SocialButton label={'Instagram'} href={'#'}>
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>Company</Text>
            <Link as={NextLink} href={'/about'}>About Us</Link>
            <Link as={NextLink} href={'/contact'}>Contact Us</Link>
            <Link as={NextLink} href={'/careers'}>Careers</Link>
            <Link as={NextLink} href={'/press'}>Press</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>Support</Text>
            <Link as={NextLink} href={'/help'}>Help Center</Link>
            <Link as={NextLink} href={'/safety'}>Safety Center</Link>
            <Link as={NextLink} href={'/community'}>Community Guidelines</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>Legal</Text>
            <Link as={NextLink} href={'/privacy'}>Privacy Policy</Link>
            <Link as={NextLink} href={'/terms'}>Terms of Service</Link>
            <Link as={NextLink} href={'/cookies'}>Cookie Policy</Link>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
