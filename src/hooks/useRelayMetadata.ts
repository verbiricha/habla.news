import { useState, useEffect } from "react";

import { useLiveQuery } from "dexie-react-hooks";
import db from "@habla/cache/db";

import { getRelayMetadata } from "@habla/nip11";
import { normalizeURL } from "@habla/util";

export function useRelaysMetadata(urls) {
  const data = useLiveQuery(() => {
    return db.relayMetadata
      .where("id")
      .anyOf(urls.map((url) => normalizeURL(url)))
      .toArray();
  }, [urls]);
  const [isError, setIsError] = useState();

  useEffect(() => {
    urls.map((url) => {
      getRelayMetadata(normalizeURL(url))
        .then((meta) => {
          db.relayMetadata.put({ id: normalizeURL(url), ...meta });
        })
        .catch((e) => console.error(e));
    });
  }, [urls]);

  return { data, isError };
}

export default function useRelayMetadata(url) {
  const data = useLiveQuery(
    () => db.relayMetadata.get(normalizeURL(url)),
    [url]
  );
  const [isError, setIsError] = useState();

  useEffect(() => {
    getRelayMetadata(normalizeURL(url))
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
