export type Pubkey = string;
export type Privkey = string;

export type LoginMethod = "nip7" | "nip46" | "pubkey" | "privkey";
export interface Session {
  method: LoginMethod;
  pubkey: Pubkey;
  privkey?: Privkey;
  bunker?: {
    privkey: Privkey;
    relays: string[];
  };
}

export type Tag = string[];
export type Tags = Tag[];
