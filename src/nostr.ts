import { useEffect, useState, useMemo } from "react";

import NDK, { NDKEvent, NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { nip05, nip19 } from "nostr-tools";

export function useNdk(options) {
  const ndk = useMemo(() => new NDK(options), []);

  useEffect(() => {
    try {
      ndk.connect();
    } catch (error) {
      console.error(`Failed to connect to relays`);
      console.error(error);
    }
  }, []);

  return ndk;
}

export function decodeNaddr(naddr) {
  try {
    if (!naddr) {
      return;
    }
    const decoded = nip19.decode(naddr);
    if (decoded.type === "naddr") {
      return decoded.data;
    }
  } catch (error) {
    console.error(error);
  }
}

export function decodeNpubOrNprofile(s) {
  try {
    if (!s) {
      return;
    }
    const decoded = nip19.decode(s);
    if (decoded.type === "nprofile") {
      return decoded.data;
    }
    if (decoded.type === "npub") {
      return { pubkey: decoded.data, relays: [] };
    }
  } catch (error) {
    console.error(error);
  }
}

export function decodeNrelay(s) {
  try {
    if (!s) {
      return;
    }
    const decoded = nip19.decode(s);
    if (decoded.type === "nrelay") {
      return decoded.data;
    }
  } catch (error) {
    console.error(error);
  }
}

export function decodeNevent(nevent) {
  try {
    if (!nevent) {
      return;
    }
    const decoded = nip19.decode(nevent);
    if (decoded.type === "nevent") {
      return decoded.data;
    }
  } catch (error) {
    console.error(error);
  }
}
