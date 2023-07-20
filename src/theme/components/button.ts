import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const outline = defineStyle({
  borderColor: "secondary",
  borderRadius: "46px",
  fontFamily: "'Inter'",
  fontWeight: 600,
});

const write = defineStyle({
  borderRadius: "20px",
  fontFamily: "'Inter'",
  fontWeight: 500,
});

const solid = defineStyle({
  fontFamily: "'Inter'",
  borderRadius: "20px",
});

const dark = defineStyle({
  borderRadius: "20px",
  fontFamily: "'Inter'",
  fontWeight: 500,
  bg: "black",
  color: "white",
  _hover: {
    color: "white",
    bg: "rgba(0, 0, 0, 0.6)",
  },
  _dark: {
    bg: "white",
    color: "black",
  },
});

export default defineStyleConfig({
  variants: { outline, write, solid, dark },
});
