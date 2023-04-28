import { useState, useMemo } from "react";
import Link from "next/link";

import { Flex, Box, Heading, Stack } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { getMetadata } from "@habla/nip23";
import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import { followsAtom, relaysAtom } from "@habla/state";
import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";
import UserCard from "@habla/components/nostr/UserCard";
import Tabs from "@habla/components/Tabs";
import Relays from "@habla/components/Relays";

export default function HomeFeeds() {
  const [relays] = useAtom(relaysAtom);
  const [follows] = useAtom(followsAtom);
  const now = useMemo(() => Math.floor(Date.now() / 1000), []);
  const [since, setSince] = useState(
    Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000)
  );
  const { events } = useEvents(
    {
      kinds: [LONG_FORM, HIGHLIGHT],
      since,
      until: now,
    },
    {
      cacheUsage: "CACHE_FIRST",
    }
  );
  const posts = events.filter((e) => e.kind === LONG_FORM);
  const highlights = events.filter((e) => e.kind === HIGHLIGHT);
  const authors = useMemo(() => {
    return Array.from(new Set(posts.map((e) => e.pubkey)));
  }, [events]);
  const tabs = [
    {
      name: `Posts`,
      panel: <Events events={posts} />,
    },
    {
      name: `Highlights`,
      panel: <Events events={highlights} />,
    },
    {
      name: `Relays`,
      panel: <Relays />,
    },
  ];
  return <Tabs tabs={tabs} />;
}
