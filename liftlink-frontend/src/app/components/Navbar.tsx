'use client'

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,

  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,

  useBreakpointValue,
  useDisclosure,
  Menu,

  MenuItem,

  Avatar,
  HStack,
} from '@chakra-ui/react';
import {
  FaBars as HamburgerIcon,
  FaTimes as CloseIcon,
  FaChevronDown as ChevronDownIcon,
  FaChevronRight as ChevronRightIcon,
} from 'react-icons/fa';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import NextLink from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const { user, profile, signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Box>
      <Flex
        bg={'white'}
        color={'gray.600'}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={'gray.200'}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={'#0080ff'}
            fontWeight="bold"
            fontSize="xl">
            <NextLink href={user ? "/dashboard" : "/"} passHref>
              LiftLink
            </NextLink>
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          {user && profile ? (
            <HStack>
              <Avatar
                size="sm"
                name={`${profile.first_name} ${profile.last_name}`}
              />
              <Text display={{ base: 'none', md: 'block' }}>
                {profile.first_name}
              </Text>
              <Button variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            </HStack>
          ) : (
            <>
              <Button
                as={NextLink}
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
                href={'/login'}>
                Sign In
              </Button>
              <Button
                as={NextLink}
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'#0080ff'}
                href={'/register'}
                _hover={{
                  bg: '#0066cc',
                }}>
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      {isOpen && <MobileNav />}
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = 'gray.600';
  const linkHoverColor = '#0080ff';
  const popoverContentBgColor = 'white';
  const { user } = useAuthStore();

  const navItems = user ? AUTHENTICATED_NAV_ITEMS : PUBLIC_NAV_ITEMS;

  return (
    <Stack direction={'row'} spacing={4}>
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                as={NextLink}
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      as={NextLink}
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: '#e6f7ff' }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: '#0080ff' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'#0080ff'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  const { user } = useAuthStore();
  const navItems = user ? AUTHENTICATED_NAV_ITEMS : PUBLIC_NAV_ITEMS;

  return (
    <Stack
      bg={'white'}
      p={4}
      display={{ md: 'none' }}>
      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={'gray.600'}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      {isOpen && (
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={'gray.200'}
          align={'start'}>
          {children &&
            children.map((child) => (
              <Link as={NextLink} key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      )}
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const PUBLIC_NAV_ITEMS: Array<NavItem> = [
  {
    label: 'How It Works',
    href: '/how-it-works',
  },
  {
    label: 'About Us',
    href: '/about',
  },
];

const AUTHENTICATED_NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Find a Ride',
    href: '/find-ride',
  },
  {
    label: 'Offer a Ride',
    href: '/offer-ride',
  },
  {
    label: 'My Rides',
    href: '/my-rides',
  },
];