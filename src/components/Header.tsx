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
      p={2}
      width="100%"
      paddingLeft={"40px"}
      alignItems="center"
      justifyContent="space-between"
      background={"#000000"}
      color={"#ffffff"}
      position={"fixed"}
      top={0}
      zIndex={999}
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
