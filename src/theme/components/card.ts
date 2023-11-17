import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const wordBreak = "break-word";

const variants = {
  article: definePartsStyle({
    header: {
      py: 1,
      px: 0,
    },
    body: {
      wordBreak,
      overflow: "hidden",
      px: 0,
      py: 0,
    },
    container: {
      px: 0,
      py: 0,
      bg: "transparent",
    },
    footer: {
      px: 0,
    },
  }),
  highlight: definePartsStyle({
    header: {
      py: 1,
      px: 0,
    },
    body: {
      wordBreak,
      overflow: "hidden",
      px: 0,
      py: 1,
    },
    container: {
      px: 0,
      bg: "transparent",
    },
    footer: {
      px: 0,
      py: 1,
    },
  }),
  user: definePartsStyle({
    body: {
      wordBreak,
      overflow: "hidden",
    },
    container: {
      px: 4,
      py: 2,
      bg: "transparent",
      borderRadius: "20px",
    },
  }),
};

const baseStyle = definePartsStyle({
  container: {
    backgroundColor: "transparent",
  },
  header: {
    backgroundColor: "transparent",
  },
  body: {
    backgroundColor: "transparent",
  },
  footer: {
    backgroundColor: "transparent",
  },
});

export default defineMultiStyleConfig({ baseStyle, variants });
