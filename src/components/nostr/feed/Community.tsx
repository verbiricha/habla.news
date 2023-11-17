import { useMemo } from "react";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import {
  Flex,
  Heading,
  Card,
  CardBody,
  CardFooter,
  Stack,
  HStack,
  Text,
  Image,
} from "@chakra-ui/react";
import { findTag } from "@habla/tags";
import User from "@habla/components/nostr/User";
import { useTranslation } from "next-i18next";
import { FollowCommunityButton } from "@habla/components/nostr/FollowButton";
import { MuteReferenceButton } from "@habla/components/nostr/MuteButton";
import { getMetadata } from "@habla/nip72";
import useModeration from "@habla/hooks/useModeration";
import useHashtags from "@habla/hooks/useHashtags";

export default function Community({ event }) {
  const { name, description, image } = getMetadata(event);
  const { mutedWords, isTagMuted } = useModeration();
  const hashtags = useHashtags(event);
  const isHidden = useMemo(() => {
    return (
      isTagMuted(["p", event.pubkey]) ||
      isTagMuted(event.tagReference()) ||
      hashtags.some((t) => isTagMuted(["t", t])) ||
      mutedWords.some((w) => {
        const word = w.toLowerCase();
        return (
          name.toLowerCase().includes(word) ||
          description?.toLowerCase().includes(word)
        );
      })
    );
  }, [mutedWords, isTagMuted]);
  const relays = event.tags.filter((t) => t.at(0) === "relay");
  const { t } = useTranslation("common");
  return isHidden ? null : (
    <Card>
      <CardBody dir="auto">
        <Flex align="center" direction={["column", "row"]} gap={3}>
          {image?.length > 0 && description?.length > 0 && (
            <Link href={`/c/${event.encode()}`} shallow>
              <Image
                src={image}
                alt={name}
                mt={[2, 0]}
                fit="fill"
                width="210px"
                maxH="180px"
              />
            </Link>
          )}
          <Flex direction="column" flex="1" width="100%">
            <Flex
              alignItems={["flex-start", "center"]}
              justify="space-between"
              flexDirection={["column", "row"]}
              my={2}
            >
              <Link href={`/c/${event.encode()}`} shallow>
                <Heading
                  wordBreak="break-word"
                  my={2}
                  sx={{
                    fontWeight: 600,
                    fontSize: "24px",
                    lineHeight: "30px",
                  }}
                >
                  {name}
                </Heading>
              </Link>
              <HStack gap={2}>
                <MuteReferenceButton reference={event.tagReference()} />
                <FollowCommunityButton reference={event.tagReference()} />
              </HStack>
            </Flex>
            {description?.length > 0 && (
              <Text color="secondary" py={1} wordBreak="break-word">
                {description.length > 240
                  ? `${description.slice(0, 240)}...`
                  : description}
              </Text>
            )}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
}
