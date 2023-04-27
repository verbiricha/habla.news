import Link from "next/link";
import { Flex, Stack, Heading, Text } from "@chakra-ui/react";

import User from "@habla/components/nostr/User";
import Address from "@habla/markdown/NAddr";

export default function Hero() {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      color="#16161D"
      bg="#d8ccff"
      margin={50}
      padding={5}
      width="100%"
      height="300px"
      py={12}

    >
      <Flex width="100%" maxWidth="48rem" p={2}>
        <Stack
          maxW={{ lg: "xl", md: "xl", xl: "xl" }}
          spacing={{ base: "3", md: "5" }}
        >
          <Heading fontSize="6xl" fontWeight={500} lineHeight={"52px"}>
            Speak your mind
          </Heading>
          <Text fontSize="2xl" mt={10}>
            Write, publish, highlight, discuss, subscribe and get rewarded for
            your content.
          </Text>
          <Text fontSize="xl" mt={10}>
            New to{" "}
            <Link href="https://nostr.how">
              <Text as="span" fontWeight={500}>
                Nostr
              </Text>
            </Link>
            ? Start here:{" "}
          </Text>
          <Flex alignItems="center" gap="2">
            <Address
              fontSize="2xl"
              naddr="naddr1qqxnzd3cxy6rjv3hx5cnyde5qy88wumn8ghj7mn0wvhxcmmv9uq3uamnwvaz7tmwdaehgu3dwp6kytnhv4kxcmmjv3jhytnwv46z7qg3waehxw309ahx7um5wgh8w6twv5hszymhwden5te0danxvcmgv95kutnsw43z7qglwaehxw309ahx7um5wgkhyetvv9ujumn0ddhhgctjduhxxmmd9upzql6u9d8y3g8flm9x8frtz0xmsfyf7spq8xxkpgs8p2tge25p346aqvzqqqr4gukz494x"
              kind={30023}
              pubkey="7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d"
              identifier="1681492751274"
            />
            <Text fontSize="xl">by</Text>
            <User pubkey="7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d" />
          </Flex>
        </Stack>
      </Flex>
    </Flex>
  );
}
