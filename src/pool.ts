import { SimplePool } from "nostr-tools";

export const defaultRelays = ["wss://nos.lol", "wss://nostr.wine"];

const pool = new SimplePool();

export default pool;
