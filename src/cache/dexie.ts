import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";

export default new NDKCacheAdapterDexie({
  dbName: "nostr",
  expirationTime: 3600 * 24 * 7,
  profileCacheSize: 200,
});
