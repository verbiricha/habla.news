import Link from "next/link";
import Address from "@habla/components/nostr/Address";

export default function Naddr(props) {
  return <Address {...props} isFeed />;
}
