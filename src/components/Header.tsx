import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef } from "react";
import {
  useColorModeValue,
  Heading,
  Flex,
  FlexProps,
  Icon,
} from "@chakra-ui/react";
import { useHover } from "usehooks-ts";
import Logo from "@habla/icons/Logo";
import LogoAnimated from "@habla/icons/LogoAnimated";

const Login = dynamic(() => import("@habla/components/nostr/Login"), {
  ssr: false,
});

export default function Header(props: FlexProps) {
  const ref = useRef(null);
  const isHovering = useHover(ref);
  return (
    <Flex
      as="header"
      p={4}
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      <Flex alignItems="center" gap="4">
        <Link href="/" shallow ref={ref}>
          <Icon boxSize={14} as={isHovering ? LogoAnimated : Logo} />
        </Link>
      </Flex>
      <Flex alignItems="center" gap="1">
        <Login />
      </Flex>
    </Flex>
  );
}
