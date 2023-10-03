import { atom } from "jotai";
import { NostrEvent, NDKUser } from "@nostr-dev-kit/ndk";
import { atomWithLocalStorage } from "@habla/storage";
import type { Pubkey, Privkey } from "@habla/types";
import { findTags } from "@habla/tags";

export const pubkeyAtom = atom<Pubkey | null | undefined>(undefined);
export const privkeyAtom = atomWithLocalStorage<Privkey | null>("nsec", null);
export const contactListAtom = atomWithLocalStorage<NostrEvent | null>(
  "contactList",
  null
);
export const communitiesAtom = atomWithLocalStorage<NostrEvent | null>(
  "communities",
  null
);
export const relayListAtom = atomWithLocalStorage<NostrEvent | null>(
  "relayList",
  null
);
export const defaultRelays = [
  "wss://relay.snort.social",
  "wss://relay.damus.io",
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

export const peopleListsAtom = atom<Record<string, NostrEvent[]>>({});
export const mutedAtom = atom<NostrEvent | null>(null);
export const mutedWordsAtom = atom<string[]>((get) => {
  const mutedEv = get(mutedAtom);
  return mutedEv ? findTags(mutedEv, "word") : [];
});
