import Link from "next/link";
import { Flex, Stack, Heading, Text } from "@chakra-ui/react";

import User from "@habla/components/nostr/User";
import Address from "@habla/markdown/NAddr";

function Featured({ naddr, kind, pubkey, identifier }) {
  return (
    <Flex flexDirection="column">
      <Address
        fontSize="2xl"
        naddr={naddr}
        kind={kind}
        pubkey={pubkey}
        identifier={identifier}
      />
      <Flex alignItems="center" gap="1">
        <Text fontSize="md">by</Text>
        <User size="xs" pubkey={pubkey} />
      </Flex>
    </Flex>
  );
}

function FeaturedArticles() {
  return (
    <Stack spacing="3">
      <Featured
        naddr={
          "naddr1qqxnzd3cxy6rjv3hx5cnyde5qy88wumn8ghj7mn0wvhxcmmv9uq3uamnwvaz7tmwdaehgu3dwp6kytnhv4kxcmmjv3jhytnwv46z7qg3waehxw309ahx7um5wgh8w6twv5hszymhwden5te0danxvcmgv95kutnsw43z7qglwaehxw309ahx7um5wgkhyetvv9ujumn0ddhhgctjduhxxmmd9upzql6u9d8y3g8flm9x8frtz0xmsfyf7spq8xxkpgs8p2tge25p346aqvzqqqr4gukz494x"
        }
        kind={30023}
        pubkey="7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d"
        identifier="1681492751274"
      />
      <Featured
        naddr={
          "naddr1qqxnzd3cxqmrzv3exgmr2wfeqgsxu35yyt0mwjjh8pcz4zprhxegz69t4wr9t74vk6zne58wzh0waycrqsqqqa28pjfdhz"
        }
        kind={30023}
        pubkey="6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93"
        identifier="1680612926599"
      />
      <Featured
        naddr={
          "naddr1qqxnzd3cxyerxd3h8qerwwfcqgsgydql3q4ka27d9wnlrmus4tvkrnc8ftc4h8h5fgyln54gl0a7dgsrqsqqqa28qy28wumn8ghj7un9d3shjtnyv9kh2uewd9hszrthwden5te0dehhxtnvdakqvtl0f3"
        }
        kind={30023}
        pubkey="82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2"
        identifier="1681236782798"
      />
    </Stack>
  );
}

export default function Hero() {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      color="#16161D"
      bg="purple.100"
      width="100%"
      py={8}
      px={4}
    >
      <Flex width="100%" maxWidth="48rem" p={2}>
        <Stack spacing={{ base: "4", md: "6" }}>
          <Heading fontSize="6xl" fontWeight={500} lineHeight={"52px"}>
            Speak your mind
          </Heading>
          <Text fontSize="2xl" mt={10}>
            ✍️ Write, 📣 publish, <mark>highlight</mark>, 🗣️ discuss, 🤑 earn.
          </Text>
          <Text fontSize="xl" mt={10}>
            Habla is a website for reading and publishing long form content over{" "}
            <Link href="https://nostr.how">
              <Text as="span" fontWeight={500}>
                Nostr
              </Text>
            </Link>
            . Want to know more? Start here:{" "}
          </Text>
          <FeaturedArticles />
        </Stack>
      </Flex>
    </Flex>
  );
}
