import { ExternalLinkIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  HStack,
  Image,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';

import { VerticalStep } from '@/components/misc/steps';
import { CountDownRenderer } from '@/components/shared/countdownRenderer';
import { tokenList } from '@/constants/index';
import { getURLSanitized } from '@/utils/getURLSanitized';

import type { Bounty, Rewards } from '../../types';
import { SubmissionActionButton } from './SubmissionActionButton';

export function RightSideBar({ listing }: { listing: Bounty }) {
  const {
    id,
    token,
    type,
    deadline,
    rewards,
    rewardAmount,
    requirements,
    isWinnersAnnounced,
    pocSocials,
    Hackathon,
    applicationType,
    timeToComplete,
  } = listing;

  const [isSubmissionNumberLoading, setIsSubmissionNumberLoading] =
    useState(true);
  const [submissionNumber, setSubmissionNumber] = useState(0);
  const [submissionRange, setSubmissionRange] = useState('');
  let submissionStatus = 0;
  if (Number(moment(deadline).format('x')) < Date.now()) {
    submissionStatus = 1;
  }
  if (isWinnersAnnounced) {
    submissionStatus = 3;
  }

  const hasHackathonStarted = Hackathon?.startDate
    ? dayjs().isAfter(Hackathon.startDate)
    : true;

  const getSubmissionsCount = async () => {
    setIsSubmissionNumberLoading(true);
    try {
      const submissionCountDetails = await axios.get(
        `/api/submission/${id}/count/`,
      );
      const count = submissionCountDetails?.data || 0;
      setSubmissionNumber(count);
      if (count >= 0 && count <= 10) {
        setSubmissionRange('0-10');
      } else if (count > 10 && count <= 25) {
        setSubmissionRange('10-25');
      } else if (count > 25 && count <= 50) {
        setSubmissionRange('25-50');
      } else if (count > 50 && count <= 100) {
        setSubmissionRange('50-100');
      } else if (count > 100) {
        setSubmissionRange('100+');
      }
      setIsSubmissionNumberLoading(false);
    } catch (e) {
      setIsSubmissionNumberLoading(false);
    }
  };

  useEffect(() => {
    if (!isSubmissionNumberLoading) return;
    getSubmissionsCount();
  }, []);

  const isProject = type === 'project';
  const isBounty = type === 'bounty';

  type PrizeKey = keyof Rewards;

  const prizeMapping = [
    { key: 'first' as PrizeKey, label: '1st', description: 'First Prize' },
    { key: 'second' as PrizeKey, label: '2nd', description: 'Second Prize' },
    { key: 'third' as PrizeKey, label: '3rd', description: 'Third Prize' },
    { key: 'fourth' as PrizeKey, label: '4th', description: 'Fourth Prize' },
    { key: 'fifth' as PrizeKey, label: '5th', description: 'Fifth Prize' },
  ];

  return (
    <>
      <VStack gap={2} mx={2} pt={10}>
        <VStack
          justify={'center'}
          gap={0}
          minW={{ base: 'full', md: '22rem' }}
          pb={5}
          bg={'#FFFFFF'}
          rounded={'xl'}
        >
          <HStack
            justify={'space-between'}
            w={'full'}
            h={16}
            px={'1.5rem'}
            borderBottom={'1px solid #E2E8EF'}
          >
            <Flex align="center">
              <Image
                w={7}
                h={7}
                mr={2}
                alt={'green doller'}
                rounded={'full'}
                src={
                  tokenList.filter((e) => e?.tokenSymbol === token)[0]?.icon ??
                  '/assets/icons/green-dollar.svg'
                }
              />
              <Text color="color.slate.800" fontSize={'2xl'} fontWeight={500}>
                {rewardAmount?.toLocaleString() ?? 0}
                <Text
                  as="span"
                  ml={1}
                  color="brand.slate.400"
                  fontSize="lg"
                  fontWeight={400}
                >
                  {token}
                </Text>
              </Text>
            </Flex>
            {!isProject && (
              <Text color={'brand.slate.300'} fontSize={'lg'} fontWeight={400}>
                Total Prizes
              </Text>
            )}
          </HStack>
          {!isProject && (
            <VStack w={'full'} borderBottom={'1px solid #E2E8EF'}>
              <TableContainer w={'full'}>
                <Table mt={-8} variant={'unstyled'}>
                  <Thead>
                    <Tr>
                      <Th></Th>
                      <Th></Th>
                      <Th> </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {prizeMapping.map(
                      (prize, index) =>
                        rewards?.[prize.key] && (
                          <Tr key={index}>
                            <Td>
                              <Flex
                                align={'center'}
                                justify={'center'}
                                w={8}
                                h={8}
                                p={1.5}
                                fontSize={'0.7rem'}
                                bg={'#C6C6C62B'}
                                rounded={'full'}
                              >
                                {prize.label}
                              </Flex>
                            </Td>
                            <Td>
                              <Text
                                color={'#64758B'}
                                fontSize={'1.1rem'}
                                fontWeight={600}
                              >
                                {rewards[prize.key]}
                                <Text
                                  as="span"
                                  ml={1}
                                  color="brand.slate.300"
                                  fontWeight={400}
                                >
                                  {token}
                                </Text>
                              </Text>
                            </Td>
                            <Td>
                              <Text color={'#CBD5E1'} fontWeight={500}>
                                {prize.description}
                              </Text>
                            </Td>
                          </Tr>
                        ),
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          )}
          <Flex justify={'space-between'} w={'full'} px={5}>
            {hasHackathonStarted ? (
              <>
                <Flex align={'start'} justify={'center'} direction={'column'}>
                  <Flex align={'center'} justify={'center'} gap={2}>
                    <Image
                      w={'1.4rem'}
                      mt={-1}
                      alt={'suit case'}
                      src={'/assets/icons/purple-suitcase.svg'}
                    />
                    <Text color={'#000000'} fontSize="1.3rem" fontWeight={500}>
                      {isSubmissionNumberLoading
                        ? '...'
                        : !isProject
                          ? submissionNumber.toLocaleString()
                          : submissionRange}
                    </Text>
                  </Flex>
                  <Text color={'#94A3B8'}>
                    {!isProject
                      ? submissionNumber === 1
                        ? 'Submission'
                        : 'Submissions'
                      : submissionNumber === 1
                        ? 'Application'
                        : 'Applications'}
                  </Text>
                </Flex>

                <Flex
                  align={'start'}
                  justify={'center'}
                  direction={'column'}
                  py={3}
                >
                  <Flex align={'start'} justify={'center'} gap={1}>
                    <Image
                      w={'1.4rem'}
                      mt={1}
                      alt={'suit case'}
                      src={'/assets/icons/purple-timer.svg'}
                    />
                    <VStack align={'start'} gap={0}>
                      <Text
                        color={'#000000'}
                        fontSize="1.3rem"
                        fontWeight={500}
                      >
                        {applicationType === 'fixed' ? (
                          <Countdown
                            date={deadline}
                            renderer={CountDownRenderer}
                            zeroPadDays={1}
                          />
                        ) : (
                          'Rolling'
                        )}
                      </Text>
                      <Text color={'#94A3B8'}>
                        {applicationType === 'fixed' ? 'Remaining' : 'Deadline'}
                      </Text>
                    </VStack>
                  </Flex>
                </Flex>
              </>
            ) : (
              <Flex
                align={'start'}
                justify={'center'}
                direction={'column'}
                py={3}
              >
                <Flex align={'start'} justify={'center'} gap={1}>
                  <Image
                    w={'1.4rem'}
                    mt={1}
                    alt={'suit case'}
                    src={'/assets/icons/purple-timer.svg'}
                  />
                  <VStack align={'start'} gap={0}>
                    <Text color={'#000000'} fontSize="1.3rem" fontWeight={500}>
                      <Countdown
                        date={Hackathon?.startDate}
                        renderer={CountDownRenderer}
                        zeroPadDays={1}
                      />
                    </Text>
                    <Text color={'#94A3B8'}>Until Submissions Open</Text>
                  </VStack>
                </Flex>
              </Flex>
            )}
          </Flex>

          <Box w="full" px={5}>
            {isProject && (
              <Flex align={'start'} direction={'column'} my={4}>
                <Text color={'#000000'} fontSize="1.3rem" fontWeight={500}>
                  {timeToComplete}
                </Text>
                <Text color={'#94A3B8'}>Time to Complete</Text>
              </Flex>
            )}
            <SubmissionActionButton
              listing={listing}
              hasHackathonStarted={hasHackathonStarted}
              submissionNumber={submissionNumber}
              setSubmissionNumber={setSubmissionNumber}
            />
            {isProject && (
              <Flex gap="2" w="20rem" mt={4} p="3" bg={'#62F6FF10'}>
                <WarningIcon color="#1A7F86" />
                <Text color="#1A7F86" fontSize={'xs'} fontWeight={500}>
                  Don&apos;t start working just yet! Apply first, and then begin
                  working only once you&apos;ve been hired for the project.
                </Text>
              </Flex>
            )}
          </Box>
        </VStack>
        {Hackathon && (
          <VStack
            align={'start'}
            justify={'center'}
            w={{ base: 'full', md: '22rem' }}
            mt={4}
            p={6}
            bg={'#FFFFFF'}
            rounded={'xl'}
          >
            <Text
              h="100%"
              color={'brand.slate.400'}
              fontSize="1rem"
              fontWeight={500}
              textAlign="center"
            >
              {Hackathon.name.toUpperCase()} TRACK
            </Text>
            <Text color={'brand.slate.500'} fontSize="1rem">
              {Hackathon.description}
            </Text>
            <Link
              color={'brand.slate.500'}
              fontSize="1rem"
              fontWeight={500}
              href={`/${Hackathon.name.toLowerCase()}`}
              isExternal
            >
              View all tracks
            </Link>
          </VStack>
        )}
        {requirements && (
          <VStack
            align="start"
            w={{ base: 'full', md: '22rem' }}
            mt={4}
            p={6}
            bg="white"
            rounded={'xl'}
          >
            <Text
              h="100%"
              color={'brand.slate.400'}
              fontSize="1rem"
              fontWeight={500}
              textAlign="center"
            >
              ELIGIBILITY
            </Text>
            <Text color={'brand.slate.500'}>{requirements}</Text>
          </VStack>
        )}
        {pocSocials && (
          <VStack
            align={'start'}
            justify={'center'}
            w={{ base: '100%', md: '22rem' }}
            mt={4}
            p={6}
            bg={'#FFFFFF'}
            rounded={'xl'}
          >
            <Text
              h="100%"
              color={'brand.slate.400'}
              fontSize="1rem"
              fontWeight={500}
              textAlign="center"
            >
              CONTACT
            </Text>
            <Text>
              <Link
                color={'#64768b'}
                fontSize="1rem"
                fontWeight={500}
                href={getURLSanitized(pocSocials)}
                isExternal
              >
                Reach out
                <ExternalLinkIcon color={'#64768b'} mb={1} as="span" mx={1} />
              </Link>
              <Text as="span" color={'brand.slate.500'} fontSize="1rem">
                if you have any questions about this listing
              </Text>
            </Text>
          </VStack>
        )}
        {isBounty && (
          <VStack
            align={'start'}
            justify={'center'}
            minW={{ base: 'full', md: '22rem' }}
            mt={4}
            p={6}
            bg={'#FFFFFF'}
            rounded={'xl'}
          >
            <VerticalStep
              sublabel={'Give your best shot!'}
              currentStep={submissionStatus + 1}
              thisStep={1}
              label={'Submissions Open'}
            />

            <Divider
              h={10}
              border={'2px'}
              borderColor={'#6562FF'}
              transform={'translate(1rem)'}
              orientation="vertical"
            />
            <VerticalStep
              currentStep={submissionStatus + 1}
              thisStep={2}
              label={'Submissions Review'}
              sublabel={'Submissions being assessed'}
            />
            <Divider
              h={10}
              border={'2px'}
              borderColor={'#CBD5E1'}
              transform={'translate(1rem)'}
              orientation="vertical"
            />
            <VerticalStep
              currentStep={submissionStatus + 1}
              thisStep={3}
              sublabel={
                isWinnersAnnounced
                  ? 'Congratulations!'
                  : `Around ${moment(deadline)
                      .add(8, 'd')
                      .format('Do MMM, YY')}`
              }
              label={'Winner Announced'}
            />
          </VStack>
        )}
      </VStack>
    </>
  );
}
