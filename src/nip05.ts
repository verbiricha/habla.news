import { SimplePool } from "nostr-tools";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";

const pool = new SimplePool([]);

export const names = {
  _: "7d4e04503ab26615dd5f29ec08b52943cbe5f17bacc3012b26220caa232ab14c",
  verbiricha:
    "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
  tony: "7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d",
  moon: "5df413d4c5e5035ff508fd99b38b21ea9a0ac0b9ecc34f3312aba9aa2add4f5b",
  dergigi: "6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93",
  corndalorian:
    "f8e6c64342f1e052480630e27e1016dce35fc3a614e60434fef4aa2503328ca9",
  nostreport:
    "2edbcea694d164629854a52583458fd6d965b161e3c48b57d3aff01940558884",
  everexpanding:
    "c9dccd5fbf13605415deb3ca03e9154cd77000f3fb1d98361e5cda4edce00d9a",
  devstr: "700d3de34b2929478652de1a41738ea4b3589831a76d1adfc612bd6f2529fd22",
  nout: "deba271e547767bd6d8eec75eece5615db317a03b07f459134b03e7236005655",
  sperry: "11d0b66747887ba9a6d34b23eb31287374b45b1a1b161eac54cb183c53e00ef7",
  sikto: "50c59a1cb233d08d5a1fb493f520c6b5d7f77a2ba42e4666801a3e366b0a027e",
};

const pubkeyToHandle = Object.entries(names).reduce((acc, item) => {
  const [k, v] = item;
  return { ...acc, [v]: k };
}, {});

export async function getHandles() {
  return Object.keys(names).filter((h) => h !== "_");
}

export async function getPubkey(handle) {
  return names[handle];
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
      kinds: [LONG_FORM],
      authors: [pubkey],
    },
  ];
  return pool.list(relays, filters);
}

export async function getEvents(pubkey) {
  const relays = await getRelays(pubkey);
  const filters = [
    {
      kinds: [LONG_FORM, HIGHLIGHT],
      authors: [pubkey],
    },
  ];
  return pool.list(relays, filters);
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
