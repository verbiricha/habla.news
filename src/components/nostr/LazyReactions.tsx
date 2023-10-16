import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import Reactions from "./Reactions";

export default function LazyReactions({ event, kinds, live }) {
  return live ? (
    <Reactions
      key={event.id}
      event={event}
      kinds={kinds}
      opts={{
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
        closeOnEose: false,
      }}
    />
  ) : (
    <Reactions
      key={`cached-${event.id}`}
      event={event}
      kinds={kinds}
      opts={{
        cacheUsage: NDKSubscriptionCacheUsage.ONLY_CACHE,
        closeOnEose: true,
      }}
    />
  );
}
