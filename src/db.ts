import NDK from "@nostr-dev-kit/ndk";
import {
  LONG_FORM,
  HIGHLIGHT,
  SUPPORT,
  BOOKMARKS,
  GENERAL_BOOKMARKS,
} from "@habla/const";
import { uniqByFn } from "@habla/util";
import { findTag } from "@habla/tags";

const relays = [
  "wss://relay.snort.social",
  "wss://relay.damus.io/",
  "wss://nostr.wine/",
  "wss://nos.lol/",
  "wss://soloco.nl/",
];

const ndk = new NDK({
  explicitRelayUrls: relays,
  outboxRelayUrls: ["wss://purplepag.es", "wss://profiles.nos.social"],
  enableOutboxModel: true,
});
const conn = ndk.connect();

const getAddress = (ev) => {
  if (ev.kind && ev.kind >= 30000 && ev.kind <= 40000) {
    const dTagId = findTag(ev, "d");
    return `${ev.kind}:${ev.pubkey}:${dTagId}`;
  }
  return ev.id;
};

const memoize = (fn) => {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    cache.set(
      key,
      fn(...args).catch((error) => {
        // Delete cache entry if API call fails
        cache.delete(key);
        return Promise.reject(error);
      })
    );

    return cache.get(key);
  };
};

async function getNostrPost(pubkey, slug) {
  await conn;
  const event = await ndk.fetchEvent({
    kinds: [LONG_FORM],
    authors: [pubkey],
    "#d": [slug],
  });
  return event?.rawEvent();
}

export const getPost = memoize(getNostrPost);

async function getNostrPosts(pubkey) {
  await conn;
  const results = await ndk.fetchEvents({
    kinds: [LONG_FORM],
    authors: [pubkey],
  });
  return uniqByFn(
    Array.from(results).map((e) => e.rawEvent()),
    getAddress
  );
}

export const getPosts = memoize(getNostrPosts);

async function getNostrEvents(pubkey) {
  await conn;
  const filters = [
    {
      kinds: [LONG_FORM, HIGHLIGHT, SUPPORT, BOOKMARKS, GENERAL_BOOKMARKS],
      authors: [pubkey],
    },
    {
      kinds: [SUPPORT],
      "#p": [pubkey],
    },
  ];
  const results = await ndk.fetchEvents(filters);
  return uniqByFn(
    Array.from(results).map((e) => e.rawEvent()),
    getAddress
  );
}

export const getEvents = memoize(getNostrEvents);

async function getNostrProfile(pubkey) {
  try {
    await conn;
    const user = ndk.getUser({ pubkey });
    return user.fetchProfile();
  } catch (err) {
    console.error(err);
  }
}

export const getProfile = memoize(getNostrProfile);
