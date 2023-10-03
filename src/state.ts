import { atom } from "jotai";
import { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
import { atomWithLocalStorage } from "@habla/storage";
import type { Pubkey, Privkey } from "@habla/types";
import { findTags } from "@habla/tags";

export const pubkeyAtom = atom<Pubkey | null | undefined>(undefined);
export const privkeyAtom = atomWithLocalStorage<Privkey | null>("nsec", null);
export const contactListAtom = atomWithLocalStorage<NDKEvent | null>(
  "contactList",
  null
);
export const communitiesAtom = atomWithLocalStorage<NDKEvent | null>(
  "communities",
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
  const relayListEv = get(relayListAtom);
  return relayListEv ? findTags(relayListEv, "r") : defaultRelays;
});
export const followsAtom = atom<Pubkey[]>((get) => {
  const contactsEv = get(contactListAtom);
  return contactsEv ? findTags(contactsEv, "p") : [];
});
export const tagsAtom = atom<string[]>((get) => {
  const contactsEv = get(contactListAtom);
  return contactsEv ? findTags(contactsEv, "t") : [];
});

export const peopleListsAtom = atom<Record<string, NDKEvent[]>>({});
export const mutedAtom = atom<NDKEvent | null>(null);
export const mutedWordsAtom = atom<string[]>((get) => {
  const mutedEv = get(mutedAtom);
  return mutedEv ? findTags(mutedEv, "word") : [];
});
