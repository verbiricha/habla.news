import { useMemo, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { ZAP, REACTION, NOTE } from "@habla/const";
import db from "@habla/cache/db";
import { getZapAmount } from "@habla/nip57";
import { combineLists } from "@habla/util";
import Highlight from "@habla/components/nostr/feed/Highlight";

export default function Highlights({ highlights, ...rest }) {
  const highlightedIds = highlights.map((z) => z.id);
  const highlightReactions = useLiveQuery(
    () => {
      const filter = combineLists([[ZAP, REACTION, NOTE], highlightedIds]);
      return db.event.where("[kind+e]").anyOf(filter).toArray();
    },
    [highlightedIds],
    []
  );
  const scoreReactions = useCallback(
    (e) => {
      const result = highlightReactions.filter((h) =>
        h.tags.some((t) => t[0] === "e" && t[1] === e.id)
      );
      const score = result.reduce((acc, r) => {
        if (r.kind === ZAP) {
          return acc + getZapAmount(r);
        }
        if (r.kind === REACTION) {
          return acc + 1;
        }
        return acc + 2;
      }, 0);
      return score;
    },
    [highlightReactions]
  );

  const sorted = useMemo(() => {
    const s = [...highlights];
    s.sort((a, b) => scoreReactions(b) - scoreReactions(a));
    return s;
  }, [highlights, highlightReactions]);

  return (
    <>
      {sorted.map((event) => (
        <Highlight key={event.id} event={event} {...rest} />
      ))}
    </>
  );
}
