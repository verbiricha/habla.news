import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import { Stack, Heading, Text } from "@chakra-ui/react";

import { LONG_FORM, HIGHLIGHT, DAY, WEEK } from "@habla/const";
import { decodeNrelay } from "@habla/nostr";
import Events from "@habla/components/nostr/feed/Events";
import RelayFavicon from "@habla/components/RelayFavicon";
import Tabs from "@habla/components/Tabs";
import FeedPage from "@habla/components/nostr/feed/FeedPage";
import { Nips } from "@habla/components/RelaySummary";
import useRelayMetadata from "@habla/hooks/useRelayMetadata";
import Search from "@habla/components/Search";

export default function Relay({ relay }) {
  const { data, isError } = useRelayMetadata(relay);
  const { t } = useTranslation("common");
  const relays = [relay];
  const tabs = useMemo(() => {
    const result = [
      {
        name: t("articles"),
        panel: (
          <FeedPage
            key={`${relay}-posts`}
            filter={{ kinds: [LONG_FORM] }}
            offset={2 * DAY}
            options={{
              relays,
              cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
            }}
          />
        ),
      },
      {
        name: t("highlights"),
        panel: (
          <FeedPage
            key={`${relay}-highlights`}
            filter={{ kinds: [HIGHLIGHT] }}
            offset={WEEK}
            options={{
              relays,
              cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
            }}
          />
        ),
      },
    ];
    if (data?.supported_nips?.includes(50)) {
      result.push({
        name: t("search"),
        panel: <Search relays={relays} />,
      });
    }
    return result;
  }, [data, relays]);
  return (
    <>
      <Stack align="center" direction="row" gap={1} wordBreak="break-word">
        <RelayFavicon url={relay} size="md" />
        <Heading textOverflow="ellipsis">{data?.name || relay}</Heading>
      </Stack>
      <Text>{data?.description}</Text>
      {data && <Nips info={data} />}
      <Tabs tabs={tabs} />
    </>
  );
}
