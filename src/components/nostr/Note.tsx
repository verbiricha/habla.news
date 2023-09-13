import { useMemo } from "react";

import {
  Flex,
  Box,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { nip19 } from "nostr-tools";

import Markdown from "@habla/markdown/Markdown";
import User from "./User";
import ExternalLinkIcon from "@habla/components/ExternalLinkIcon";

export default function Note({ event, highlights = [], ...props }) {
  const nevent = useMemo(() => {
    return event.encode();
  }, [event]);
  return (
    <Card variant="outline" my={4} maxW="586px" {...props}>
      <CardHeader py={1}>
        <Flex alignItems="center" justifyContent="space-between">
          <User pubkey={event.pubkey} size="sm" />
          <ExternalLinkIcon href={`https://snort.social/e/${nevent}`} />
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
