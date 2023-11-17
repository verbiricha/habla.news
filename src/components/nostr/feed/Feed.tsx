import { useMemo, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "next-i18next";
import {
  NDKFilter,
  NDKSubscriptionOptions,
  NDKSubscriptionCacheUsage,
} from "@nostr-dev-kit/ndk";

import { Flex, Stack, Text, Spinner, Button } from "@chakra-ui/react";
import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";

interface FeedProps {
  filter: NDKFilter;
  options: NDKSubscriptionOptions;
  until?: number;
  limit?: number;
}

export default function Feed({ filter, until, limit = 3, options = {} }) {
  const { t } = useTranslation("common");
  const [showNext, setShowNext] = useState(false);
  const ndkFilter = useMemo(() => {
    if (until) {
      return { ...filter, until, limit };
    }
    return { ...filter, limit };
  }, [filter, until, limit]);
  const { events, eose } = useEvents(ndkFilter, {
    closeOnEose: true,
    cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    ...options,
  });
  const oldest = useMemo(() => {
    return events.reduce((acc, e) => {
      if (acc === null) {
        return e.created_at;
      }
      return acc < e.created_at ? acc : e.created_at;
    }, null);
  }, [events]);

  const hasEvents = events.length > 0;
  const isLoading = !eose && !hasEvents;
  const noEventsFound = eose && !hasEvents;
  const canLoadMore = eose && !showNext && hasEvents;
  const shouldShowNextPage = eose && showNext && oldest !== null;

  return (
    <Stack gap={4} width="100%">
      {isLoading && (
        <Flex alignItems="center" justifyContent="center" w="100%" minH="20rem">
          <Spinner size="xl" />
        </Flex>
      )}
      {hasEvents && <Events events={events} />}
      {canLoadMore && (
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
      {noEventsFound && (
        <Flex align="center" justifyContent="center" mb={4}>
          <Text fontSize="sm" color="secondary">
            {t("no-more-events")}
          </Text>
        </Flex>
      )}
      {shouldShowNextPage && (
        <Feed
          filter={filter}
          until={oldest - 1000 * 60}
          limit={limit}
          options={options}
        />
      )}
    </Stack>
  );
}
