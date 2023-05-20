import { useMemo } from "react";

import { Flex } from "@chakra-ui/react";

import { ZAP, REACTION, REPOST, NOTE, HIGHLIGHT } from "@habla/const";
import { useReactions } from "@habla/nostr/hooks";
import Highlights from "@habla/components/reactions/Highlights";
import TextReactions from "../Reactions";
import Comments from "../Comments";
import Zaps from "../Zaps";
import Reposts from "../Reposts";

export default function Reactions({
  event,
  kinds = [ZAP, REACTION, REPOST, NOTE, HIGHLIGHT],
  opts = { cacheUsage: "CACHE_ONLY", closeOnEose: true },
}) {
  const { zaps, reactions, reposts, notes, highlights } = useReactions(
    event,
    kinds,
    opts
  );
  return (
    <Flex alignItems="center" gap="6">
      {kinds.includes(ZAP) && <Zaps event={event} zaps={zaps} />}
      {kinds.includes(HIGHLIGHT) && (
        <Highlights event={event} highlights={highlights} />
      )}
      {kinds.includes(REPOST) && <Reposts event={event} reposts={reposts} />}
      {kinds.includes(NOTE) && <Comments event={event} comments={notes} />}
      {kinds.includes(REACTION) && (
        <TextReactions event={event} reactions={reactions} />
      )}
    </Flex>
  );
}
