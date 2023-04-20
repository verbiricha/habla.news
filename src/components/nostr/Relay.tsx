import { useState, useMemo } from "react";
import { useRouter } from "next/router";

import {
  Flex,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import { decodeNrelay } from "@habla/nostr";
import Feed from "@habla/components/nostr/Feed";
import RelayFavicon from "@habla/components/RelayFavicon";

export default function Relay({ relay }) {
  const [since, setSince] = useState(
    Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000)
  );
  return (
    <>
      <Flex alignItems="center" gap="2" wordBreak="break-word">
        <RelayFavicon url={relay} />
        <Heading textOverflow="ellipsis">{relay}</Heading>
      </Flex>
      <Tabs variant="soft-rounded" colorScheme="purple">
        <TabList>
          <Tab>Posts</Tab>
          <Tab>Highlights</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <Feed
              filter={{ kinds: [LONG_FORM], since }}
              options={{
                relays: [relay],
                cacheUsage: "ONLY_RELAY",
                closeOnEose: false,
              }}
            />
          </TabPanel>
          <TabPanel px={0}>
            <Feed
              filter={{ kinds: [HIGHLIGHT], since }}
              options={{
                relays: [relay],
                cacheUsage: "ONLY_RELAY",
                closeOnEose: false,
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
