import Link from "next/link";
import { Flex, Heading, Text, Button } from "@chakra-ui/react";

export default function Hero() {
  return (
    <Flex
      flexDirection="column"
      bg="brand.50"
      borderRadius="20px"
      p="17px 24px"
      gap={4}
    >
      <Heading fontSize="xl">What is Habla?</Heading>
      <Text fontSize="sm" fontWeight={400}>
        Habla is a nostr-based web app that enables anyone to earn from their
        writing.
      </Text>
      <Button variant="solid" colorScheme="brand" maxWidth="8rem">
        2 min intro
      </Button>
    </Flex>
  );
}
