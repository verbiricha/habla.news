import { SimplePool } from "nostr-tools";

const pool = new SimplePool([]);

const handleToPubkey = {
  tony: "7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d",
};

const pubkeyToHandle = {
  "7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d": "tony",
};

export async function getHandles() {
  return Object.keys(handleToPubkey);
}

export async function getPubkey(handle) {
  return handleToPubkey[handle];
}

export async function getHandle(pubkey) {
  return pubkeyToHandle[pubkey];
}

export async function getRelays(pubkey) {
  return ["wss://relay.nostr.band", "wss://nos.lol", "wss://nostr.wine"];
}

export async function getPost(pubkey, slug) {
  const relays = await getRelays(pubkey);
  const filter = {
    kinds: [30023],
    authors: [pubkey],
    "#d": [slug],
  };
  const event = await pool.get(relays, filter);
  return event;
}

export async function getPosts(pubkey) {
  const relays = await getRelays(pubkey);
  const filters = [
    {
      kinds: [30023],
      authors: [pubkey],
    },
  ];
  const events = await pool.list(relays, filters);
  return events;
}

export async function getProfile(pubkey) {
  const relays = await getRelays(pubkey);
  const filter = {
    kinds: [0],
    authors: [pubkey],
  };
  const ev = await pool.get(relays, filter);
  return JSON.parse(ev.content);
}
