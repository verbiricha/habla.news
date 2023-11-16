import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";

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

import User from "@habla/components/nostr/User";
import ExternalLink from "@habla/components/ExternalLink";

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
            <ExternalLink href={payments_url}>{payments_url}</ExternalLink>
          </Flex>
        </>
      )}
    </>
  );
}

function NipLink({ nip, icon, label }) {
  return (
    <Tag size="md" maxW="10em">
      <TagLeftIcon as={icon} />
      <TagLabel>{label}</TagLabel>
    </Tag>
  );
}

export function Nips({ info }) {
  const { t } = useTranslation("common");
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
              <Tag size="md" maxW="10em">
                <TagLeftIcon as={EditIcon} />
                <TagLabel>{t("blog")}</TagLabel>
              </Tag>
            )}
            {hasMarkets && (
              <Tag size="md" maxW="10em">
                <TagLeftIcon as={RepeatIcon} />
                <TagLabel>{t("markets")}</TagLabel>
              </Tag>
            )}
            {hasPublicChat && (
              <Tag size="md" maxW="10em">
                <TagLeftIcon as={CommentIcon} />
                <TagLabel>{t("chat")}</TagLabel>
              </Tag>
            )}
            {hasDeletes && (
              <Tag size="md" maxW="10em">
                <TagLeftIcon as={DeleteIcon} />
                <TagLabel>{t("delete")}</TagLabel>
              </Tag>
            )}
            {hasSearch && (
              <Tag size="md" maxW="10em">
                <TagLeftIcon as={SearchIcon} />
                <TagLabel>{t("search")}</TagLabel>
              </Tag>
            )}
            {hasAuth && (
              <Tag size="md" maxW="10em">
                <TagLeftIcon as={LockIcon} />
                <TagLabel>{t("auth")}</TagLabel>
              </Tag>
            )}
            {hasFilestorage && (
              <Tag size="md" maxW="10em">
                <TagLeftIcon as={AttachmentIcon} />
                <TagLabel>{t("files")}</TagLabel>
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
  return isHexString(pubkey) && <User size="xs" pubkey={pubkey} />;
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
          <ExternalLink href={posting_policy}>{posting_policy}</ExternalLink>
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
