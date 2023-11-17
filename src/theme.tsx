import { extendTheme } from "@chakra-ui/react";
import { withProse } from "@nikolovlazar/chakra-ui-prose";

import Tag from "@habla/theme/components/tag";
import Card from "@habla/theme/components/card";
import Button from "@habla/theme/components/button";
import Menu from "@habla/theme/components/menu";
import colors from "@habla/theme/colors";
import styles from "@habla/theme/styles";
import semanticTokens from "@habla/theme/tokens";
import fonts from "@habla/theme/fonts";

const breakpoints = {
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
};

// todo: heading variants
const components = { Tag, Card, Button, Menu };

const config = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const theme = extendTheme(
  {
    config,
    breakpoints,
    styles,
    colors,
    semanticTokens,
    fonts,
    components,
  },
  withProse({
    baseStyle: {
      fontSize: "lg",
      p: {
        fontFamily: "'Source Serif Pro', serif",
        fontSize: "lg",
      },
      ul: {
        fontFamily: "'Source Serif Pro', serif",
      },
      ol: {
        fontFamily: "'Source Serif Pro', serif",
      },
      blockquote: {
        fontSize: "lg",
      },
      a: {
        textDecoration: "underline",
        textDecorationStyle: "dotted",
      },
      iframe: {
        margin: "20px auto",
        borderRadius: "12px",
      },
      ".twitter-tweet": {
        margin: "0 auto",
      },
      ".twitter-tweet iframe": {
        width: "auto",
      },
      code: {
        overflowX: "hidden",
        overflowY: "scroll",
        width: "100vw",
      },
      pre: {
        overflowY: "hidden",
        overflowX: "scroll",
        width: "100vw",
        maxWidth: "45rem",
      },
    },
  })
);

export default theme;
