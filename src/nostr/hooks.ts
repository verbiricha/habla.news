import { useMemo, useEffect, useState, useContext } from "react";
import { useAtom } from "jotai";

import { NDKRelay, NDKRelaySet } from "@nostr-dev-kit/ndk";
import { useLiveQuery } from "dexie-react-hooks";
import { utils } from "nostr-tools";

import {
  ZAP,
  HIGHLIGHT,
  REACTION,
  REPOST,
  LONG_FORM,
  NOTE,
} from "@habla/const";
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
  return db.transaction("rw", db.relaySet, async () => {
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
  });
}

export function useEvents(filter, options = {}) {
  const { ndk } = useContext(NostrContext);
  const [defaultRelays] = useAtom(relaysAtom);
  const [eose, setEose] = useState(false);
  const [events, setEvents] = useState([]);
  const { relays, ...rest } = options;

  let opts = { ...defaultOpts, ...rest };
  let relaySet;
  if (relays?.length > 0) {
    relaySet = NDKRelaySet.fromRelayUrls(relays, ndk);
  } else if (defaultRelays) {
    relaySet = NDKRelaySet.fromRelayUrls(defaultRelays, ndk);
  }

  useEffect(() => {
    if (filter) {
      const sub = ndk.subscribe(filter, opts, relaySet);

      sub.on("event", (ev, relay) => {
        setEvents((evs) =>
          uniqByFn(utils.insertEventIntoDescendingList(evs, ev), (e) =>
            e.tagId()
          )
        );
        if (relay && ev.kind === LONG_FORM) {
          updateIdUrls(ev.tagId(), normalizeURL(relay.url));
        }
      });

      sub.on("event:dup", (ev, relay) => {
        if (relay && ev.kind === LONG_FORM) {
          updateIdUrls(ev.tagId(), normalizeURL(relay.url));
        }
      });

      sub.on("eose", () => {
        setEose(true);
      });

      return () => {
        sub.stop();
      };
    }
  }, []);

  return { eose, events, opts };
}

export function useEvent(filter, opts = defaultOpts) {
  const [defaultRelays] = useAtom(relaysAtom);
  const { ndk } = useContext(NostrContext);
  const { relays, ...rest } = opts;
  const [event, setEvent] = useState();
  let options = { ...rest };
  // todo: use relays

  useEffect(() => {
    ndk.fetchEvent(filter, options).then(setEvent);
  }, []);

  return event;
}

export function useUser(pubkey) {
  const { ndk } = useContext(NostrContext);
  const user = useLiveQuery(async () => {
    try {
      return await db.profile.get(pubkey);
    } catch (error) {
      return {};
    }
  }, [pubkey]);

  useEffect(() => {
    if (pubkey) {
      ndk.fetchEvent(
        {
          kinds: [0],
          authors: [pubkey],
        },
        {
          cacheUsage: "CACHE_FIRST",
        }
      );
    }
  }, [pubkey]);

  return user ?? {};
}

function eventToFilter(ev: NDKEvent) {
  const [t, v] = ev.tagReference();
  return { [`#${t}`]: [v] };
}

export function useReactions(
  event: NDKEvent,
  kinds = [ZAP, HIGHLIGHT, REPOST, NOTE],
  opts = {}
) {
  const { events } = useEvents(
    { ...eventToFilter(event), kinds },
    { cacheUsage: "CACHE_FIRST", closeOnEose: true, ...opts }
  );

  const zaps = events.filter((e) => e.kind === ZAP);
  const highlights = events.filter((e) => e.kind === HIGHLIGHT);
  const reactions = events.filter((e) => e.kind === REACTION);
  const reposts = events.filter((e) => e.kind === REPOST);
  const notes = events.filter((e) => e.kind === NOTE);

  return { zaps, reactions, highlights, reposts, notes };
}

export function useNdk() {
  const { ndk } = useContext(NostrContext);
  return ndk;
}
