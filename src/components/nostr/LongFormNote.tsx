import { useMemo } from "react";
import { Helmet } from "react-helmet";

import { getMetadata } from "@habla/nip23";
import { ZAP, HIGHLIGHT, NOTE, REACTION } from "@habla/const";
import Tabs from "@habla/components/Tabs";
import { useReactions } from "@habla/nostr/hooks";
import BaseLongFormNote from "@habla/components/LongFormNote";
import Highlights from "@habla/components/nostr/Highlights";
import Comments from "@habla/components/nostr/Comments";
import Zaps from "@habla/components/nostr/Zaps";
import HighlightIcon from "@habla/icons/Highlight";
import CommentIcon from "@habla/icons/Comment";
import HeartIcon from "@habla/icons/Heart";
import ZapIcon from "@habla/icons/Zap";

export default function LongFormNote({ event, relays, excludeAuthor }) {
  const { title, summary, image } = getMetadata(event);
  const { reactions, notes, zaps, highlights } = useReactions(
    event,
    [ZAP, HIGHLIGHT, NOTE, REACTION],
    { cacheUsage: "PARALLEL", closeOnEose: false }
  );
  const tabs = useMemo(() => {
    const result = [];
    if (highlights.length > 0) {
      result.push({
        name: <HighlightIcon />,
        panel: <Highlights highlights={highlights} showHeader={false} />,
      });
    }
    if (notes.length > 0) {
      result.push({
        name: <CommentIcon />,
        panel: <Comments event={event} comments={notes} />,
      });
    }

    if (zaps.length > 0) {
      result.push({
        name: <ZapIcon />,
        panel: <Zaps event={event} zaps={zaps} />,
      });
    }

    return result;
  }, [reactions, notes, zaps, highlights]);

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
        zaps={zaps}
      />
    </>
  );
}
