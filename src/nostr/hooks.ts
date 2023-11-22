import { useMemo, useEffect, useState, useContext } from "react";
import { useAtom } from "jotai";
import { useToast } from "@chakra-ui/react";

import {
  NDKEvent,
  NDKRelay,
  NDKRelaySet,
  NDKSubscriptionCacheUsage,
} from "@nostr-dev-kit/ndk";
import { useLiveQuery } from "dexie-react-hooks";
import { utils } from "nostr-tools";

import {
  PROFILE,
  ZAP,
  HIGHLIGHT,
  REACTION,
  REPOST,
  LONG_FORM,
  NOTE,
  BOOKMARKS,
  GENERAL_BOOKMARKS,
} from "@habla/const";
import { relaysAtom } from "@habla/state";
import { uniqByFn } from "@habla/util";
import db from "@habla/cache/dexie";
import { sha256 } from "@noble/hashes/sha256";

import NostrContext from "./provider";

interface MyObject {
  [key: string]: any;
}

export function hash(obj: MyObject): string {
  const jsonString = JSON.stringify(obj);

  const hashBuffer = sha256(new TextEncoder().encode(jsonString));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

const defaultOpts = {
  closeOnEose: true,
};

export function useEvents(filter, options = {}) {
  const { ndk } = useContext(NostrContext);
  const [defaultRelays] = useAtom(relaysAtom);
  const [eose, setEose] = useState(false);
  const [events, setEvents] = useState([]);
  const { relays, ...rest } = options;
  const id = useMemo(() => {
    return hash(filter);
  }, [filter]);

  let opts = { ...defaultOpts, ...rest };
  let relaySet;
  if (relays?.length > 0) {
    relaySet = NDKRelaySet.fromRelayUrls(relays, ndk);
  }

  useEffect(() => {
    if (filter && !options.disable) {
      const sub = ndk.subscribe(filter, opts, relaySet);

      sub.on("event", (ev, relay) => {
        setEvents((evs) =>
          uniqByFn(utils.insertEventIntoDescendingList(evs, ev), (e) =>
            e.tagId()
          )
        );
      });

      sub.on("eose", () => {
        setEose(true);
      });

      return () => {
        sub.stop();
      };
    }
  }, [id, options?.disable]);

  return { id, eose, events, opts };
}

export function useEvent(filter, options = {}) {
  const { ndk } = useContext(NostrContext);
  const [event, setEvent] = useState();

  const { relays, ...rest } = options;

  let opts = { ...defaultOpts, ...rest };
  let relaySet;
  if (relays?.length > 0) {
    relaySet = NDKRelaySet.fromRelayUrls(relays, ndk);
  }

  useEffect(() => {
    ndk.fetchEvent(filter, opts, relaySet).then(setEvent);
  }, []);

  return event;
}

export function useUser(pubkey) {
  const { ndk } = useContext(NostrContext);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fn = async () => {
      try {
        const cached = await db.fetchProfile(pubkey);
        if (cached) {
          setProfile(cached);
          return;
        }
      } catch (error) {
        console.error("Cache miss");
      }
      const user = ndk.getUser({ hexpubkey: pubkey });
      const fetched = await user.fetchProfile({
        cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
      });
      setProfile(fetched);
    };

    fn();
  }, [pubkey]);

  return profile;
}

export function useUsers(pubkeys) {
  const { ndk } = useContext(NostrContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (pubkeys) {
      ndk
        .fetchEvents(
          {
            kinds: [PROFILE],
            authors: pubkeys,
          },
          {
            cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
          }
        )
        .then((profiles) => {
          setEvents([...profiles].map((p) => JSON.parse(p.content)));
        });
    }
  }, [pubkeys]);

  return events;
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
    {
      cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
      closeOnEose: true,
      ...opts,
    }
  );

  const zaps = events.filter((e) => e.kind === ZAP);
  const highlights = events.filter((e) => e.kind === HIGHLIGHT);
  const reactions = events.filter((e) => e.kind === REACTION);
  const reposts = events.filter((e) => e.kind === REPOST);
  const notes = events.filter((e) => e.kind === NOTE);
  const bookmarks = events.filter(
    (e) => e.kind === BOOKMARKS || e.kind === GENERAL_BOOKMARKS
  );

  return { zaps, reactions, highlights, reposts, notes, bookmarks };
}

export function useNdk() {
  const { ndk } = useContext(NostrContext);
  return ndk;
}

export function usePublishEvent(options) {
  const { showToast, debug } = options ?? { showToast: true, debug: false };
  const [relays] = useAtom(relaysAtom);
  const ndk = useNdk();
  const toast = useToast();

  return async (
    ev,
    {
      successTitle = "Success",
      sucessMessage = "Posted",
      errorTitle = "Error",
      errorMessage = "Couldn't sign event, please log in first",
    }
  ) => {
    try {
      const ndkEvent = new NDKEvent(ndk, ev);
      await ndkEvent.sign();
      if (debug) {
        console.debug(ndkEvent);
      } else {
        await ndk.publish(ndkEvent);
      }
      if (showToast) {
        toast({
          title: successTitle,
          description: sucessMessage,
          status: "success",
        });
      }
      return ndkEvent;
    } catch (error) {
      console.error(error);
      if (showToast) {
        toast({
          title: errorTitle,
          description: errorMessage,
          status: "error",
        });
      }
    }
  };
}
