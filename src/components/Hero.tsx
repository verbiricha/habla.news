import Link from "next/link";
import { Flex, Heading, Text, Button } from "@chakra-ui/react";

export default function Hero() {
  return (
    <Flex
      flexDirection="column"
      bg="layer"
      borderRadius="20px"
      p="17px 24px"
      gap={4}
    >
      <Heading fontSize="xl">What is Habla?</Heading>
      <Text fontSize="md" fontWeight={400}>
        Habla is a nostr-based web app that enables anyone to earn from their
        writing.
      </Text>
      <Link href={`/faq`}>
        <Button variant="solid" color="white" bg="surface" maxWidth="8rem">
          2 min intro
        </Button>
      </Link>
    </Flex>
  );
}
