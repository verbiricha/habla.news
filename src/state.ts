import { atom } from "jotai";
import { NostrEvent } from "@nostr-dev-kit/ndk";

import { atomWithLocalStorage } from "@habla/storage";
import type { Session, Pubkey, Privkey, Tags } from "@habla/types";
import { findTags } from "@habla/tags";

// Login
export const sessionAtom = atomWithLocalStorage<Session | null>(
  "session",
  null
);
export const pubkeyAtom = atom<Pubkey | undefined>((get) => {
  const session = get(sessionAtom);
  return session?.pubkey;
});
// deprecated
export const privkeyAtom = atomWithLocalStorage<Privkey | null>("nsec", null);

// Relays
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

// Contacts
export const contactListAtom = atomWithLocalStorage<NostrEvent | null>(
  "contactList",
  null
);
export const followsAtom = atom<Pubkey[]>((get) => {
  const contactsEv = get(contactListAtom);
  return contactsEv ? findTags(contactsEv, "p") : [];
});
export const tagsAtom = atom<string[]>((get) => {
  const contactsEv = get(contactListAtom);
  return contactsEv ? findTags(contactsEv, "t") : [];
});

// NIP-51
export const peopleListsAtom = atom<Record<string, NostrEvent[]>>({});
export const mutedAtom = atom<NostrEvent | null>(null);
export const privateMutedAtom = atom<Tags>([]);
export const couldDecryptMutedAtom = atom<boolean>(false);

// Communities
export const communitiesAtom = atomWithLocalStorage<NostrEvent | null>(
  "communities",
  null
);
