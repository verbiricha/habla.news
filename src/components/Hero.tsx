import Link from "next/link";
import { Flex, Stack, Heading, Text } from "@chakra-ui/react";

export default function Hero() {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      color="#16161D"
      bg="purple.100"
      width="100%"
      py={8}
      px={4}
    >
      <Flex width="100%" maxWidth="48rem" p={2}>
        <Stack spacing={{ base: "4", md: "6" }}>
          <Heading fontSize="6xl" fontWeight={500} lineHeight={"52px"}>
            Speak your mind
          </Heading>
          <Text fontSize="2xl" mt={10}>
            ✍️ Write, 📣 publish, <mark>highlight</mark>, 🗣️ discuss, 🤑 earn.
          </Text>
          <Text fontSize="xl" mt={10}>
            Habla is a website for reading and publishing long form content over{" "}
            <Link href="https://nostr.how">
              <Text as="span" fontWeight={500}>
                Nostr
              </Text>
            </Link>
          </Text>
        </Stack>
      </Flex>
    </Flex>
  );
}
