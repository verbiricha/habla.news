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

export default defineStyleConfig({
  variants: { outline, write, solid },
});
