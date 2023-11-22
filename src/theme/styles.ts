import { mode } from "@chakra-ui/theme-tools";
import {
  mergeThemeOverride,
  ThemeExtension,
  ComponentSingleStyleConfig,
} from "@chakra-ui/react";

const articleStyles = {
  article: {
    fontSize: "lg",

    "> h1": {
      fontFamily: "heading",
      fontWeight: "bold",
      fontSize: { base: "4xl", md: "5xl" },
      mb: { base: 8, md: 10 },
    },
    "> h2": {
      fontFamily: "heading",
      fontWeight: "bold",
      fontSize: { base: "2xl", md: "3xl" },
      mt: { base: 12, md: 14 },
      mb: { base: 6, md: 8 },
    },
    "> h3": {
      fontFamily: "heading",
      fontWeight: "semibold",
      fontSize: { base: "xl", md: "2xl" },
      mt: { base: 8, md: 10 },
      mb: { base: 3, md: 4 },
    },
    "> h4": {
      fontFamily: "heading",
      fontWeight: "semibold",
      fontSize: { base: "md", md: "lg" },
      mt: { base: 6, md: 8 },
      mb: 2,
    },
    "> p": {
      fontFamily: "'Source Serif Pro', serif",
      fontWeight: "normal",
      lineHeight: 6,
      my: 6,
    },
    ".article-link": {
      fontWeight: 500,
      textDecoration: "underline",
      textDecorationStyle: "dotted",
      transitionProperty: "common",
      transitionDuration: "fast",
      transitionTimingFunction: "ease-out",
      cursor: "pointer",
      outline: "none",
      color: "inherit",
      _hover: {
        textDecorationStyle: "underline",
      },
      _focus: {
        boxShadow: "outline",
      },
    },
    "> hr": {
      my: { base: 12, md: 14 },
      borderColor: "gray.200",

      _dark: {
        borderColor: "gray.600",
      },
    },
    "> blockquote": {
      fontStyle: "italic",
      fontWeight: "semibold",
      paddingStart: 4,
      my: { base: 6, md: 8 },
      borderStartWidth: "4px",
      borderStartColor: "gray.200",

      _dark: {
        borderStartColor: "gray.600",
      },
    },

    "> pre": {
      p: 4,
      rounded: "md",
      bg: "gray.700",
      color: "gray.50",
      overflow: "auto",
      overflowY: "hidden",
      overflowX: "scroll",
      width: "100vw",
      maxWidth: "45rem",

      _dark: {
        bg: "gray.800",
      },

      code: {
        fontWeight: "normal",

        "&::before, &::after": {
          content: '""',
        },
      },
    },
    "> code": {
      fontWeight: "semibold",
      overflowX: "hidden",
      overflowY: "scroll",
      width: "100vw",

      "&::before, &::after": {
        content: '"`"',
      },
    },

    "> figure": {
      my: 8,

      figcaption: {
        color: "gray.400",
        mt: 3,

        _dark: {
          color: "gray.500",
        },
      },
    },

    "> ul": {
      paddingStart: 6,
      listStyleType: "disc",
    },
    "> ol": {
      paddingStart: 6,
    },
    li: {
      paddingStart: 2,
      my: 3,
      fontFamily: "'Source Serif Pro', serif",
    },
    "ol>li::marker": {
      color: "gray.400",

      _dark: {
        color: "gray.500",
      },
    },
    "ul>li::marker": {
      color: "gray.500",

      _dark: {
        color: "gray.300",
      },
    },

    "> table": {
      width: "full",
      my: 8,
      textAlign: "start",

      thead: {
        borderBottomWidth: "1px",
        borderBottomColor: "gray.300",

        _dark: {
          borderBottomColor: "gray.600",
        },
      },

      th: {
        textAlign: "inherit",
        fontWeight: 600,
        p: { base: 2, md: 3 },
      },

      td: {
        p: { base: 2, md: 3 },
        verticalAlign: "baseline",
      },

      tbody: {
        tr: {
          borderBottomWidth: "1px",
          borderBottomColor: "gray.200",

          _dark: {
            borderBottomColor: "gray.700",
          },

          ":last-of-type": {
            borderBottomWidth: "0px",
            borderBottomColor: "transparent",
          },
        },
      },

      tfoot: {
        tr: {
          borderTopWidth: "1px",
          borderTopColor: "gray.300",

          _dark: {
            borderTopColor: "gray.600",
          },
        },
      },
    },

    "> h1 + *, h2 + *, h3 + *, h4 + *, hr + *": {
      mt: 0,
    },

    "> iframe": {
      margin: "20px auto",
      borderRadius: "12px",
    },
    ".twitter-tweet": {
      margin: "0 auto",
    },
    ".twitter-tweet iframe": {
      width: "auto",
    },
  },
};

const styles = {
  global: (props) => ({
    input: {
      fontFamily: "'Inter'",
    },
    'input[type="file"]': {
      my: "2",
      border: "1px solid ",
      borderColor: "whiteAlpha.300",
      padding: "1",
      cursor: "pointer",
    },
    select: {
      fontFamily: "'Inter'",
    },
    textarea: {
      fontFamily: "'Inter'",
    },
    label: {
      fontFamily: "'Inter'",
    },
    body: {
      color: mode("#303030", "white")(props),
      bg: mode("white", "#1D1D1E")(props),
    },
    mark: {
      bg: "#ffefd8",
    },
    img: {
      borderRadius: "20px",
      objectFit: "cover",
    },
    "::selection": {
      color: "#16161D",
      bg: "#FFD1DC",
    },
    ":root": {
      // Zapthreads custom styles
      "--ztr-font": "Inter",
      "--ztr-text-color": mode("#2B2B2B", "#DEDEDE")(props),
      "--ztr-font-size": "15px",
      "--ztr-login-button-color": mode(
        "var(--chakra-colors-orange-600)",
        "var(--chakra-colors-orange-300)"
      )(props),
      "--ztr-link-color": mode(
        "var(--chakra-colors-orange-600)",
        "var(--chakra-colors-orange-300)"
      )(props),
    },
    ".date-picker": {
      bg: mode("white", "#1D1D1E")(props),
      borderRadius: "4px",
      width: "100%",
      border: "1px solid ",
      borderColor: "whiteAlpha.300",
      paddingX: "4",
      paddingY: "2",
    },
    ".react-datepicker-wrapper": {
      width: "100%",
    },
    ...articleStyles,
  }),
};

export default styles;
