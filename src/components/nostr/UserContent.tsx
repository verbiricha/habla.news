import { useMemo } from "react";
import { Stack } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import Tabs from "@habla/components/Tabs";
import Highlights from "@habla/components/nostr/Highlights";
import { getMetadata } from "@habla/nip23";
import LongFormNote from "./feed/LongFormNote";

export default function UserContent({ pubkey, events }) {
  const { t } = useTranslation("common");
  const posts = useMemo(() => {
    return events
      .filter((e) => e.kind === LONG_FORM)
      .sort((a, b) => getMetadata(b).publishedAt - getMetadata(a).publishedAt);
  }, [events]);
  const highlights = useMemo(() => {
    return events.filter((e) => e.kind === HIGHLIGHT);
  }, [events]);
  const tabs = [
    {
      name: t("articles"),
      panel: (
        <Stack spacing="4">
          {posts.map((e) => (
            <LongFormNote key={e.id} event={e} excludeAuthor />
          ))}
        </Stack>
      ),
    },
    {
      name: t("highlights"),
      panel: (
        <Stack spacing="4">
          <Highlights highlights={highlights} showHeader={false} />
        </Stack>
      ),
    },
  ];

  return <Tabs tabs={tabs} />;
}
