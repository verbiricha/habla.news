import { useState, useMemo } from "react";
import { useRouter } from "next/router";

import { Flex, Heading, Text } from "@chakra-ui/react";

import { LONG_FORM, HIGHLIGHT, DAY } from "@habla/const";
import { decodeNrelay } from "@habla/nostr";
import Events from "@habla/components/nostr/feed/Events";
import RelayFavicon from "@habla/components/RelayFavicon";
import RelaySummary from "@habla/components/RelaySummary";
import Tabs from "@habla/components/Tabs";
import FeedPage from "@habla/components/nostr/feed/FeedPage";
import useRelayMetadata from "@habla/hooks/useRelayMetadata";

export default function Relay({ relay }) {
  const { data, isError } = useRelayMetadata(relay);
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
        <Heading textOverflow="ellipsis">{data?.name || relay}</Heading>
      </Flex>
      {data && <RelaySummary url={relay} info={data} />}
      <Tabs tabs={tabs} />
    </>
  );
}
