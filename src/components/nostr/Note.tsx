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
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import User from "./User";

import { ZAP, REACTION } from "../../const";
import { useReactions } from "../../nostr/hooks";
import Markdown from "../../markdown/Markdown";
import Zaps from "../Zaps";
import Reactions from "../Reactions";

export default function Note({ event }) {
  const { reactions, zaps } = useReactions(event, [ZAP, REACTION]);
  return (
    <Card variant="outline" my={4}>
      <CardHeader pb={0}>
        <User pubkey={event.pubkey} size="sm" />
      </CardHeader>
      <CardBody>
        <Prose mt={-6} mb={-6}>
          <Markdown content={event.content} tags={event.tags} />
        </Prose>
      </CardBody>
      <CardFooter>
        <Flex alignItems="center" gap="6">
          <Zaps event={event} zaps={zaps} />
          <Reactions event={event} reactions={reactions} />
        </Flex>
      </CardFooter>
    </Card>
  );
}
