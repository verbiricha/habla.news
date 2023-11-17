import { useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import { Stack, Heading, Text } from "@chakra-ui/react";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import { decodeNrelay } from "@habla/nostr";
import Events from "@habla/components/nostr/feed/Events";
import RelayFavicon from "@habla/components/RelayFavicon";
import Tabs from "@habla/components/Tabs";
import Feed from "@habla/components/nostr/feed/Feed";
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
          <Feed
            key={`${relay}-posts`}
            filter={{ kinds: [LONG_FORM] }}
            limit={10}
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
          <Feed
            key={`${relay}-highlights`}
            filter={{ kinds: [HIGHLIGHT] }}
            limit={10}
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
      <Stack align="center" direction="row" gap={3} wordBreak="break-word">
        <RelayFavicon url={relay} size="md" />
        <Heading textOverflow="ellipsis">{data?.name || relay}</Heading>
      </Stack>
      {data?.description && <Text>{data?.description}</Text>}
      {data && <Nips info={data} />}
      <Tabs tabs={tabs} />
    </>
  );
}
