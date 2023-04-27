import { useMemo } from "react";
import { Stack } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import { useUser, useEvents } from "@habla/nostr/hooks";
import Tabs from "@habla/components/Tabs";
import Highlight from "@habla/components/nostr/feed/Highlight";
import Markdown from "@habla/markdown/Markdown";

import User from "./User";
import LongFormNote from "./feed/LongFormNote";

export default function Profile({ pubkey }) {
  const profile = useUser(pubkey);
  const { events } = useEvents(
    {
      kinds: [LONG_FORM, HIGHLIGHT],
      authors: [pubkey],
    },
    { cacheUsage: "PARALLEL" }
  );
  const posts = useMemo(() => {
    return events.filter((e) => e.kind === LONG_FORM);
  }, [events]);
  const highlights = useMemo(() => {
    return events.filter((e) => e.kind === HIGHLIGHT);
  }, [events]);
  const tabs = [
    {
      name: "Posts",
      panel: (
        <Stack spacing="2">
          {posts.map((e) => (
            <LongFormNote key={e.id} event={e} excludeAuthor />
          ))}
        </Stack>
      ),
    },
    {
      name: "Highlights",
      panel: (
        <Stack spacing="2">
          {highlights.map((e) => (
            <Highlight key={e.id} event={e} />
          ))}
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Stack alignItems="center" spacing="2">
        <User pubkey={pubkey} size="xl" flexDirection="column" />
        {profile?.about && (
          <Prose textAlign="center">
            <Markdown content={profile?.about} />
          </Prose>
        )}
      </Stack>
      <Tabs tabs={tabs} />
    </>
  );
}
