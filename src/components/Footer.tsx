import { Text, Flex, type FlexProps } from "@chakra-ui/react";

import DarkModeSwitch from "./DarkModeSwitch";

export const Footer = (props: FlexProps) => (
  <Flex
    alignItems="center"
    justifyContent="center"
    as="footer"
    py="4rem"
    mt={20}
    {...props}
  >
    <DarkModeSwitch />
  </Flex>
);
