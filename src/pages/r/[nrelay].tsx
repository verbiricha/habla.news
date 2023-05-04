import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Head from "next/head";

import { Text } from "@chakra-ui/react";

import { decodeNrelay } from "@habla/nostr";
import Layout from "@habla/layouts/Layout";

const Relay = dynamic(() => import("@habla/components/nostr/Relay"), {
  ssr: false,
});

export default function RelayPage() {
  const router = useRouter();
  const { nrelay } = router.query;
  const relay = decodeNrelay(nrelay);
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
