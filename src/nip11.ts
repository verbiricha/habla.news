export async function getRelayMetadata(url) {
  try {
    const relayUrl = new URL(url);
    const isSecure = url.startsWith("wss://");
    const relayInfoUrl = `${isSecure ? "https" : "http"}://${relayUrl.host}`;
    return await fetch(relayInfoUrl, {
      headers: {
        Accept: "application/nostr+json",
      },
    }).then((res) => res.json());
  } catch (error) {
    console.error(`Couldn't fetch NIP-11 metadata for ${url}`);
  }
}
