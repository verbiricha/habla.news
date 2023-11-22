import { useAtomValue } from "jotai";
import { Spinner } from "@chakra-ui/react";
import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import Event from "@habla/components/nostr/Event";
import { useEvent } from "@habla/nostr/hooks";
import { relaysAtom } from "@habla/state";

export default function NEvent({ id, author, relays, nevent }) {
  const defaultRelays = useAtomValue(relaysAtom);
  const event = useEvent(
    {
      ids: [id],
      authors: [author],
    },
    {
      relays: relays.concat(defaultRelays),
      cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
    }
  );
  return event ? <Event event={event} isDetail /> : <Spinner />;
}
