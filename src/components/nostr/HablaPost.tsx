import Address from "@habla/components/nostr/Address";
import { LONG_FORM } from "@habla/const";

export default function HablaPost({ pubkey, slug }) {
  return <Address identifier={slug} kind={LONG_FORM} pubkey={pubkey} />;
}
