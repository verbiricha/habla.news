import {
  Flex,
  Box,
  Stack,
  HStack,
  Text,
  Heading,
  Divider,
  Tooltip,
} from "@chakra-ui/react";

import { nip19 } from "nostr-tools";

import { findTag } from "@habla/tags";
import User from "./User";
import FollowButton from "@habla/components/nostr/FollowButton";
import Emoji from "@habla/components/Emoji";
import Hashtags from "@habla/components/Hashtags";
import Address from "@habla/components/nostr/Address";
import EventId from "@habla/components/nostr/EventId";
import Blockquote from "@habla/components/Blockquote";
import { RelayItem } from "@habla/components/Relays";
import ExternalLink from "@habla/components/ExternalLink";
import { RecommendedAppMenu } from "@habla/components/nostr/UnknownKind";
import { EMOJIS } from "@habla/const";
import useHashtags from "@habla/hooks/useHashtags";

export function ListTag({ tag, ...rest }) {
  const [t, value, relay] = tag;
  if (t === "p") {
    return (
      <Flex align="center" justifyContent="space-between">
        <User pubkey={value} />
        <FollowButton pubkey={value} />
      </Flex>
    );
  } else if (t === "e") {
    return <EventId id={value} {...rest} />;
  } else if (t === "a") {
    const [k, pubkey, identifier] = value.split(":");
    const relays = relay?.length > 0 ? [relay] : [];
    const naddr = nip19.naddrEncode({
      kind: Number(k),
      identifier,
      pubkey,
      relays,
    });
    return (
      <Address
        naddr={naddr}
        kind={Number(k)}
        identifier={identifier}
        pubkey={pubkey}
        relays={relays}
        {...rest}
      />
    );
  } else if (t === "emoji") {
    return (
      <Tooltip label={value} placement="bottom">
        <Box>
          <Emoji src={relay} />
        </Box>
      </Tooltip>
    );
  } else if (t === "r") {
    if (value.startsWith("ws://") || value.startsWith("wss://")) {
      return <RelayItem key={value} url={value} />;
    }
    if (relay) {
      return <ExternalLink href={value}>{relay}</ExternalLink>;
    } else {
      return <ExternalLink href={value}>{value}</ExternalLink>;
    }
  }
}

export default function List({ event }) {
  const identifier = findTag(event, "d");
  const subject = findTag(event, "title") || findTag(event, "subject");
  const description =
    findTag(event, "summary") || findTag(event, "description");
  const hashtags = useHashtags(event);
  const isEmojiPack = event.kind === EMOJIS;
  const content = event.tags.map((t) => <ListTag tag={t} isFeed />);
  return (
    <Stack>
      <HStack align="flex-start" justify="space-between">
        <Stack>
          <Heading as="h5">{subject || identifier}</Heading>
          {description && <Blockquote>{description}</Blockquote>}
          <User size="xs" pubkey={event.pubkey} fontSize="xs" />
        </Stack>
        <RecommendedAppMenu event={event} />
      </HStack>
      <Hashtags hashtags={hashtags} />
      {isEmojiPack ? (
        <Flex flexDirection="row" align="flex-start" wrap="wrap" gap={2}>
          {content}
        </Flex>
      ) : (
        <Stack>{content}</Stack>
      )}
    </Stack>
  );
}
