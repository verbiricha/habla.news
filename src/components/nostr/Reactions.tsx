import { useMemo } from "react";

import { Flex } from "@chakra-ui/react";

import { ZAP, REACTION, HIGHLIGHT } from "@habla/const";
import { useReactions } from "@habla/nostr/hooks";
import Zaps from "../Zaps";
import TextReactions from "../Reactions";
import Comments from "../Reactions";
import Highlights from "../Highlights";

export default function Reactions({
  event,
  opts = { closeOnEose: false },
  kinds = [ZAP, REACTION, HIGHLIGHT],
}) {
  const { zaps, reactions, highlights } = useReactions(event, kinds);
  // TODO: threads
  return (
    <Flex alignItems="center" gap="6">
      {kinds.includes(ZAP) && <Zaps event={event} zaps={zaps} />}
      {kinds.includes(HIGHLIGHT) && (
        <Highlights event={event} highlights={highlights} />
      )}
      {kinds.includes(REACTION) && (
        <TextReactions event={event} reactions={reactions} />
      )}
    </Flex>
  );
}
