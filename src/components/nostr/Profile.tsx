import { Stack } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import { useEvents, useUser } from "@habla/nostr/hooks";
import Markdown from "@habla/markdown/Markdown";

import User from "./User";
import UserContent from "./UserContent";

export default function Profile({ pubkey, relays }) {
  const profile = useUser(pubkey);
  const { events } = useEvents(
    {
      kinds: [LONG_FORM, HIGHLIGHT],
      authors: [pubkey],
    },
    { relays, cacheUsage: "PARALLEL" }
  );
  return (
    <Stack>
      <Stack alignItems="center" spacing="2">
        <User pubkey={pubkey} size="xl" flexDirection="column" />
        {profile?.about && (
          <Prose textAlign="center">
            <Markdown content={profile?.about} />
          </Prose>
        )}
      </Stack>
      <UserContent pubkey={pubkey} events={events} />
    </Stack>
  );
}
