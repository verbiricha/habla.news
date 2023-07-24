import { atom } from "jotai";
import { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
import { atomWithLocalStorage } from "@habla/storage";

type Pubkey = string;
type Privkey = string;

export const pubkeyAtom = atomWithLocalStorage<Pubkey | null>("npub", null);
export const privkeyAtom = atomWithLocalStorage<Privkey | null>("nsec", null);
export const contactListAtom = atomWithLocalStorage<NDKEvent | null>(
  "contactList",
  null
);
export const relayListAtom = atomWithLocalStorage<NDKEvent | null>(
  "relayList",
  null
);
export const defaultRelays = [
  "wss://relay.damus.io",
  "wss://purplepag.es",
  "wss://nostr.mom",
  "wss://nos.lol",
  "wss://offchain.pub",
];
export const relaysAtom = atom<string[]>((get) => {
  const relayList = get(relayListAtom);
  if (relayList) {
    return (
      relayList?.tags?.filter((t) => t.at(0) === "r").map((t) => t.at(1)) ??
      defaultRelays
    );
  }
  return defaultRelays;
});
export const followsAtom = atom<string[]>(
  (get) =>
    get(contactListAtom)
      ?.tags.filter((t) => t.at(0) === "p")
      .map((t) => t.at(1)) ?? []
);
export const tagsAtom = atom<string[]>(
  (get) =>
    get(contactListAtom)
      ?.tags.filter((t) => t.at(0) === "t")
      .map((t) => t.at(1)) ?? []
);
export const ndkAtom = atom<NDK | null>(null);
export const bookmarksAtom = atomWithLocalStorage<string[][]>(
  "userBookmarks",
  []
);

export const peopleListsAtom = atom<NDKEvent[]>([]);
