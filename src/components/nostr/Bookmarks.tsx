import { Text } from "@chakra-ui/react";

import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";

export default function Bookmarks({ pubkey }) {
  const { events, eose } = useEvents(
    {
      kinds: [30001],
      authors: [pubkey],
    },
    {
      cacheUsage: "PARALLEL",
      closeOnEose: true,
    }
  );

  return <Events events={events} />;
}
