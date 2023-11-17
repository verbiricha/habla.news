import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import User from "@habla/components/nostr/User";
import { useEvent } from "@habla/nostr/hooks";

export default function EventId({ id, ...rest }) {
  const event = useEvent(
    {
      ids: [id],
    },
    { cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST }
  );
  return event ? (
    <User pubkey={event.pubkey} {...rest} size="xs" fontSize="xs" />
  ) : null;
}
