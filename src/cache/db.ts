import Dexie, { type Table } from "dexie";

interface RelayMetadata {
  id: string;
  name: string;
  description?: string;
  pubkey?: string;
  contact?: string;
  supported_nips: string[];
  software?: string;
  version?: string;
}

export class HablaDatabase extends Dexie {
  relayMetadata!: Table<RelayMetadata>;

  constructor() {
    super("habla.news");
    this.version(3).stores({
      relayMetadata:
        "id,name,description,pubkey,contact,supported_nips,software,version",
    });
  }
}

export default new HablaDatabase();
