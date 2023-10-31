import { useMemo } from "react";
import { Helmet } from "react-helmet";

import { getMetadata } from "@habla/nip23";
import {
  ZAP,
  HIGHLIGHT,
  NOTE,
  REPOST,
  REACTION,
  BOOKMARKS,
} from "@habla/const";
import { useReactions } from "@habla/nostr/hooks";
import BaseLongFormNote from "@habla/components/LongFormNote";

export default function LongFormNote({ event, relays, excludeAuthor }) {
  const { title, summary, image } = getMetadata(event);
  const { reactions, notes, reposts, zaps, highlights, bookmarks } =
    useReactions(event, [ZAP, HIGHLIGHT, REPOST, NOTE, REACTION, BOOKMARKS], {
      cacheUsage: "PARALLEL",
      closeOnEose: false,
    });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta name="og:description" content={summary} />
        {image && <meta name="og:image" content={image} />}
      </Helmet>
      <BaseLongFormNote
        excludeAuthor={excludeAuthor}
        event={event}
        relays={relays}
        notes={notes}
        reactions={reactions}
        highlights={highlights}
        reposts={reposts}
        zaps={zaps}
        bookmarks={bookmarks}
      />
    </>
  );
}
