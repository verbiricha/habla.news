import { Code } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import { LONG_FORM } from "@habla/const";
import db from "@habla/cache/db";

export default function Tags() {
  const tags = useLiveQuery(async () => {
    try {
      const evs = await db.event.where("kind").equals(LONG_FORM).toArray();
      return evs.map((e) => e.t).flat();
    } catch (error) {
      console.error(error);
      return [];
    }
  });
  return <Code>{JSON.stringify(tags, null, 2)}</Code>;
}
