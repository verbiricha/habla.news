import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { LONG_FORM } from "@habla/const";
import db from "@habla/cache/db";
import { pickTopNHashtags } from "@habla/tags";
import useModeration from "@habla/hooks/useModeration";

const TAG_MAX_LENGTH = 32;

export default function useTopTags(n = 10) {
  const { isTagMuted } = useModeration();
  const tags = useLiveQuery(async () => {
    try {
      const evs = await db.event.where("kind").equals(LONG_FORM).toArray();
      return evs
        .map((e) => e.t)
        .flat()
        .filter((t) => t.length <= TAG_MAX_LENGTH);
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  const filteredTags = useMemo(() => {
    return tags?.filter((t) => !isTagMuted(["t", t])) || [];
  }, [tags, isTagMuted]);

  return pickTopNHashtags(filteredTags, n);
}
