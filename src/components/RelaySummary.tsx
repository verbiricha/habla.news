import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import {
  Flex,
  Box,
  Tag,
  Heading,
  Text,
  List,
  ListItem,
} from "@chakra-ui/react";
import { nip19 } from "nostr-tools";

import User from "@habla/components/nostr/User";

function Description({ info }) {
  const { description } = info;
  return description?.length > 0 ? (
    <Flex flexDirection="column" my={2}>
      <Heading fontSize="xl" mb={2}>
        Description
      </Heading>
      <Text>{description}</Text>
    </Flex>
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

function Nips({ info }) {
  const { supported_nips } = info;
  return (
    <>
      {supported_nips && (
        <Flex flexDirection="column" my={2}>
          <Heading fontSize="xl" mb={2}>
            NIPs
          </Heading>
          <Flex flexWrap="wrap">
            {supported_nips.map((n) => (
              <Box key={n} mr={2} mb={2}>
                <Link href={`https://nips.be/${n}`}>{n}</Link>
              </Box>
            ))}
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

function Operator({ info, relays }) {
  const { pubkey, contact } = info;
  return (
    <>
      {isHexString(pubkey) && (
        <Flex flexDirection="column" my={2}>
          <Heading fontSize="xl" mb={2}>
            Operator
          </Heading>
          <User pubkey={pubkey} />
        </Flex>
      )}
    </>
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
    <>
      <Flex flexDirection="column">
        <Flex flexDirection="column" my={2}>
          <Heading fontSize="xl" mb={2}>
            URL
          </Heading>
          <Link href={`/r/${nip19.nrelayEncode(url)}`}>
            <Text>{url}</Text>
          </Link>
        </Flex>
        <Description info={info} />
        <Operator info={info} relays={[url]} />
        <Nips info={info} />
        <Countries info={info} />
        <CommunityPreferences info={info} />
      </Flex>
    </>
  );
}
