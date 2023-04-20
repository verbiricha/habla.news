import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    background: "transparent",
  },
  header: {
    pt: 2,
    pb: 0,
  },
  body: {
    py: 3,
    wordBreak: "break-all",
    overflow: "hidden",
  },
  footer: {
    pt: 0,
    pb: 3,
  },
});

export default defineMultiStyleConfig({ baseStyle });
