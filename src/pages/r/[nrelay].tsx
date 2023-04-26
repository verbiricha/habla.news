import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Head from "next/head";

import { Flex, Heading, Text } from "@chakra-ui/react";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import { decodeNrelay } from "@habla/nostr";
import Layout from "@habla/layouts/Layout";
import Feed from "@habla/components/nostr/Feed";
import RelayFavicon from "@habla/components/RelayFavicon";

const Relay = dynamic(() => import("@habla/components/nostr/Relay"), {
  ssr: false,
});

export default function RelayPage() {
  const router = useRouter();
  const { nrelay } = router.query;
  const relay = decodeNrelay(nrelay);
  const now = useMemo(() => Math.floor(Date.now() / 1000), []);
  const [since, setSince] = useState(
    Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000)
  );
  return (
    <>
      <Head>
        <title>Relay: {relay}</title>
      </Head>
      <Layout>
        {!relay && <Text>Sorry, couldn't decode nrelay.</Text>}
        {relay && <Relay key={relay} relay={relay} />}
      </Layout>
    </>
  );
}
