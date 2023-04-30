import { SimplePool } from "nostr-tools";

export const defaultRelays = [
  "wss://purplepag.es",
  "wss://nostr-relay.nokotaro.com",
  "wss://nos.lol",
  "wss://offchain.pub",
  "wss://relay.damus.io",
  "wss://nostr.wine",
];

const pool = new SimplePool({ getTimeout: 2000 });

export default pool;
