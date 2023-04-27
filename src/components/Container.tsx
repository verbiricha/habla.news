import { Flex, FlexProps } from "@chakra-ui/react";

export const Container = (props: FlexProps) => (
  <Flex
    direction="column"
    alignItems="center"
    justifyContent="center"
    bg="gray.10"
    color="black"
    marginTop={"59"}
    _dark={{
      bg: "gray.900",
      color: "white",
    }}
    transition="all 0.15s ease-out"
    {...props}
  />
);
