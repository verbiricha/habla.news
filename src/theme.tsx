import { extendTheme } from "@chakra-ui/react";
import { withProse } from "@nikolovlazar/chakra-ui-prose";

import Tag from "@habla/theme/components/tag";
import Card from "@habla/theme/components/card";
import Button from "@habla/theme/components/button";
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

const components = { Tag, Card, Button };

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
        fontSize: "lg",
      },
      blockquote: {
        fontSize: "lg",
      },
      a: {
        textDecoration: "underline",
        textDecorationStyle: "dotted",
      },
      ".twitter-tweet": {
        margin: "0 auto",
      },
      ".twitter-tweet iframe": {
        width: "auto",
      },
    },
  })
);

export default theme;
