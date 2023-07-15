import { atom } from "jotai";
import { NDKEvent, NDKUser } from "habla-ndk";

type Pubkey = string;

function atomWithLocalStorage<T>(key: string, initialValue: T) {
  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
      return initialValue;
    }
  };
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
      }
    }
  );
  return derivedAtom;
}

export const pubkeyAtom = atomWithLocalStorage<Pubkey | null>(
  "userPubkey",
  null
);
export const followsAtom = atom<string[]>([]);
export const relaysAtom = atomWithLocalStorage<string[]>("userRelays", [
  "wss://purplepag.es",
  "wss://nos.lol",
  "wss://nostr-relay.nokotaro.com",
  "wss://offchain.pub",
  "wss://relay.damus.io",
  "wss://nostr.wine",
]);
export const bookmarksAtom = atomWithLocalStorage<string[][]>(
  "userBookmarks",
  []
);

export const peopleListsAtom = atom<NDKEvent[]>([]);
