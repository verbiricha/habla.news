import { useState, useMemo } from "react";

import { useAtom } from "jotai";
import { Flex, Box, Heading, Stack } from "@chakra-ui/react";

import { getMetadata } from "@habla/nip23";
import { LONG_FORM, NOTE, WEEK } from "@habla/const";
import { followsAtom, relaysAtom } from "@habla/state";
import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";
import Tabs from "@habla/components/Tabs";
import Relays from "@habla/components/Relays";
import Feed from "@habla/components/nostr/Feed";
import FeaturedArticles from "@habla/components/Featured";

export default function TagFeeds({ tag }) {
  const [follows] = useAtom(followsAtom);
  const tabs = [
    {
      name: `Posts`,
      panel: (
        <Feed
          filter={{ kinds: [LONG_FORM], "#t": [tag] }}
          options={{ cacheUsage: "ONLY_RELAY", closeOnEose: true }}
        />
      ),
    },
    {
      name: `Follows`,
      panel: (
        <Feed
          filter={{ kinds: [LONG_FORM], authors: follows, "#t": [tag] }}
          options={{ cacheUsage: "ONLY_RELAY", closeOnEose: true }}
        />
      ),
    },
  ];
  return (
    <>
      <Heading>Tag: #{tag}</Heading>
      <Tabs tabs={tabs} />
    </>
  );
}
