import { Flex, Stack, Text, Heading, Divider } from "@chakra-ui/react";

import { findTag, findTags } from "@habla/tags";
import Username from "./Username";
import User from "./User";
import FollowButton from "@habla/components/nostr/FollowButton";
import EventId from "@habla/markdown/EventId";
import Hashtags from "@habla/components/Hashtags";

function ListTag({ tag }) {
  const [t, value] = tag;
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
    return "a";
  } else if (t === "r") {
    return "r";
  }
}

export default function List({ event }) {
  const identifier = findTag(event, "d");
  const hashtags = findTags(event, "t");
  return (
    <>
      <Flex
        flexDirection={["column", "row"]}
        alignItems={["flex-start", "center"]}
        justifyContent="space-between"
        my={4}
      >
        <Heading as="h5">{identifier}</Heading>
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
