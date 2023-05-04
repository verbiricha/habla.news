import { useMemo } from "react";

import { Flex } from "@chakra-ui/react";

import { ZAP, REACTION, NOTE, HIGHLIGHT } from "@habla/const";
import { useReactions } from "@habla/nostr/hooks";
import Tabs from "@habla/components/Tabs";
import Zaps from "../Zaps";
import TextReactions from "../Reactions";
import Highlights from "@habla/components/reactions/Highlights";
import Comments from "../Comments";

export default function Reactions({
  event,
  kinds = [ZAP, REACTION, NOTE, HIGHLIGHT],
  opts = { cacheUsage: "CACHE_ONLY", closeOnEose: true },
  includeTabs = false,
}) {
  const { zaps, reactions, notes, highlights } = useReactions(
    event,
    kinds,
    opts
  );
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
