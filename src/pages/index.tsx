import Head from "next/head";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";

import {
  Flex,
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useAtom } from "jotai";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import { followsAtom, relaysAtom } from "@habla/state";
import Layout from "@habla/layouts/Layout";
import Hero from "@habla/components/Hero";

const Feed = dynamic(() => import("@habla/components/nostr/Feed", {
  ssr: false
})

function Index() {
  const now = useMemo(() => Math.floor(Date.now() / 1000), []);
  const [relays] = useAtom(relaysAtom);
  const [follows] = useAtom(followsAtom);
  const authors = useMemo(() => {
    return Array.from(new Set(Array.from(follows).map((u) => u.hexpubkey())));
  }, [follows]);
  const [since, setSince] = useState(
    Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000)
  );
  return (
    <>
      <Head>
        <title>Habla</title>
        <meta name="og:title" content="Habla" />
        <meta name="og:description" content="Speak your mind" />
      </Head>
      <Layout hero>
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList>
            <Tab>Posts</Tab>
            <Tab>Highlights</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <Feed
                key="articles"
                filter={{ kinds: [LONG_FORM], since, until: now }}
                options={{ closeOnEose: true, cacheUsage: "CACHE_FIRST" }}
              />
            </TabPanel>
            <TabPanel px={0}></TabPanel>
            <Feed
              key="highlights"
              filter={{ kinds: [HIGHLIGHT], limit: 3 }}
              options={{ closeOnEose: false, cacheUsage: "ONLY_RELAY" }}
            />
          </TabPanels>
        </Tabs>
      </Layout>
    </>
  );
}

export default Index;
