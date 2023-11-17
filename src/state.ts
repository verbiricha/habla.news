import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { NostrEvent } from "@nostr-dev-kit/ndk";

import type { Session, Pubkey, Privkey, Tags } from "@habla/types";
import { findTags } from "@habla/tags";

// Login
export const sessionAtom = atomWithStorage<Session | null>("session", null);
export const pubkeyAtom = atom<Pubkey | undefined>((get) => {
  const session = get(sessionAtom);
  return session?.pubkey;
});
// deprecated
export const privkeyAtom = atomWithStorage<Privkey | null>("nsec", null);

// Relays
export const relayListAtom = atomWithStorage<NostrEvent | null>(
  "relayList",
  null
);
export const defaultRelays = [
  "wss://relay.snort.social",
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://nostr.wine",
  "wss://offchain.pub",
];
export const relaysAtom = atom<string[]>((get) => {
  const relayListEv = get(relayListAtom);
  return relayListEv ? findTags(relayListEv, "r") : defaultRelays;
});

// Contacts
export const contactListAtom = atomWithStorage<NostrEvent | null>(
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
export const bookmarksAtom = atom<NostrEvent | null>(null);
export const bookmarkListsAtom = atom<Record<string, NostrEvent[]>>({});
export const mutedAtom = atom<NostrEvent | null>(null);
export const privateMutedAtom = atom<Tags>([]);

// Communities
export const communitiesAtom = atom<NostrEvent | null>(null);
