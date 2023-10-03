import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import FeedPage from "@habla/components/nostr/feed/FeedPage";
import { LONG_FORM, MONTH } from "@habla/const";

export default function SearchFeed({ query, relays }) {
  const filter = {
    kinds: [LONG_FORM],
    search: query,
    limit: 21,
  };
  const options = {
    relays,
    cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
  };
  return (
    query.length > 2 && (
      <FeedPage key={query} offset={MONTH} filter={filter} options={options} />
    )
  );
}
