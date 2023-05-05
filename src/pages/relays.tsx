import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";

import { Flex, Stack, Heading, Text, Spinner } from "@chakra-ui/react";

import { RelayItem } from "@habla/components/Relays";
import Layout from "@habla/layouts/Layout";

export default function Relays() {
  const [compatibleRelays, setCompatibleRelays] = useState();
  useEffect(() => {
    fetch("https://api.nostr.watch/v1/nip/33")
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
      })
      .then((rs) => setCompatibleRelays(rs))
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Relays</title>
      </Head>
      <Layout>
        <Text fontSize="xl">
          Compatible relay list provided by{" "}
          <Link href={`https://nostr.watch`}>
            <Text as="span" color="highlight">
              nostr.watch
            </Text>
          </Link>
        </Text>
        {compatibleRelays ? (
          <Stack gap={4}>
            {compatibleRelays.map((url) => (
              <RelayItem key={url} url={url} />
            ))}
          </Stack>
        ) : (
          <Flex
            flexDirection="column"
            gap={4}
            alignItems="center"
            justifyContent="center"
            height="20em"
          >
            <Text>Fetching relay list</Text>
            <Spinner size="xl" />
          </Flex>
        )}
      </Layout>
    </>
  );
}
