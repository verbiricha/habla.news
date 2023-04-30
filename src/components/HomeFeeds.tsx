import { useState, useMemo } from "react";

import { useAtom } from "jotai";
import { Stack, Heading, Text } from "@chakra-ui/react";

import { getMetadata } from "@habla/nip23";
import { LONG_FORM, HIGHLIGHT, DAY } from "@habla/const";
import { followsAtom, relaysAtom } from "@habla/state";
import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";
import Tabs from "@habla/components/Tabs";
import Relays from "@habla/components/Relays";
import FeedPage from "@habla/components/nostr/feed/FeedPage";
import FeaturedArticles from "@habla/components/Featured";
import Tags from "@habla/components/Tags";
import Hashtags from "@habla/components/Hashtags";
import useTopTags from "@habla/hooks/useTopTags";

export default function HomeFeeds() {
  const [follows] = useAtom(followsAtom);
  const tags = useTopTags(21);
  const tabs = [
    {
      name: `Posts`,
      panel: <FeedPage filter={{ kinds: [LONG_FORM] }} offset={DAY} />,
    },
    {
      name: `Highlights`,
      panel: <FeedPage filter={{ kinds: [HIGHLIGHT] }} offset={DAY} />,
    },
    {
      name: `Relays`,
      panel: <Relays />,
    },
  ];
  return (
    <>
      <FeaturedArticles />
      <Stack>
        <Heading fontSize="4xl" fontWeight={500}>
          🌶️ topics
        </Heading>
        <Hashtags hashtags={tags} />
      </Stack>
      <Tabs tabs={tabs} />
    </>
  );
}
