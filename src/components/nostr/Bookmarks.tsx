import { Stack, Text } from "@chakra-ui/react";

import { findTag } from "@habla/tags";
import Tabs from "@habla/components/Tabs";
import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";
import { ListTag } from "@habla/components/nostr/List";

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
  const tabs = events.map((e) => {
    return {
      name: findTag(e, "d"),
      panel: (
        <Stack>
          {e.tags.map((t) => (
            <ListTag tag={t} />
          ))}
        </Stack>
      ),
    };
  });

  return (
    <Stack width="100%">
      <Tabs tabs={tabs} />
    </Stack>
  );
}
