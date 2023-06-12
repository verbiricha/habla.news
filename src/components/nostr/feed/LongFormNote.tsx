import { useMemo } from "react";
import Link from "next/link";
import { useAtom } from "jotai";
import { useInView } from "react-intersection-observer";

import { nip19 } from "nostr-tools";
import {
  Flex,
  Box,
  Text,
  Heading,
  Card,
  Stack,
  CardHeader,
  CardBody,
  CardFooter,
  Icon,
  Image,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

import { relaysAtom } from "@habla/state";
import { getMetadata } from "@habla/nip23";
import { formatDay } from "@habla/format";
import useSeenOn from "@habla/hooks/useSeenOn";
import SeenIn from "@habla/components/SeenIn";
import User from "../User";
import Hashtags from "../../Hashtags";
import Reactions from "@habla/components/nostr/LazyReactions";

function LongFormTime({ content, publishedAt, updatedAt }) {
  const day = useMemo(() => formatDay(publishedAt), [publishedAt]);
  const updated = useMemo(() => formatDay(updatedAt), [updatedAt]);
  return (
    <>
      <Text color="secondary">{day}</Text>
      {day !== updated && (
        <Flex align="center" color="secondary" gap={2}>
          <Icon as={EditIcon} />
          <Text>{updated}</Text>
        </Flex>
      )}
    </>
  );
}

export default function LongFormNote({
  event,
  excludeAuthor,
  excludeReactions = true,
}) {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const [defaultRelays] = useAtom(relaysAtom);
  const {
    identifier,
    title,
    image,
    summary,
    description,
    hashtags,
    publishedAt,
  } = useMemo(() => getMetadata(event), [event]);
  const relays = useSeenOn(event);
  const naddr = useMemo(() => {
    return nip19.naddrEncode({
      identifier,
      pubkey: event.pubkey,
      kind: event.kind,
      relays: relays.length > 0 ? relays : defaultRelays,
    });
  }, [event]);
  return title.length > 0 && event.content.length > 0 ? (
    <Card ref={ref} variant="article" my={4}>
      {!excludeAuthor && (
        <CardHeader>
          <Flex align="center" direction="row" gap={2} fontFamily="Inter">
            <User pubkey={event.pubkey} size="sm" />
            <LongFormTime
              publishedAt={publishedAt}
              updatedAt={event.created_at}
              content={event.content}
            />
          </Flex>
        </CardHeader>
      )}
      <CardBody>
        <Flex
          alignItems={["flex-start", "center"]}
          justifyContent="space-between"
          direction={["column-reverse", "row"]}
          gap="4"
          dir="auto"
        >
          <Flex flexDirection="column">
            <Link href={`/a/${naddr}`}>
              <Heading
                wordBreak="break-word"
                mb={3}
                sx={{
                  fontWeight: 600,
                  fontSize: "24px",
                  lineHeight: "30px",
                }}
              >
                {title}
              </Heading>
            </Link>
            {summary?.length > 0 && summary?.length < 360 && (
              <Text color="secondary" py={1} wordBreak="break-word">
                {summary}
              </Text>
            )}
            {hashtags.length > 0 && (
              <Flex alignItems="center" gap={3} mt={4}>
                <Hashtags hashtags={hashtags.slice(0, 3)} />
                {hashtags.length > 3 && (
                  <Flex h={7}>
                    <Text fontSize="xs" color="secondary">
                      …
                    </Text>
                  </Flex>
                )}
              </Flex>
            )}
          </Flex>
          {image?.length > 0 && summary?.length > 0 && (
            <Image
              src={image}
              alt={title}
              mt={[2, 0]}
              fit={["contain", "cover"]}
              maxWidth={["none", "240px"]}
              width="100%"
              maxHeight="160px"
            />
          )}
        </Flex>
      </CardBody>
      {!excludeReactions && (
        <CardFooter>
          <Reactions event={event} live={inView} />
        </CardFooter>
      )}
    </Card>
  ) : null;
}
