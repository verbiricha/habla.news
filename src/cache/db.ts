import Dexie, { type Table } from "dexie";

interface Event {}

export class HablaDatabase extends Dexie {
  constructor() {
    super("h");
    this.version(1).stores({
      event:
        "id,created_at,kind,pubkey,[kind+pubkey],[kind+pubkey+d],[kind+a],[kind+e],[kind+p]",
      relaySet: "id,urls",
      profile: "id,name,display_name,about,picture,nip05,lud16,banner",
    });
  }
}

export default new HablaDatabase();
