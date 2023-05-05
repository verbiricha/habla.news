import { useState, useMemo } from "react";

import { useAtom } from "jotai";
import { Stack } from "@chakra-ui/react";

import { LONG_FORM, HIGHLIGHT, DAY } from "@habla/const";
import { followsAtom } from "@habla/state";
import SectionHeading from "@habla/components/SectionHeading";
import Tabs from "@habla/components/Tabs";
import Relays from "@habla/components/Relays";
import FeedPage from "@habla/components/nostr/feed/FeedPage";
import FeaturedArticles from "@habla/components/Featured";

export default function HomeFeeds() {
  const [follows] = useAtom(followsAtom);
  const tabs = [
    {
      name: `Articles`,
      panel: (
        <>
          <FeaturedArticles />
          <Stack mt={6}>
            <SectionHeading>New!</SectionHeading>
            <FeedPage filter={{ kinds: [LONG_FORM] }} offset={DAY} />,
          </Stack>
        </>
      ),
    },
    {
      name: `Highlights`,
      panel: <FeedPage filter={{ kinds: [HIGHLIGHT] }} offset={DAY} />,
    },
    //{
    //  name: `Relays`,
    //  panel: <Relays />,
    //},
  ];
  return (
    <>
      <Tabs tabs={tabs} />
    </>
  );
}
