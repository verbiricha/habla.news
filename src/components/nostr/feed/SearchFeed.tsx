import { LONG_FORM } from "@habla/const";

import Feed from "@habla/components/nostr/Feed";

export default function SearchFeed({ query, relays }) {
  const filter = {
    kinds: [LONG_FORM],
    search: query,
    limit: 100,
  };
  const options = {
    relays,
    cacheUsage: "ONLY_RELAY",
    closeOnEose: true,
  };
  return (
    query.length > 2 && <Feed key={query} filter={filter} options={options} />
  );
}
