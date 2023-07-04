import Link from "next/link";
import { nip19 } from "nostr-tools";
import {
  Flex,
  Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";
import { findTag } from "@habla/tags";
import User from "@habla/components/nostr/User";
import { useTranslation } from "next-i18next";

export default function Community({ event }) {
  const title = findTag(event, "d");
  const description = findTag(event, "description");
  const image = findTag(event, "image");
  const rules = findTag(event, "rules"); // optional
  const moderators = event.tags.filter(
    (t) => t.at(0) === "p" && t.includes("moderator")
  );
  const relays = event.tags.filter((t) => t.at(0) === "relay");
  const { t } = useTranslation("common");
  return (
    <Card>
      <CardBody dir="auto">
        <Flex
          alignItems="flex-start"
          justifyContent="space-between"
          direction={["column-reverse", "row"]}
          gap="4"
          dir="auto"
        >
          <Flex flexDirection="column">
            <Link href={`/c/${event.encode()}`} shallow>
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
            {description?.length > 0 && description?.length < 360 && (
              <Text color="secondary" py={1} wordBreak="break-word">
                {description}
              </Text>
            )}
            <Flex gap={10} flexWrap="wrap" mt={10}>
              {moderators.length === 0 && (
                <Flex
                  flexDir="column"
                  gap={3}
                  flexWrap="wrap"
                  align="center"
                  spacing={3}
                >
                  <Text
                    as="span"
                    style={{
                      color: "#989898",
                      fontWeight: "700",
                      fontSize: "13px",
                      lineHeight: "16px",
                      letterSpacing: "0.04em",
                      textTransform: "capitalize",
                      margin: "0",
                    }}
                  >
                    {t("author")}
                  </Text>
                  <User as="span" size="xs" pubkey={event.pubkey} />
                </Flex>
              )}
              {moderators.map(([, pubkey, , role]) => (
                <Flex
                  flexDir="column"
                  gap={3}
                  flexWrap="wrap"
                  align="center"
                  spacing={3}
                >
                  <Text
                    as="span"
                    style={{
                      color: "#989898",
                      fontWeight: "700",
                      fontSize: "13px",
                      lineHeight: "16px",
                      letterSpacing: "0.04em",
                      textTransform: "capitalize",
                      margin: "0",
                    }}
                  >
                    {role}
                  </Text>
                  <User as="span" size="xs" pubkey={pubkey} />
                </Flex>
              ))}
            </Flex>
          </Flex>
          {image?.length > 0 && description?.length > 0 && (
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
      <CardFooter dir="auto"></CardFooter>
    </Card>
  );
}
