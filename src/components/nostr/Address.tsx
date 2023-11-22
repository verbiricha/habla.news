import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import { Spinner } from "@chakra-ui/react";

import { useEvent } from "@habla/nostr/hooks";
import {
  LONG_FORM,
  LONG_FORM_DRAFT,
  APP,
  HIGHLIGHT,
  LISTS,
  COMMUNITY,
} from "@habla/const";

import LongFormNote from "./LongFormNote";
import FeedLongFormNote from "./feed/LongFormNote";
import List from "./List";
import Community from "@habla/components/nostr/feed/Community";
import App from "./App";
import UnknownKind from "./UnknownKind";

export default function Address({
  naddr,
  kind,
  identifier,
  pubkey,
  relays,
  isFeed = false,
  ...props
}) {
  const event = useEvent(
    {
      kinds: [kind],
      "#d": [identifier],
      authors: [pubkey],
    },
    { cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST }
  );

  if (event && (kind === LONG_FORM || kind === LONG_FORM_DRAFT)) {
    return isFeed ? (
      <FeedLongFormNote event={event} />
    ) : (
      <LongFormNote event={event} relays={relays} {...props} />
    );
  }

  if (event && LISTS.includes(kind)) {
    return <List event={event} {...props} />;
  }
  if (event && kind === COMMUNITY) {
    return <Community event={event} />;
  }
  if (event?.kind === APP) {
    return <App event={event} />;
  }

  return event ? <UnknownKind event={event} /> : <Spinner />;
}
