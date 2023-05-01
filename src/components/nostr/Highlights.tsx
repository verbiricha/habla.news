import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { ZAP, NOTE } from "@habla/const";
import db from "@habla/cache/db";
import { getZapAmount } from "@habla/nip57";
import { combineLists } from "@habla/util";
import Highlight from "@habla/components/nostr/feed/Highlight";

export default function Highlights({ highlights, ...rest }) {
  const highlightedIds = highlights.map((z) => z.id);
  const highlightReactions = useLiveQuery(
    () => {
      const filter = combineLists([[ZAP, NOTE], highlightedIds]);
      return db.event.where("[kind+e]").anyOf(filter).toArray();
    },
    [highlightedIds],
    []
  );
  const scoreReactions = (e) => {
    const result = highlightReactions.filter((h) =>
      h.tags.some((t) => t[0] === "e" && t[1] === e)
    );
    return result.reduce(
      (acc, r) => (r.kind === ZAP ? getZapAmount(r) + acc : acc + 1),
      0
    );
  };
  const sorted = useMemo(() => {
    const s = [...highlights];
    s.sort((a, b) => scoreReactions(b.id) - scoreReactions(a.id));
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
