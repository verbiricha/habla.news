import { useMemo } from "react";
import { Stack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import Tabs from "@habla/components/Tabs";
import Highlights from "@habla/components/nostr/Highlights";
import BookmarkLists from "@habla/components/nostr/BookmarkLists";
import { getMetadata } from "@habla/nip23";

import LongFormNote from "./feed/LongFormNote";

const NewPosts = dynamic(() => import("@habla/components/nostr/NewPosts"), {
  ssr: false,
});
const NewHighlights = dynamic(
  () => import("@habla/components/nostr/NewHighlights"),
  {
    ssr: false,
  }
);

export default function UserContent({ pubkey, events, bookmarks }) {
  const { t } = useTranslation("common");
  const posts = useMemo(() => {
    return events
      .filter((e) => e.kind === LONG_FORM)
      .sort((a, b) => getMetadata(b).publishedAt - getMetadata(a).publishedAt);
  }, [events]);
  const lastPost = useMemo(() => {
    return events
      .filter((e) => e.kind === LONG_FORM)
      .sort((a, b) => b.created_at - a.created_at)
      .at(0)?.created_at;
  }, [events]);
  const highlights = useMemo(() => {
    return events.filter((e) => e.kind === HIGHLIGHT);
  }, [events]);
  const lastHighlight = useMemo(() => {
    return events
      .filter((e) => e.kind === HIGHLIGHT)
      .sort((a, b) => b.created_at - a.created_at)
      .at(0)?.created_at;
  }, [events]);
  const tabs = [
    {
      name: t("articles"),
      panel: (
        <Stack spacing="4">
          {lastPost && (
            <NewPosts pubkey={pubkey} since={lastPost} excludeAuthor />
          )}
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
          {lastHighlight && (
            <NewHighlights pubkey={pubkey} since={lastHighlight} />
          )}
          <Highlights highlights={highlights} />
        </Stack>
      ),
    },
    {
      name: t("bookmarks"),
      panel: <BookmarkLists bookmarks={bookmarks} />,
    },
  ];

  return <Tabs tabs={tabs} />;
}
