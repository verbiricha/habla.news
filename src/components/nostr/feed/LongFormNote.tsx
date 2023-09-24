import { useMemo } from "react";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { nip19 } from "nostr-tools";
import Link from "next/link";

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
import User from "@habla/components/nostr/User";
import Hashtags from "@habla/components/Hashtags";
import Reactions from "@habla/components/nostr/LazyReactions";
import ArticleLink from "@habla/components/nostr/ArticleLink";

function LongFormTime({ content, publishedAt, updatedAt }) {
  const day = useMemo(() => formatDay(publishedAt), [publishedAt]);
  return (
    <>
      <Text color="secondary">{day}</Text>
      {updatedAt < publishedAt && (
        <Flex align="center" color="secondary" gap={2}>
          <Icon as={EditIcon} />
          <Text>{formatDay(updatedAt)}</Text>
        </Flex>
      )}
    </>
  );
}

export function PublishedIn({ event, community }) {
  // todo: make sure is approved by community
  const { t } = useTranslation("common");
  const { name, naddr } = useMemo(() => {
    if (!community) return {};
    const [kind, pubkey, identifier] = community.split(":");
    return {
      name: identifier,
      naddr: nip19.naddrEncode({
        kind: Number(kind),
        pubkey,
        identifier,
        relays: [],
      }),
    };
  }, [community]);
  return (
    <Text color="secondary" fontSize="sm">
      {t("published-in")}{" "}
      {naddr ? (
        <Link href={`/c/${naddr}`} shallow>
          <Text
            as="span"
            textDecoration="underline"
            textDecorationStyle="dotted"
          >
            {name}
          </Text>
        </Link>
      ) : (
        <Text as="span" textDecoration="underline" textDecorationStyle="dotted">
          {name}
        </Text>
      )}
    </Text>
  );
}

export default function LongFormNote({
  event,
  excludeAuthor = false,
  excludeReactions = true,
}) {
  const [defaultRelays] = useAtom(relaysAtom);
  const {
    identifier,
    title,
    image,
    summary,
    description,
    hashtags,
    publishedAt,
    community,
  } = useMemo(() => getMetadata(event), [event]);
  return title.length > 0 ? (
    <Card variant="article" my={4}>
      <CardHeader>
        <Flex align="center" direction="row" gap={2} fontFamily="Inter">
          {!excludeAuthor && <User pubkey={event.pubkey} size="sm" />}
          {community && <PublishedIn community={community} event={event} />}
          <LongFormTime
            publishedAt={publishedAt || event.created_at}
            updatedAt={event.created_at}
            content={event.content}
          />
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex
          alignItems="flex-start"
          justifyContent="space-between"
          direction={["column-reverse", "row"]}
          gap="4"
          dir="auto"
        >
          <Flex flexDirection="column">
            <ArticleLink event={event}>
              <Heading
                wordBreak="break-word"
                mb={2}
                sx={{
                  fontWeight: 600,
                  fontSize: "24px",
                  lineHeight: "30px",
                }}
              >
                {title}
              </Heading>
            </ArticleLink>
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
          {image?.length > 0 && (
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
    </Card>
  ) : null;
}
