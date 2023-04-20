import { Stack, StackProps } from "@chakra-ui/react";

export const Main = (props: StackProps) => (
  <Stack
    spacing="1.5rem"
    maxWidth="48rem"
    minHeight="80vh"
    pt="1rem"
    px="1rem"
    width="100%"
    {...props}
  />
);
