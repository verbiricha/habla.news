import { useMemo } from "react";
import Link from "next/link";
import { useAtom } from "jotai";
import { useInView } from "react-intersection-observer";

import { nip19 } from "nostr-tools";
import {
  Flex,
  Text,
  Heading,
  Card,
  Stack,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
} from "@chakra-ui/react";

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
  return <Text color="secondary">{day}</Text>;
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
  return (
    <Card ref={ref} variant="article">
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
        >
          <Flex flexDirection="column">
            <Link href={`/a/${naddr}`}>
              <Heading
                wordBreak="keep-all"
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
            {summary?.length > 0 && (
              <Text color="secondary" py={1} wordBreak="keep-all">
                {summary}
              </Text>
            )}
            {hashtags.length > 0 && <Hashtags mt={4} hashtags={hashtags} />}
          </Flex>
          {image?.length > 0 && summary?.length > 0 && (
            <Image
              src={image}
              alt={title}
              maxHeight="160px"
              my={[2, 0]}
              width="100%"
              maxWidth={["none", "none", "240px"]}
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
  );
}
