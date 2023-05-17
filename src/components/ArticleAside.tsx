import { Stack } from "@chakra-ui/react";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import UserCard from "@habla/components/nostr/UserCard";

export default function ArticleAside({ pubkey }) {
  return <UserCard pubkey={pubkey} />;
}
