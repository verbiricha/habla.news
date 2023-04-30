import { atom } from "jotai";
import { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";

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

export const userAtom = atom<NDKUser | null>(null);
export const pubkeyAtom = atomWithLocalStorage<Pubkey | null>("pubkey", null);
export const followsAtom = atom<Set<NDKUser>>(new Set([]));
export const relaysAtom = atomWithLocalStorage<string[]>("relays", [
  "wss://purplepag.es",
  "wss://nos.lol",
  "wss://nostr-relay.nokotaro.com",
  "wss://offchain.pub",
  "wss://relay.damus.io",
  "wss://nostr.wine",
]);
