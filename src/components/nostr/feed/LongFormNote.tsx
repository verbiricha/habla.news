import { useMemo } from "react";
import Link from "next/link";

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

import useSeenOn from "@habla/hooks/useSeenOn";
import SeenIn from "@habla/components/SeenIn";
import User from "../User";
import Hashtags from "../../Hashtags";
import { getMetadata } from "../../../nip23";
import { formatReadingTime, formatDay } from "../../../format";
import Reactions from "../Reactions";

function LongFormTitle({ title, content, publishedAt }) {
  return (
    <>
      <Heading fontSize="2xl">{title}</Heading>
      <LongFormTime publishedAt={publishedAt} content={content} />
    </>
  );
}

function LongFormTime({ content, publishedAt }) {
  const day = useMemo(() => formatDay(publishedAt), [publishedAt]);
  const readingTime = useMemo(() => formatReadingTime(content), [content]);
  return (
    <Flex alignItems="center" gap="2" color="secondary" fontSize="xs">
      <Text>{day}</Text>
      {readingTime && (
        <>
          <Text>–</Text>
          <Text>{readingTime}</Text>
        </>
      )}
    </Flex>
  );
}

export default function LongFormNote({ event, excludeAuthor }) {
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
      relays,
    });
  }, [event]);
  return (
    <Card variant="unstyled">
      <CardHeader>
        <User pubkey={event.pubkey} relays={relays} />
      </CardHeader>
      <CardBody cursor="pointer">
        <Link href={`/a/${naddr}`}>
          <LongFormTitle
            title={title}
            publishedAt={publishedAt}
            content={event.content}
          />
          {summary?.length > 0 && <Text py={1}>{summary}</Text>}
        </Link>
        {hashtags.length > 0 && <Hashtags hashtags={hashtags.slice(0, 3)} />}
      </CardBody>
      <CardFooter>
        <Flex
          flexDirection={["column", "row"]}
          justifyContent="space-between"
          width="100%"
        >
          <Reactions event={event} />
          <SeenIn relays={relays} />
        </Flex>
      </CardFooter>
    </Card>
  );
}
