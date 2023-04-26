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
import Feed from "@habla/components/nostr/Feed";

export default function HomeFeeds() {
  const [relays] = useAtom(relaysAtom);
  const [follows] = useAtom(followsAtom);
  const now = useMemo(() => Math.floor(Date.now() / 1000), []);
  const authors = useMemo(() => {
    return Array.from(new Set(Array.from(follows).map((u) => u.hexpubkey())));
  }, [follows]);
  const [since, setSince] = useState(
    Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000)
  );
  return (
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
            options={{ closeOnEose: false, cacheUsage: "PARALLEL" }}
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
  );
}
