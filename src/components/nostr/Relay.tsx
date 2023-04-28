import { useState, useMemo } from "react";
import { useRouter } from "next/router";

import { Flex, Heading, Text } from "@chakra-ui/react";

import { LONG_FORM, HIGHLIGHT, DAY } from "@habla/const";
import { decodeNrelay } from "@habla/nostr";
import Events from "@habla/components/nostr/feed/Events";
import RelayFavicon from "@habla/components/RelayFavicon";
import Tabs from "@habla/components/Tabs";
import FeedPage from "@habla/components/nostr/feed/FeedPage";

export default function Relay({ relay }) {
  const tabs = [
    {
      name: "Posts",
      panel: (
        <FeedPage
          key={`${relay}-posts`}
          filter={{ kinds: [LONG_FORM] }}
          offset={DAY}
          options={{
            relays: [relay],
            cacheUsage: "ONLY_RELAY",
          }}
        />
      ),
    },
    {
      name: "Highlights",
      panel: (
        <FeedPage
          key={`${relay}-highlights`}
          filter={{ kinds: [HIGHLIGHT] }}
          offset={DAY}
          options={{
            relays: [relay],
            cacheUsage: "ONLY_RELAY",
          }}
        />
      ),
    },
  ];
  return (
    <>
      <Flex alignItems="center" gap="2" wordBreak="break-word">
        <RelayFavicon url={relay} />
        <Heading textOverflow="ellipsis">{relay}</Heading>
      </Flex>
      <Tabs tabs={tabs} />
    </>
  );
}
