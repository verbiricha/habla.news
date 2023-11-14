import { nip19 } from "nostr-tools";

export function combineLists(lists) {
  const result = [];

  function recursiveHelper(currIndex, tempList) {
    if (currIndex === lists.length) {
      result.push(tempList.slice());
      return;
    }

    for (let i = 0; i < lists[currIndex].length; i++) {
      tempList.push(lists[currIndex][i]);
      recursiveHelper(currIndex + 1, tempList);
      tempList.pop();
    }
  }

  recursiveHelper(0, []);

  return result;
}

export function normalizeURL(url: string): string {
  let p = new URL(url);
  p.pathname = p.pathname.replace(/\/+/g, "/");
  if (p.pathname.endsWith("/")) p.pathname = p.pathname.slice(0, -1);
  if (
    (p.port === "80" && p.protocol === "ws:") ||
    (p.port === "443" && p.protocol === "wss:")
  )
    p.port = "";
  p.searchParams.sort();
  p.hash = "";
  return p.toString();
}

export const uniqByFn = <T>(arr: T[], keyFn: any): T[] => {
  return Object.values(
    arr.reduce((map, item) => {
      const key = keyFn(item);
      if (map[key]) {
        return {
          ...map,
          [key]: map[key].created_at > item.created_at ? map[key] : item,
        };
      }
      return {
        ...map,
        [key]: item,
      };
    }, {})
  );
};

export function toPubkey(p?: string) {
  if (p?.startsWith("npub")) {
    return nip19.decode(p)?.data;
  } else {
    return p;
  }
}

export function parseJSON<T>(raw: string, defaultValue: T) {
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    return defaultValue;
  }
}

export function dedupe<T>(list: T[]): T[] {
  return list.reduce(
    (acc, i) => {
      if (!acc.seen.has(i)) {
        acc.result.push(i);
      }
      acc.seen.add(i);
      return acc;
    },
    { result: [], seen: new Set() }
  ).result;
}
