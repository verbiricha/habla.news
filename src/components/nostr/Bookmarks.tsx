import { Stack, Text } from "@chakra-ui/react";
import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import { findTag } from "@habla/tags";
import Tabs from "@habla/components/Tabs";
import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";
import List from "@habla/components/nostr/List";
import { BOOKMARKS } from "@habla/const";

export default function Bookmarks({ pubkey }) {
  const { events, eose } = useEvents(
    {
      kinds: [BOOKMARKS],
      authors: [pubkey],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
      closeOnEose: true,
    }
  );
  const tabs = events.map((e) => {
    return {
      name: findTag(e, "d"),
      panel: (
        <Stack>
          <List event={e} />
        </Stack>
      ),
    };
  });

  return <Tabs tabs={tabs} />;
}
