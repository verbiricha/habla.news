import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import Feed from "@habla/components/nostr/feed/Feed";
import { LONG_FORM } from "@habla/const";

export default function SearchFeed({ query, relays }) {
  const filter = {
    kinds: [LONG_FORM],
    search: query,
  };
  const options = {
    relays,
    cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
  };
  return (
    query.length > 2 && (
      <Feed key={query} filter={filter} options={options} limit={21} />
    )
  );
}
