import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Head from "next/head";

import { Flex, Heading, Text } from "@chakra-ui/react";

//import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import Layout from "@habla/layouts/Layout";
//import Feed from "@habla/components/nostr/Feed";

//const Relay = dynamic(() => import("@habla/components/nostr/Relay"), {
//  ssr: false,
//});

export default function TagPage() {
  const router = useRouter();
  const { tag } = router.query;
  return (
    <>
      <Head>
        <title>Hashtag: {tag}</title>
      </Head>
      <Layout>{tag}</Layout>
    </>
  );
}
