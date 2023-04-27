import Link from "next/link";
import dynamic from "next/dynamic";
//import { useAtom } from "jotai";

import { Heading, Flex, FlexProps, IconButton } from "@chakra-ui/react";
import { SearchIcon, EditIcon } from "@chakra-ui/icons";

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
        <Link href="/search">
          <IconButton
            icon={<SearchIcon />}
            color="secondary"
            variant="unstyled"
          />
        </Link>
        <Link href="/write">
          <IconButton
            icon={<EditIcon />}
            color="secondary"
            variant="unstyled"
          />
        </Link>
        <Login />
      </Flex>
    </Flex>
  );
};
