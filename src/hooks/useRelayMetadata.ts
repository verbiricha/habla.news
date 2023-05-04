import { useState, useEffect } from "react";

import { useLiveQuery } from "dexie-react-hooks";
import db from "@habla/cache/db";

import { getRelayMetadata } from "@habla/nip11";
import { normalizeURL } from "@habla/util";

export default function useRelayMetadata(url) {
  const data = useLiveQuery(
    () => db.relayMetadata.get(normalizeURL(url)),
    [url]
  );
  const [isError, setIsError] = useState();

  useEffect(() => {
    getRelayMetadata(url)
      .then(async (meta) => {
        try {
          await db.relayMetadata.put({ id: normalizeURL(url), ...meta });
        } catch (error) {
          setIsError(true);
        }
      })
      .catch(() => setIsError(true));
  }, [url]);

  return { data, isError };
}
