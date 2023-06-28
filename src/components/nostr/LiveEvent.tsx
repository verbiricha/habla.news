import {
  Flex,
  Stack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Image,
  Tag,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

import User from "@habla/components/nostr/User";
import { findTag } from "@habla/tags";
import ExternalLink from "@habla/components/ExternalLink";

export default function LiveEvent({ naddr, event }) {
  const stream = findTag(event, "streaming");
  const cover = findTag(event, "image");
  const title = findTag(event, "title");
  const summary = findTag(event, "summary");
  const status = findTag(event, "status");
  const { t } = useTranslation("common");
  const people = event.tags
    .filter((t) => t.at(0) === "p")
    .reduce(
      (acc, t) => {
        const [, pubkey, role] = t;
        acc.push([role, pubkey]);
        return acc;
      },
      [["streamer", event.pubkey]]
    );
  const live = (
    <Tag
      w={12}
      sx={{
        textTransform: "uppercase",
        color: "white",
        bg: "red",
        fontWeight: 600,
      }}
    >
      Live
    </Tag>
  );
  const offline = (
    <Tag
      w={20}
      sx={{
        textTransform: "uppercase",
        fontWeight: 600,
      }}
    >
      offline
    </Tag>
  );

  return (
    <>
      <Card key={event.id} my={4}>
        <CardBody>
          <Flex
            alignItems="flex-start"
            flexDirection={["column", "row"]}
            gap={6}
          >
            {cover && (
              <Image
                src={cover}
                alt={title}
                borderRadius="lg"
                width={["100%", "auto"]}
                objectFit="contain"
                maxHeight="210px"
              />
            )}
            <Flex flexDirection="column" gap={4} flex={1} width="100%">
              <Flex justifyContent="space-between">
                <Text as="h4" style={{ fontSize: "23px", margin: "0" }}>
                  {title}
                </Text>
                {status === "live" ? live : offline}
              </Flex>
              {summary && <Text>{summary}</Text>}
              <Flex gap={20} flexWrap="wrap">
                {people.map(([role, pubkey]) => (
                  <Stack align="center" spacing={3}>
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
                  </Stack>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </CardBody>
        <CardFooter>
          <ExternalLink href={`https://live.snort.social/live/${naddr}`}>
            {t("watch-stream")}
          </ExternalLink>
        </CardFooter>
      </Card>
    </>
  );
}
