import Dexie from "dexie";

interface RelayEvents {
  url: string;
  ids: string[];
}

const db = new Dexie("habla.news");
db.version(1).stores({
  event:
    "id,kind,pubkey,[kind+pubkey],[kind+pubkey+d],[kind+a],[kind+e],[kind+p]",
  relaySet: "id,urls",
});

export default db;
