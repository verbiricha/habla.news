export function urlsToNip27(content: string) {
  // Replaces any website URL if they contain any NOSTR identifier (NIP-19) with a NOSTR text note reference (NIP-27)
  // Reference:
  //  * NIP-27 text note references: https://github.com/nostr-protocol/nips/blob/master/27.md
  //  * NIP-19 identifiers: https://github.com/nostr-protocol/nips/blob/master/19.md
  //  * NIP-19 identifiers size table: https://gist.github.com/LouisSaberhagen/f31c0f7869ab4b5c1844aff59873ef41

  const urlPattern = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/gi;

  const nPubPattern = /npub[0-9a-zA-Z]{32,}/g; // npub + 32 bytes
  const notePattern = /note[0-9a-zA-Z]{32,}/g; // note + 32 bytes
  const nProfilePattern = /nprofile[0-9a-zA-Z]{32,}/g; // nprofile + 34 bytes
  const nEventPattern = /nevent[0-9a-zA-Z]{32,}/g; // nevent + 34 bytes
  const nRelayPattern = /nrelay[0-9a-zA-Z]{3,}/g; // nrelay + 3 bytes
  const nAddrPattern = /naddr[0-9a-zA-Z]{42,}/g; // naddr + 42 bytes

  return content.replace(urlPattern, (url) => {
    const match =
      url.match(nPubPattern) ??
      url.match(notePattern) ??
      url.match(nProfilePattern) ??
      url.match(nEventPattern) ??
      url.match(nRelayPattern) ??
      url.match(nAddrPattern);
    if (match) {
      return "nostr:" + match[0];
    } else {
      return url;
    }
  });
}
