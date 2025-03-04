import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  type FlexProps,
  Icon,
  Link,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import type { ReactNode, ReactText } from 'react';
import type { IconType } from 'react-icons';
import {
  MdList,
  MdOutlineChatBubbleOutline,
  MdOutlineGroup,
} from 'react-icons/md';

import CreateListingModal from '@/components/modals/createListing';
import { LoadingSection } from '@/components/shared/LoadingSection';
import { Banner } from '@/components/sponsor/Banner';
import { SelectSponsor } from '@/features/listing-builder';
import { Default } from '@/layouts/Default';
import { Meta } from '@/layouts/Meta';
import { userStore } from '@/store/user';

interface LinkItemProps {
  name: string;
  link?: string;
  icon: IconType;
  isExternal?: boolean;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  link?: string;
  children: ReactText;
}

export function Sidebar({
  children,
  showBanner = false,
}: {
  children: ReactNode;
  showBanner?: boolean;
}) {
  const { userInfo } = userStore();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!session && status === 'loading') {
    return <LoadingSection />;
  }

  if (!session && status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  const isHackathonRoute = router.asPath.startsWith('/dashboard/hackathon');

  const slug =
    isHackathonRoute && router.asPath
      ? router.asPath.split('/dashboard/hackathon/')[1]?.replace(/\/$/, '')
      : null;

  const LinkItems: Array<LinkItemProps> = isHackathonRoute
    ? [
        { name: 'All Tracks', link: `/hackathon/${slug}`, icon: MdList },
        {
          name: 'Get Help',
          link: 'https://t.me/pratikdholani',
          icon: MdOutlineChatBubbleOutline,
        },
      ]
    : [
        { name: 'My Listings', link: '/listings', icon: MdList },
        { name: 'Members', link: '/members', icon: MdOutlineGroup },
        {
          name: 'Get Help',
          link: 'https://t.me/pratikdholani',
          icon: MdOutlineChatBubbleOutline,
        },
      ];

  const NavItem = ({ icon, link, children, ...rest }: NavItemProps) => {
    const router = useRouter();
    const currentPath = router.asPath.split('?')[0];
    const isExternalLink = link?.startsWith('https://');
    const resolvedLink = isExternalLink ? link : `/dashboard${link}`;
    const isActiveLink = resolvedLink
      ? currentPath?.startsWith(resolvedLink)
      : false;

    return (
      <Link
        as={NextLink}
        _focus={{ boxShadow: 'none' }}
        href={resolvedLink}
        isExternal={isExternalLink}
        style={{ textDecoration: 'none' }}
      >
        <NavItemContent icon={icon} isActiveLink={isActiveLink} {...rest}>
          {children}
        </NavItemContent>
      </Link>
    );
  };

  const NavItemContent = ({ icon, isActiveLink, children, ...rest }: any) => (
    <Flex
      align="center"
      px={6}
      py={3}
      color={isActiveLink ? 'brand.purple' : 'brand.slate.500'}
      bg={isActiveLink ? '#EEF2FF' : 'transparent'}
      _hover={{
        bg: '#F5F8FF',
        color: 'brand.purple',
      }}
      cursor="pointer"
      role="group"
      {...rest}
    >
      {icon && (
        <Icon
          as={icon}
          mr="4"
          fontSize="16"
          _groupHover={{
            color: 'brand.purple',
          }}
        />
      )}
      {children}
    </Flex>
  );

  const showLoading = !isHackathonRoute
    ? !userInfo?.currentSponsor?.id
    : !userInfo?.hackathonId && session?.user?.role !== 'GOD';

  const showContent = isHackathonRoute
    ? userInfo?.hackathonId || session?.user?.role === 'GOD'
    : userInfo?.currentSponsor?.id;

  return (
    <Default
      className="bg-white"
      meta={
        <Meta
          title="Superteam Earn | Work to Earn in Crypto"
          description="Explore the latest bounties on Superteam Earn, offering opportunities in the crypto space across Design, Development, and Content."
          canonical="https://earn.superteam.fun"
        />
      }
    >
      <Flex justify="start" minH="100vh">
        <Box
          display={{ base: 'none', md: 'block' }}
          w={{ base: 0, md: 80 }}
          minH="100vh"
          pt={8}
          bg="white"
          borderRight={'1px solid'}
          borderRightColor={'blackAlpha.200'}
        >
          {session?.user?.role === 'GOD' && !isHackathonRoute && (
            <Box px={6} pb={6}>
              <SelectSponsor />
            </Box>
          )}
          <CreateListingModal isOpen={isOpen} onClose={onClose} />
          <Flex align="center" justify="space-between" px={6} pb={6}>
            {!isHackathonRoute ? (
              <Button
                w="full"
                py={'22px'}
                fontSize="md"
                leftIcon={<AddIcon w={3} h={3} />}
                onClick={() => onOpen()}
                variant="solid"
              >
                Create New Listing
              </Button>
            ) : (
              <Button
                as={NextLink}
                w="full"
                py={'22px'}
                fontSize="md"
                href={`/dashboard/hackathon/create-hackathon/${slug ? `?slug=${slug}` : ''}`}
                leftIcon={<AddIcon w={3} h={3} />}
                variant="solid"
              >
                Create New Track
              </Button>
            )}
          </Flex>
          {LinkItems.map((link) => (
            <NavItem key={link.name} link={link.link} icon={link.icon}>
              {link.name}
            </NavItem>
          ))}
        </Box>
        {showLoading && <LoadingSection />}
        {showContent && (
          <Box w="full" px={6} py={8} bg="white">
            {showBanner && <Banner slug={slug} />}
            {children}
          </Box>
        )}
      </Flex>
    </Default>
  );
}
