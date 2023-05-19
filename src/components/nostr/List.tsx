import Link from "next/link";
import { Flex, Stack, Text, Heading, Divider } from "@chakra-ui/react";

import { nip19 } from "nostr-tools";

import { findTag, findTags } from "@habla/tags";
import Username from "./Username";
import User from "./User";
import FollowButton from "@habla/components/nostr/FollowButton";
import Emoji from "@habla/components/Emoji";
import EventId from "@habla/markdown/EventId";
import Hashtags from "@habla/components/Hashtags";
import Address from "@habla/components/nostr/Address";

export function ListTag({ tag }) {
  const [t, value, relay] = tag;
  if (t === "p") {
    return (
      <Flex align="center" justifyContent="space-between">
        <User pubkey={value} />
        <FollowButton pubkey={value} />
      </Flex>
    );
  } else if (t === "e") {
    return <EventId id={value} />;
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
      />
    );
  } else if (t === "emoji") {
    return (
      <Flex align="center" gap={3} height="42px">
        <Emoji src={relay} />
        <Text>{value}</Text>
      </Flex>
    );
  } else if (t === "r") {
    return <Link href={value}>{value}</Link>;
  }
}

export default function List({ event }) {
  const identifier = findTag(event, "d");
  const subject = findTag(event, "subject");
  const hashtags = findTags(event, "t");
  return (
    <>
      <Flex
        flexDirection={["column", "row"]}
        alignItems={["flex-start", "center"]}
        justifyContent="space-between"
        my={4}
      >
        <Heading as="h5">{subject || identifier}</Heading>
        <Flex alignItems="center" gap={2}>
          <Text as="span" fontSize="lg" color="secondary">
            by
          </Text>
          <Username renderLink pubkey={event.pubkey} />
        </Flex>
      </Flex>
      <Hashtags hashtags={hashtags} />
      <Stack spacing={-4}>
        {event.tags.map((t) => (
          <ListTag tag={t} />
        ))}
      </Stack>
    </>
  );
}
