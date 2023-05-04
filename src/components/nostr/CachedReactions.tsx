import { Flex } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import { combineLists } from "@habla/util";
import { ZAP, REACTION, NOTE, HIGHLIGHT } from "@habla/const";
import db from "@habla/cache/db";

import Zaps from "../Zaps";
import TextReactions from "../Reactions";
import Highlights from "@habla/components/reactions/Highlights";
import Comments from "../Comments";

export default function Reactions({
  event,
  kinds = [ZAP, REACTION, NOTE, HIGHLIGHT],
  opts = { cacheUsage: "CACHE_ONLY", closeOnEose: true },
}) {
  const reactionEvents = useLiveQuery(
    async () => {
      const [t, v] = event.tagReference();
      const filter = combineLists([kinds, [v]]);
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
    </>
  );
}
