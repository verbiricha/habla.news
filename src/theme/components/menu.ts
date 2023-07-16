import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  button: {},
  list: {},
  item: {
    fontFamily: "'Inter'",
  },
  groupTitle: {},
  command: {},
  divider: {},
});

export default defineMultiStyleConfig({ baseStyle });
