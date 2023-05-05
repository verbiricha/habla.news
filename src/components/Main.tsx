import { Flex, Stack, StackProps } from "@chakra-ui/react";

export default function Main(props: StackProps) {
  return (
    <Flex align="center" justifyContent="center">
      <Stack spacing="1.5rem" maxWidth="52rem" px="1rem" {...props} />
    </Flex>
  );
}
