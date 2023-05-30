import { useMemo } from "react";
import { useRouter } from "next/router";

import {
  Flex,
  IconButton,
  Box,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import { nip19 } from "nostr-tools";

import useSeenOn from "@habla/hooks/useSeenOn";
import Markdown from "@habla/markdown/Markdown";
import User from "./User";

export default function Note({ event, highlights = [], ...props }) {
  const router = useRouter();
  const seenOn = useSeenOn(event);
  const nevent = useMemo(() => {
    return nip19.neventEncode({
      id: event.id,
      author: event.pubkey,
      relays: seenOn,
    });
  }, [event, seenOn]);
  return (
    <Card variant="outline" my={4} maxW="586px" {...props}>
      <CardHeader py={1}>
        <Flex alignItems="center" justifyContent="space-between">
          <User pubkey={event.pubkey} size="sm" />
          <IconButton
            cursor="pointer"
            variant="unstyled"
            boxSize={3}
            color="secondary"
            as={LinkIcon}
            onClick={() => router.push(`https://snort.social/e/${nevent}`)}
          />
        </Flex>
      </CardHeader>
      <CardBody px={"60px"} dir="auto" pt={0} wordBreak="break-word">
        <Markdown
          content={event.content}
          tags={event.tags}
          highlights={highlights}
        />
      </CardBody>
    </Card>
  );
}
