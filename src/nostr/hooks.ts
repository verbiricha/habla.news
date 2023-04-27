import { useMemo, useEffect, useState, useContext } from "react";
import { atom, useAtom } from "jotai";

import { NDKRelay, NDKRelaySet } from "@nostr-dev-kit/ndk";
import { useLiveQuery } from "dexie-react-hooks";
import { utils } from "nostr-tools";

import { ZAP, HIGHLIGHT, REACTION, LONG_FORM, NOTE } from "@habla/const";
import db from "@habla/cache/db";
import { relaysAtom } from "@habla/state";

import NostrContext from "./provider";

const defaultOpts = {
  closeOnEose: true,
  cacheUsage: "CACHE_FIRST",
};

const uniqByFn = <T>(arr: T[], keyFn: any): T[] => {
  return Object.values(
    arr.reduce((map, item) => {
      const key = keyFn(item);
      if (map[key]) {
        return {
          ...map,
          [key]: map[key].created_at > item.created_at ? map[key] : item,
        };
      }
      return {
        ...map,
        [key]: item,
      };
    }, {})
  );
};

async function updateIdUrls(id, url) {
  const existingUrl = await db.relaySet.get({ id });

  if (existingUrl) {
    if (existingUrl.urls.includes(url)) {
      return;
    }
    const updatedUrls = [...existingUrl.urls, url];
    await db.relaySet.put({ id, urls: updatedUrls });
  } else {
    await db.relaySet.put({ id, urls: [url] });
  }
}

export function useEvents(filter, options = {}) {
  const [defaultRelays] = useAtom(relaysAtom);
  const { ndk } = useContext(NostrContext);
  const [events, setEvents] = useState([]);
  const { relays, ...rest } = options;

  let opts = { ...defaultOpts, ...rest };
  if (relays?.length > 0) {
    const ndkRelays = new Set(relays.map((url) => new NDKRelay(url)));
    const relaySet = new NDKRelaySet(ndkRelays, ndk);
    opts = { ...opts, relaySet };
  } else {
    const ndkRelays = new Set(defaultRelays.map((url) => new NDKRelay(url)));
    const relaySet = new NDKRelaySet(ndkRelays, ndk);
    opts = { ...opts, relaySet };
  }

  useEffect(() => {
    if (filter) {
      const sub = ndk.subscribe(filter, opts);

      sub.on("event", (ev, relay) => {
        setEvents((evs) =>
          uniqByFn(utils.insertEventIntoDescendingList(evs, ev), (e) =>
            e.tagId()
          )
        );
        if (relay) {
          updateIdUrls(ev.id, relay.url);
        }
      });

      sub.on("event:dup", (ev, relay) => {
        if (relay) {
          updateIdUrls(ev.id, relay.url);
        }
      });

      return () => {
        sub.stop();
      };
    }
  }, []);

  return { events, opts };
}

export function useEvent(filter, opts = defaultOpts) {
  const { ndk } = useContext(NostrContext);
  const { relays, ...rest } = opts;
  const [event, setEvent] = useState();
  let options = { ...rest };

  if (relays?.length > 0) {
    const ndkRelays = new Set(relays.map((url) => new NDKRelay(url)));
    const relaySet = new NDKRelaySet(ndkRelays, ndk);
    options = { ...options, relaySet };
  }

  useEffect(() => {
    ndk.fetchEvent(filter, options).then(setEvent);
  }, []);

  return event;
}

const profileCache = atom({});

export function useUser(pubkey) {
  const { ndk } = useContext(NostrContext);
  const [profiles, setProfiles] = useAtom(profileCache);

  useEffect(() => {
    if (!profiles[pubkey]) {
      const u = ndk.getUser({ hexpubkey: pubkey });
      u.fetchProfile().then(() => {
        setProfiles((pr) => {
          return { ...pr, [pubkey]: u.profile };
        });
      });
    }
  }, [pubkey]);

  const user = useMemo(() => profiles[pubkey], [profiles, pubkey]);

  return user;
}

function eventToFilter(ev: NDKEvent) {
  const [t, v] = ev.tagReference();
  return { [`#${t}`]: [v] };
}

export function useReactions(
  event: NDKEvent,
  kinds = [ZAP, HIGHLIGHT, NOTE, REACTION]
) {
  const { events } = useEvents(
    { ...eventToFilter(event), kinds },
    { closeOnEose: false }
  );

  const zaps = events.filter((e) => e.kind === ZAP);
  const highlights = events.filter((e) => e.kind === HIGHLIGHT);
  const reactions = events.filter((e) => e.kind === REACTION);
  const notes = events.filter((e) => e.kind === NOTE);

  return { zaps, reactions, highlights, notes };
}
