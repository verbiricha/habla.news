import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { nip19 } from "nostr-tools";

import { Flex, Heading, Text, Stack } from "@chakra-ui/react";

import { LONG_FORM, HIGHLIGHT, DAY } from "@habla/const";
import { decodeNrelay } from "@habla/nostr";
import Events from "@habla/components/nostr/feed/Events";
import RelayFavicon from "@habla/components/RelayFavicon";
import Tabs from "@habla/components/Tabs";
import FeedPage from "@habla/components/nostr/feed/FeedPage";
import useRelayMetadata from "@habla/hooks/useRelayMetadata";
import Search from "@habla/components/Search";

export default function Relay({ relay }) {
  const { data, isError } = useRelayMetadata(relay);
  // search
  const tabs = useMemo(() => {
    const result = [
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
    if (data?.supported_nips?.includes(50)) {
      result.push({
        name: "Search",
        panel: <Search relays={[relay]} />,
      });
    }
    return result;
  }, [data]);
  return (
    <>
      <Flex alignItems="center" gap="2" wordBreak="break-word">
        <Heading textOverflow="ellipsis">{data?.name || relay}</Heading>
      </Flex>

      <Stack direction="row" spacing={1}>
        <RelayFavicon url={relay} />
        <Link href={`/r/${nip19.nrelayEncode(relay)}`}>
          <Text>{relay}</Text>
        </Link>
      </Stack>

      <Text>{data?.description}</Text>
      <Tabs tabs={tabs} />
    </>
  );
}
