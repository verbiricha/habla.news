import {
  Flex,
  Stack,
  Card,
  CardHeader,
  CardBody,
  Text,
  Heading,
  Image,
} from "@chakra-ui/react";

import User from "@habla/components/nostr/User";
import { findTag } from "@habla/tags";

export default function ZapstrTrack({ event }) {
  const category = findTag(event, "c");
  const media = findTag(event, "media");
  const cover = findTag(event, "cover");
  const title = findTag(event, "subject");
  const people = event.tags
    .filter((t) => t.at(0) === "p")
    .reduce((acc, t) => {
      const [, pubkey, role] = t;
      acc.push([role, pubkey]);
      return acc;
    }, []);

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
            <Flex flexDirection="column" gap={4}>
              <Text style={{ fontSize: "23px", margin: "0 0 1em 0" }}>
                {title}
              </Text>
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
              <Flex mt={5}>
                {media && <audio key={media} src={media} controls />}
              </Flex>
            </Flex>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
}
