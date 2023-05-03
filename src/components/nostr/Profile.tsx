import { Stack } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import { useUser } from "@habla/nostr/hooks";
import Markdown from "@habla/markdown/Markdown";

import User from "./User";
import UserContent from "./UserContent";

export default function Profile({ pubkey, relays }) {
  const profile = useUser(pubkey);
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
      <UserContent pubkey={pubkey} />
    </Stack>
  );
}
