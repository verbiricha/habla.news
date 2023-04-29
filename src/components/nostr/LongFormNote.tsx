import { useMemo } from "react";

import { Flex, Text, Stack } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import Tabs from "@habla/components/Tabs";
import { formatShortNumber } from "@habla/format";
import { getZapRequest, getZapAmount } from "@habla/nip57";
import { useReactions } from "@habla/nostr/hooks";
import User from "@habla/components/nostr/User";
import BaseLongFormNote from "@habla/components/LongFormNote";
import Highlights from "@habla/components/nostr/Highlights";
import Comments from "@habla/components/nostr/Comments";

export default function LongFormNote({ event, relays, excludeAuthor }) {
  const { reactions, notes, zaps, highlights } = useReactions(event);
  const zappers = useMemo(() => {
    return zaps
      .map((z) => {
        return { ...getZapRequest(z), amount: getZapAmount(z) };
      })
      .filter((z) => z.pubkey !== event.pubkey);
  }, [zaps]);
  const tabs = [
    {
      name: "Highlights",
      panel: <Highlights event={event} />,
    },
    {
      name: "Comments",
      panel: <Comments event={event} />,
    },
    {
      name: "Reactions",
      panel: (
        <Stack spacing="3">
          {reactions.map((r) => {
            return (
              <Flex alignItems="center" gap="2">
                <User size="xs" pubkey={r.pubkey} />
                {r.content === "+" && <Text fontSize="md">liked</Text>}
                {r.content === "-" && <Text fontSize="md">disliked</Text>}
                {!["+", "-"].includes(r.content) && (
                  <Text fontSize="md">reacted with {r.content}</Text>
                )}
              </Flex>
            );
          })}
        </Stack>
      ),
    },
  ];
  return (
    <>
      <BaseLongFormNote
        excludeAuthor={excludeAuthor}
        event={event}
        relays={relays}
        notes={notes}
        reactions={reactions}
        highlights={highlights}
        zaps={zaps}
      />
      <Tabs tabs={tabs} />
    </>
  );
}
