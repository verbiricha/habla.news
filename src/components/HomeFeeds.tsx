import { useState, useMemo } from "react";
import Link from "next/link";

import { useAtom } from "jotai";
import { Flex, Box, Heading, Stack } from "@chakra-ui/react";

import { getMetadata } from "@habla/nip23";
import { LONG_FORM, HIGHLIGHT, DAY } from "@habla/const";
import { followsAtom, relaysAtom } from "@habla/state";
import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";
import Tabs from "@habla/components/Tabs";
import Relays from "@habla/components/Relays";
import FeedPage from "@habla/components/nostr/feed/FeedPage";

export default function HomeFeeds() {
  const [follows] = useAtom(followsAtom);
  const tabs = [
    {
      name: `Posts`,
      panel: (
        <FeedPage
          filter={{ kinds: [LONG_FORM] }}
          offset={DAY}
          options={{ cacheUsage: "CACHE_FIRST" }}
        />
      ),
    },
    {
      name: `Highlights`,
      panel: (
        <FeedPage
          filter={{ kinds: [HIGHLIGHT] }}
          offset={DAY}
          options={{ cacheUsage: "CACHE_FIRST" }}
        />
      ),
    },
    {
      name: `Relays`,
      panel: <Relays />,
    },
  ];
  return <Tabs tabs={tabs} />;
}
