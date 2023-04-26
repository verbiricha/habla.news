import { SimplePool } from "nostr-tools";

export const defaultRelays = [
  "wss://purplepag.es",
  "wss://nos.lol",
  "wss://relay.damus.io",
  "wss://nostr.wine",
];

const pool = new SimplePool({ getTimeout: 300 });

export default pool;
