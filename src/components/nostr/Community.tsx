import { Helmet } from "react-helmet";
import { useMemo } from "react";
import { Flex, Stack, Heading, Text, Image } from "@chakra-ui/react";
import { findTag } from "@habla/tags";
import { POST_APPROVAL, HIGHLIGHT, LONG_FORM, NOTE } from "@habla/const";
import { useEvents } from "@habla/nostr/hooks";
import User from "@habla/components/nostr/User";
import Events from "@habla/components/nostr/feed/Events";

export default function Community({ event }) {
  const title = findTag(event, "d");
  const description = findTag(event, "description");
  const image = findTag(event, "image");
  const rules = findTag(event, "rules"); // optional
  const moderators = event.tags
    .filter((t) => t.at(0) === "p" && t.includes("moderator"))
    .map((t) => t.at(1));
  const address = `${event.kind}:${event.pubkey}:${title}`;
  const { events } = useEvents({
    kinds: [HIGHLIGHT, LONG_FORM, NOTE],
    "#a": [address],
  });
  const approvals = useEvents(
    {
      authors: moderators,
      kinds: [POST_APPROVAL],
      "#a": [address],
    },
    {
      cacheUsage: "RELAY_ONLY",
    }
  );

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (e.pubkey === event.pubkey || moderators.includes(e.pubkey)) {
        return true;
      }

      if ([NOTE, HIGHLIGHT].includes(e.kind)) {
        return approvals.events.find((a) => findTag(a, "e") === e.id);
      }
      const d = findTag(e, "d");
      const addr = `${e.kind}:${e.pubkey}:${d}`;
      return approvals.events.find(
        (a) => findTag(a, "e") === e.id || findTag(a, "a") === addr
      );
    });
  }, [events, approvals.events]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta name="og:description" content={description} />
        {image && <meta name="og:image" content={image} />}
      </Helmet>
      <Flex flexDir="column">
        <Flex
          flexDir={["column-reverse", "row"]}
          justifyContent="space-between"
          gap={[4, 12]}
          w="100%"
        >
          <Stack>
            <Heading>{title}</Heading>
            <Text fontSize="lg">{description}</Text>
            <Heading as="h4" fontSize="lg" mt={4}>
              Moderators
            </Heading>
            <Flex gap={6} flexWrap="wrap">
              {moderators.map((pk) => (
                <User key={pk} pubkey={pk} />
              ))}
            </Flex>
          </Stack>
          {image && (
            <Image
              maxW={["none", "320px"]}
              maxH="210px"
              fit="contain"
              src={image}
            />
          )}
        </Flex>
        <Flex mt={10}>
          <Events events={filteredEvents} />
        </Flex>
      </Flex>
    </>
  );
}
