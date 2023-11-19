import { extendTheme } from "@chakra-ui/react";

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

const theme = extendTheme({
  config,
  breakpoints,
  styles,
  colors,
  semanticTokens,
  fonts,
  components,
});

export default theme;
