import { useMemo, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Flex, Stack, Spinner } from "@chakra-ui/react";
import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";

export default function LimitedFeedPage({
  filter,
  until,
  limit,
  options = {},
}) {
  const { events: rawEvents, eose } = useEvents(
    until
      ? {
          ...filter,
          until,
          limit,
        }
      : {
          ...filter,
          limit,
        },
    {
      ...options,
      cacheUsage: "ONLY_RELAY",
      closeOnEose: true,
    }
  );
  const events = rawEvents.slice(0, limit);
  const oldest = events.length > 0 ? events[events.length - 1] : null;
  const [showNext, setShowNext] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      setShowNext(true);
    }
  }, [inView]);

  return (
    <Stack gap={4} width="100%">
      {events.length === 0 && !eose && (
        <Flex alignItems="center" justifyContent="center" w="100%" minH="20rem">
          <Spinner size="xl" />
        </Flex>
      )}
      {events.length > 0 && eose && <Events events={events} />}
      {events.length > 0 && !showNext && <div ref={ref}></div>}
      {showNext && eose && (
        <LimitedFeedPage
          filter={filter}
          until={oldest.created_at - 1}
          limit={limit}
          options={options}
        />
      )}
    </Stack>
  );
}
