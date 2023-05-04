import { useMemo } from "react";
import { Stack } from "@chakra-ui/react";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import Tabs from "@habla/components/Tabs";
import Highlights from "@habla/components/nostr/Highlights";
import LongFormNote from "./feed/LongFormNote";

export default function UserContent({ pubkey, events }) {
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
          <Highlights highlights={highlights} />
        </Stack>
      ),
    },
  ];

  return <Tabs tabs={tabs} />;
}
