import { useMemo } from "react";

import { Flex } from "@chakra-ui/react";
import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import { useReactions } from "@habla/nostr/hooks";
import Highlights from "@habla/components/reactions/Highlights";
import TextReactions from "../Reactions";
import Comments from "../Comments";
import Bookmarks from "@habla/components/Bookmarks";
import Zaps from "../Zaps";
import Reposts from "../Reposts";
import {
  ZAP,
  REACTION,
  REPOST,
  NOTE,
  HIGHLIGHT,
  BOOKMARKS,
  GENERAL_BOOKMARKS,
} from "@habla/const";

export default function Reactions({
  event,
  kinds = [
    ZAP,
    REACTION,
    REPOST,
    NOTE,
    HIGHLIGHT,
    BOOKMARKS,
    GENERAL_BOOKMARKS,
  ],
  opts = {
    cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    closeOnEose: false,
  },
}) {
  const { zaps, reactions, reposts, notes, highlights, bookmarks } =
    useReactions(event, kinds, opts);
  return (
    <Flex alignItems="center" gap="6">
      {kinds.includes(ZAP) && <Zaps event={event} zaps={zaps} />}
      {kinds.includes(REPOST) && <Reposts event={event} reposts={reposts} />}
      {kinds.includes(HIGHLIGHT) && (
        <Highlights event={event} highlights={highlights} />
      )}
      {kinds.includes(NOTE) && <Comments event={event} comments={notes} />}
      {kinds.includes(REACTION) && (
        <TextReactions event={event} reactions={reactions} />
      )}
      {(kinds.includes(BOOKMARKS) || kinds.includes(GENERAL_BOOKMARKS)) && (
        <Bookmarks event={event} bookmarks={bookmarks} />
      )}
    </Flex>
  );
}
