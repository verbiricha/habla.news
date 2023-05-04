import { extendTheme } from "@chakra-ui/react";
import { withProse } from "@nikolovlazar/chakra-ui-prose";

import Card from "./theme/card";

const fonts = { mono: `'Menlo', monospace` };

const components = { Card };

const breakpoints = {
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
};

const theme = extendTheme(
  {
    initialColorMode: "system",
    useSystemColorMode: true,
    styles: {
      global: {
        mark: {
          bg: "#FFF2CC",
        },
        img: {
          borderRadius: "12px",
          objectFit: "cover",
        },
        "::selection": {
          color: "#16161D",
          bg: "#FFD1DC",
        },
      },
    },
    semanticTokens: {
      colors: {
        highlight: {
          default: "#A966FF",
          _dark: "#A966FF",
        },
        secondary: {
          default: "#757575",
          _dark: "#A5A5A5",
        },
      },
      radii: {
        button: "12px",
      },
    },
    colors: {
      black: "#16161D",
    },
    fonts,
    breakpoints,
    components,
  },
  withProse()
);

export default theme;
