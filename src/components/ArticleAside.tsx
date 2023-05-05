import { Box } from "@chakra-ui/react";

import { HIGHLIGHT } from "@habla/const";
import { useEvents } from "@habla/nostr/hooks";
import UserCard from "@habla/components/nostr/UserCard";

export default function ArticleAside({ pubkey, kind, identifier }) {
  const { events } = useEvents(
    {
      kinds: [HIGHLIGHT],
      "#a": [`${kind}:${pubkey}:${identifier}`],
    },
    {
      cacheUsage: "PARALLEL",
      closeOnEose: false,
    }
  );
  return (
    <Box display={["none", "none", "block"]}>
      <UserCard pubkey={pubkey} />
    </Box>
  );
}
