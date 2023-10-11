export type Pubkey = string;
export type Privkey = string;

export type LoginMethod = "nip7" | "pubkey" | "privkey";
export interface Session {
  method: LoginMethod;
  pubkey: Pubkey;
  privkey?: Privkey;
}

export type Tag = string[];
export type Tags = Tag[];
