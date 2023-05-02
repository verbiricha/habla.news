import { useMemo } from "react";

import { Flex } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import { combineLists } from "@habla/util";
import { ZAP, REACTION, NOTE, HIGHLIGHT } from "@habla/const";
import { useReactions } from "@habla/nostr/hooks";
import Tabs from "@habla/components/Tabs";
import db from "@habla/cache/db";

import Zaps from "../Zaps";
import TextReactions from "../Reactions";
import Highlights from "../Highlights";
import Comments from "../Comments";

export default function Reactions({
  event,
  kinds = [ZAP, REACTION, NOTE, HIGHLIGHT],
  opts = { cacheUsage: "CACHE_ONLY", closeOnEose: true },
  includeTabs = false,
}) {
  const reactionEvents = useLiveQuery(
    async () => {
      const [t, v] = event.tagReference();
      const filter = combineLists([[ZAP, REACTION, NOTE, HIGHLIGHT], [v]]);
      let result;
      if (t === "a") {
        result = await db.event.where("[kind+a]").anyOf(filter).toArray();
      } else {
        result = await db.event.where("[kind+e]").anyOf(filter).toArray();
      }
      return result;
    },
    [event],
    []
  );
  const zaps = reactionEvents.filter(
    (r) => r.kind === ZAP && r.author != event.pubkey
  );
  const reactions = reactionEvents.filter(
    (r) => r.kind === REACTION && r.author != event.pubkey
  );
  const notes = reactionEvents.filter((r) => r.kind === NOTE);
  const highlights = reactionEvents.filter((r) => r.kind === HIGHLIGHT);
  const tabs = useMemo(() => {
    const result = [];
    if (!includeTabs) {
      return result;
    }
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
      <Flex alignItems="center" gap="6">
        {kinds.includes(HIGHLIGHT) && (
          <Highlights event={event} highlights={highlights} />
        )}
        {kinds.includes(NOTE) && <Comments event={event} comments={notes} />}
        {kinds.includes(REACTION) && (
          <TextReactions event={event} reactions={reactions} />
        )}
        {kinds.includes(ZAP) && <Zaps event={event} zaps={zaps} />}
      </Flex>
      {includeTabs && tabs.length > 0 && <Tabs tabs={tabs} />}
    </>
  );
}
