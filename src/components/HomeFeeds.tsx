import { useState, useMemo } from "react";

import { useAtom } from "jotai";

import { LONG_FORM, HIGHLIGHT, DAY } from "@habla/const";
import { followsAtom } from "@habla/state";
import Tabs from "@habla/components/Tabs";
import Relays from "@habla/components/Relays";
import FeedPage from "@habla/components/nostr/feed/FeedPage";
import FeaturedArticles from "@habla/components/Featured";
import HotTopics from "@habla/components/HotTopics";

export default function HomeFeeds() {
  const [follows] = useAtom(followsAtom);
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
      <HotTopics />
      <FeaturedArticles />
      <Tabs tabs={tabs} />
    </>
  );
}
