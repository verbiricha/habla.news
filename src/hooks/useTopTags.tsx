import { useLiveQuery } from "dexie-react-hooks";

import { LONG_FORM } from "@habla/const";
import db from "@habla/cache/db";
import { pickTopNHashtags } from "@habla/tags";

export default function useTopTags(n = 10) {
  const tags = useLiveQuery(async () => {
    try {
      const evs = await db.event.where("kind").equals(LONG_FORM).toArray();
      return evs.map((e) => e.t).flat();
    } catch (error) {
      console.error(error);
      return [];
    }
  });
  return pickTopNHashtags(tags || [], n);
}
