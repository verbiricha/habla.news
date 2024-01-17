import { nip19 } from "nostr-tools";
import { getHandle } from "@habla/nip05";
import { LONG_FORM } from "@habla/const";

export function articleURL(
  identifier: string,
  pubkey: string,
  profile?: Record<string, string>,
  isVerified?: boolean
): string {
  const handle = getHandle(pubkey);

  if (handle && !identifier.includes("/")) {
    return `/${handle}/${identifier}`;
  }

  if (profile && profile.nip05 && !identifier.includes("/") && isVerified) {
    const nip05handle = profile.nip05.replace(/^_@/, "");
    return `/u/${nip05handle}/${identifier}`;
  }

  const naddr = nip19.naddrEncode({
    kind: LONG_FORM,
    pubkey,
    identifier,
  });

  return `/a/${naddr}`;
}

export function profileURL(pubkey: string): string {
  const handle = getHandle(pubkey);
  if (handle) {
    return `/${handle}`;
  }
  return `/p/${nip19.npubEncode(pubkey)}`;
}
