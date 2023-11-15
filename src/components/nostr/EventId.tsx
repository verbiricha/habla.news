import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import { Spinner } from "@chakra-ui/react";

import Event from "@habla/components/nostr/Event";
import { useEvent } from "@habla/nostr/hooks";

export default function EventId({ id, ...rest }) {
  const event = useEvent(
    {
      ids: [id],
    },
    { cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST }
  );
  return event ? <Event event={event} {...rest} /> : <Spinner />;
}
