import Link from "next/link";
import { Text, Flex, type FlexProps } from "@chakra-ui/react";

export const Footer = (props: FlexProps) => (
  <Flex
    alignItems="center"
    justifyContent="center"
    as="footer"
    py="4rem"
    mt={20}
    {...props}
  >
    <Text>
      Made with 💜 by <Link href="/verbiricha">verbiricha</Link>
    </Text>
  </Flex>
);
