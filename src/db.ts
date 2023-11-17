// todo: migrate to NDK
import { SimplePool } from "nostr-tools";
import {
  LONG_FORM,
  HIGHLIGHT,
  SUPPORT,
  BOOKMARKS,
  GENERAL_BOOKMARKS,
} from "@habla/const";
import { uniqByFn } from "@habla/util";
import { findTag } from "@habla/tags";

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

const relays = [
  "wss://purplepag.es",
  "wss://relay.snort.social",
  "wss://relay.damus.io/",
  "wss://nostr.wine/",
  "wss://nos.lol/",
  "wss://soloco.nl/",
];
const pool = new SimplePool(relays);

async function getNostrPost(pubkey, slug) {
  const filter = {
    kinds: [LONG_FORM],
    authors: [pubkey],
    "#d": [slug],
  };
  const event = await pool.get(relays, filter);
  return event;
}

export const getPost = memoize(getNostrPost);

async function getNostrPosts(pubkey) {
  const filters = [
    {
      kinds: [LONG_FORM],
      authors: [pubkey],
    },
  ];
  const results = await pool.list(relays, filters);
  return uniqByFn(results, getAddress);
}

export const getPosts = memoize(getNostrPosts);

async function getNostrEvents(pubkey) {
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
  const results = await pool.list(relays, filters);
  return uniqByFn(results, getAddress);
}

export const getEvents = memoize(getNostrEvents);

async function getNostrProfile(pubkey) {
  const filter = {
    kinds: [0],
    authors: [pubkey],
  };
  const ev = await pool.get(relays, filter);
  return JSON.parse(ev.content);
}

export const getProfile = memoize(getNostrProfile);
