import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import {
  Flex,
  Stack,
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import {
  AttachmentIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
  LockIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import { nip19 } from "nostr-tools";
import CommentIcon from "@habla/icons/Comment";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import User from "@habla/components/nostr/User";

function Description({ info }) {
  const { description } = info;
  return description?.length > 0 ? (
    <Box my={3}>
      <Text>{description}</Text>
    </Box>
  ) : null;
}

function PayToRelay({ info }) {
  const { payments_url, fees } = info;
  return (
    <>
      {payments_url && (
        <>
          {fee?.admission && (
            <Flex flexDirection="column" my={2}>
              <Heading fontSize="xl" mb={2}>
                Admission fee
              </Heading>
              <Text>
                {fee.admission.unit === "msat"
                  ? fee.admission.amount / 1000
                  : fee.admission.amount}{" "}
                sats
              </Text>
            </Flex>
          )}
          <Flex flexDirection="column" my={2}>
            <Heading fontSize="xl" mb={2}>
              Pay to Relay
            </Heading>
            <Link href={payments_url}>{payments_url}</Link>
          </Flex>
        </>
      )}
    </>
  );
}

export function Nips({ info }) {
  const { supported_nips } = info;
  const hasDeletes = supported_nips?.includes(9);
  const hasMarkets = supported_nips?.includes(15);
  const hasPublicChat = supported_nips?.includes(28);
  const hasReplaceable = supported_nips?.includes(33);
  const hasAuth = supported_nips?.includes(42);
  const hasSearch = supported_nips?.includes(50);
  const hasFilestorage = supported_nips?.includes(95);
  return (
    <>
      {supported_nips && (
        <Flex flexDirection="column" my={4}>
          <Flex direction="row" flexWrap="wrap" gap={2}>
            {hasReplaceable && (
              <Tag size="md" colorScheme="green" maxW="10em">
                <TagLeftIcon as={EditIcon} />
                <TagLabel>Blog</TagLabel>
              </Tag>
            )}
            {hasMarkets && (
              <Tag size="md" colorScheme="yellow" maxW="10em">
                <TagLeftIcon as={RepeatIcon} />
                <TagLabel>Markets</TagLabel>
              </Tag>
            )}
            {hasPublicChat && (
              <Tag size="md" colorScheme="pink" maxW="10em">
                <TagLeftIcon as={CommentIcon} />
                <TagLabel>Chat</TagLabel>
              </Tag>
            )}
            {hasDeletes && (
              <Tag size="md" colorScheme="red" maxW="10em">
                <TagLeftIcon as={DeleteIcon} />
                <TagLabel>Delete</TagLabel>
              </Tag>
            )}
            {hasSearch && (
              <Tag size="md" colorScheme="purple" maxW="10em">
                <TagLeftIcon as={SearchIcon} />
                <TagLabel>Search</TagLabel>
              </Tag>
            )}
            {hasAuth && (
              <Tag size="md" colorScheme="blue" maxW="10em">
                <TagLeftIcon as={LockIcon} />
                <TagLabel>Auth</TagLabel>
              </Tag>
            )}
            {hasFilestorage && (
              <Tag size="md" colorScheme="teal" maxW="10em">
                <TagLeftIcon as={AttachmentIcon} />
                <TagLabel>Files</TagLabel>
              </Tag>
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
}

function Software({ info }) {
  const { software, version } = info;
  return (
    <>
      {software && (
        <Flex flexDirection="column" my={2}>
          <Heading fontSize="xl" mb={2}>
            Software
          </Heading>
          <Text>
            {software}
            {version ? ` ${version}` : ""}
          </Text>
        </Flex>
      )}
    </>
  );
}

function getCountryName(countryCode) {
  const displayNames = new Intl.DisplayNames([], { type: "region" });
  return displayNames.of(countryCode);
}

function Countries({ info }) {
  const { relay_countries } = info;
  return (
    <>
      {relay_countries && (
        <Flex flexDirection="column" my={2}>
          <Heading fontSize="xl" mb={2}>
            Countries
          </Heading>
          <Flex flexWrap="wrap">
            {relay_countries.map((n) => (
              <Box key={n} mr={2} mb={2}>
                {getCountryName(n)}
              </Box>
            ))}
          </Flex>
        </Flex>
      )}
    </>
  );
}

function isHexString(str) {
  const hexRegex = /^[a-fA-F0-9]{64}$/;
  return hexRegex.test(str);
}

export function Operator({ info }) {
  const { pubkey } = info;
  return (
    isHexString(pubkey) && (
      <Stack align="center" direction="row" gap={1}>
        <Text fontSize="xs" color="gray.500">
          by
        </Text>
        <User size="xs" pubkey={pubkey} />
      </Stack>
    )
  );
}

function getLanguageName(languageTag) {
  const displayNames = new Intl.DisplayNames([], { type: "language" });
  return displayNames.of(languageTag);
}

function CommunityPreferences({ info }) {
  const { language_tags, tags, posting_policy } = info;
  return (
    <>
      {language_tags && (
        <Flex flexDirection="column" my={2}>
          <Heading fontSize="xl" mb={2}>
            Languages
          </Heading>
          <List>
            {languageTag.map((l) => (
              <ListItem>{getLanguageName(l)}</ListItem>
            ))}
          </List>
        </Flex>
      )}
      {tags && (
        <Flex flexDirection="column" my={2}>
          <Heading fontSize="xl" mb={2}>
            Tags
          </Heading>
          <Flex flexWrap="wrap">
            {tags.map((t) => (
              <Box key={t} mr={2} mb={2}>
                <Tag>{t}</Tag>
              </Box>
            ))}
          </Flex>
        </Flex>
      )}
      {posting_policy && (
        <Flex flexDirection="column" my={2}>
          <Heading fontSize="xl" mb={2}>
            Posting Policy
          </Heading>
          <Link href={posting_policy}>{posting_policy}</Link>
        </Flex>
      )}
    </>
  );
}

export default function RelaySummaryInfo({ url, info }) {
  return (
    <Stack gap={2}>
      <Description info={info} />
      <Nips info={info} />
    </Stack>
  );
}
