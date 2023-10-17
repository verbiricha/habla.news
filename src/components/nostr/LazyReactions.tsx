import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import Reactions from "./Reactions";

export default function LazyReactions({ event, kinds, live }) {
  return (
    <Reactions
      event={event}
      kinds={kinds}
      opts={{
        disable: !live,
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
        closeOnEose: false,
      }}
    />
  );
}
