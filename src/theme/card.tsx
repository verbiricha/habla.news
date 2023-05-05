import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

// define custom styles for funky variant
const variants = {
  article: definePartsStyle({
    header: {
      py: 0,
      bg: "blue",
    },
    container: {
      bg: "red",
    },
    footer: {},
  }),
};

export default defineMultiStyleConfig({ variants });
