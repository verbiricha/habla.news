import { useState, useMemo } from "react";
import { useRouter } from "next/router";

import { Flex, Heading, Text } from "@chakra-ui/react";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import { decodeNrelay } from "@habla/nostr";
import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";
import RelayFavicon from "@habla/components/RelayFavicon";
import Tabs from "@habla/components/Tabs";

export default function Relay({ relay }) {
  const [since, setSince] = useState(
    Math.floor((Date.now() - 2 * 24 * 60 * 60 * 1000) / 1000)
  );
  const { events } = useEvents(
    {
      kinds: [LONG_FORM, HIGHLIGHT],
      since,
    },
    {
      relays: [relay],
      closeOnEose: true,
      cacheUsage: "ONLY_RELAY",
    }
  );
  const posts = events.filter((e) => e.kind === LONG_FORM);
  const highlights = events.filter((e) => e.kind === HIGHLIGHT);
  const tabs = [
    {
      name: "Posts",
      panel: <Events events={posts} />,
    },
    {
      name: "Highlights",
      panel: <Events events={highlights} />,
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
