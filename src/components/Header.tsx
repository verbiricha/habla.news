import Link from "next/link";
import dynamic from "next/dynamic";

import { Heading, Flex, FlexProps } from "@chakra-ui/react";

const Login = dynamic(() => import("@habla/components/nostr/Login"), {
  ssr: false,
});

export const Header = (props: FlexProps) => {
  return (
    <Flex
      as="header"
      p={4}
      width="100%"
      maxWidth="48rem"
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      <Flex alignItems="center" gap="4">
        <Link href="/">
          <Heading>Habla</Heading>
        </Link>
      </Flex>
      <Flex alignItems="center" gap="1">
        <Login />
      </Flex>
    </Flex>
  );
};
