import { useMemo } from "react";

import Tabs from "@habla/components/Tabs";
import { useReactions } from "@habla/nostr/hooks";
import BaseLongFormNote from "@habla/components/LongFormNote";
import Highlights from "@habla/components/nostr/Highlights";
import Comments from "@habla/components/nostr/Comments";
import TextReactions from "@habla/components/nostr/TextReactions";
import Zaps from "@habla/components/nostr/Zaps";

import HighlightIcon from "@habla/icons/Highlight";
import CommentIcon from "@habla/icons/Comment";
import HeartIcon from "@habla/icons/Heart";
import ZapIcon from "@habla/icons/Zap";

export default function LongFormNote({ event, relays, excludeAuthor }) {
  const { reactions, notes, zaps, highlights } = useReactions(event);
  const tabs = useMemo(() => {
    const result = [];
    if (highlights.length > 0) {
      result.push({
        name: <HighlightIcon />,
        panel: <Highlights event={event} highlights={highlights} />,
      });
    }
    if (notes.length > 0) {
      result.push({
        name: <CommentIcon />,
        panel: <Comments event={event} comments={notes} />,
      });
    }

    if (reactions.length > 0) {
      result.push({
        name: <HeartIcon />,
        panel: <TextReactions reactions={reactions} />,
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
      <BaseLongFormNote
        excludeAuthor={excludeAuthor}
        event={event}
        relays={relays}
        notes={notes}
        reactions={reactions}
        highlights={highlights}
        zaps={zaps}
      />
      <Tabs tabs={tabs} />
    </>
  );
}
