import { Text } from "@chakra-ui/react";

export default function Blockquote({ children }) {
  return (
    <Text
      as="blockquote"
      sx={{
        paddingStart: 4,
        my: 0,
        borderStartWidth: "4px",
        borderStartColor: "gray.200",
        _dark: {
          borderStartColor: "gray.600",
        },
      }}
    >
      {children}
    </Text>
  );
}
