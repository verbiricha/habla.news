import { useMemo, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Flex, Stack, Spinner } from "@chakra-ui/react";
import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";

export default function FeedPage({ filter, until, offset, options = {} }) {
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
      cacheUsage: "PARALLEL",
      ...options,
    }
  );
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
      {events.length > 0 && <Events events={events} />}
      {!eose && (
        <Flex alignItems="center" justifyContent="center" w="100%" minH="20rem">
          <Spinner size="xl" />
        </Flex>
      )}
      {events.length > 0 && !showNext && <div ref={ref}></div>}
      {showNext && eose && (
        <FeedPage
          filter={filter}
          until={oldest.created_at - 1}
          offset={offset}
          options={options}
        />
      )}
    </Stack>
  );
}
