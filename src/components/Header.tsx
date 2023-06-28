import Link from "next/link";
import dynamic from "next/dynamic";

import { Heading, Flex, FlexProps } from "@chakra-ui/react";

const Login = dynamic(() => import("@habla/components/nostr/Login"), {
  ssr: false,
});

export default function Header(props: FlexProps) {
  return (
    <Flex
      as="header"
      p={4}
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      <Flex alignItems="center" gap="4">
        <Link href="/" shallow>
          <Heading
            sx={{
              fontWeight: 600,
              fontSize: "24px",
              lineHeight: "30px",
            }}
          >
            Habla
          </Heading>
        </Link>
      </Flex>
      <Flex alignItems="center" gap="1">
        <Login />
      </Flex>
    </Flex>
  );
}
