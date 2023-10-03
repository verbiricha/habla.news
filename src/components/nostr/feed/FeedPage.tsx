import { useMemo, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "next-i18next";
import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import { Flex, Stack, Text, Spinner, Button } from "@chakra-ui/react";
import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";

export default function FeedPage({ filter, until, offset, options = {} }) {
  const { t } = useTranslation("common");
  const now = useMemo(() => {
    if (until) {
      return until;
    }
    return Math.floor(Date.now() / 1000);
  }, [until]);
  const since = useMemo(() => now - offset, [now, offset]);
  const { events, eose } = useEvents(
    {
      ...filter,
      since,
      until: now,
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
      ...options,
    }
  );
  const oldest = useMemo(() => {
    return events.reduce((acc, e) => {
      if (acc === null) {
        return e.created_at;
      }
      return acc < e.created_at ? acc : e.created_at;
    }, null);
  }, [events]);
  const [showNext, setShowNext] = useState(false);
  const hasEvents = events.length > 0;
  return (
    <Stack gap={4} width="100%">
      {hasEvents && <Events events={events} />}
      {!eose && !hasEvents && (
        <Flex alignItems="center" justifyContent="center" w="100%" minH="20rem">
          <Spinner size="xl" />
        </Flex>
      )}
      {eose && !showNext && hasEvents && (
        <Flex align="center" justifyContent="center" mb={4}>
          <Button
            variant="solid"
            colorScheme="purple"
            onClick={() => setShowNext(true)}
          >
            {t("load-more")}
          </Button>
        </Flex>
      )}
      {eose && !hasEvents && (
        <Flex align="center" justifyContent="center" mb={4}>
          <Text fontSize="sm" color="secondary">
            {t("no-more-events")}
          </Text>
        </Flex>
      )}
      {eose && showNext && oldest !== null && (
        <FeedPage
          filter={filter}
          until={oldest - 1000 * 60}
          offset={offset}
          options={options}
        />
      )}
    </Stack>
  );
}
