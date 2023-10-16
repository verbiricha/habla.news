import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import Reactions from "./Reactions";

export default function LazyReactions({ event, kinds, live }) {
  return live ? (
    <Reactions
      event={event}
      kinds={kinds}
      opts={{
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
        closeOnEose: false,
      }}
    />
  ) : null;
}
