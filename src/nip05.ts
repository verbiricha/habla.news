import { SimplePool } from "nostr-tools";

const pool = new SimplePool([]);

const handleToPubkey = {
  verbiricha:
    "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
  tony: "7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d",
  moon: "5df413d4c5e5035ff508fd99b38b21ea9a0ac0b9ecc34f3312aba9aa2add4f5b",
};

const pubkeyToHandle = Object.entries(handleToPubkey).reduce((acc, item) => {
  const [k, v] = item;
  return { ...acc, [v]: k };
}, {});

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
  return ["wss://nostr.wine/", "wss://nos.lol/", "wss://relay.damus.io/"];
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
