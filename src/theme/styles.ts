import { mode } from "@chakra-ui/theme-tools";

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
      '--ztr-font': 'Inter',
      '--ztr-text-color': mode('#2B2B2B', '#DEDEDE')(props),
      '--ztr-font-size': '15px',
      '--ztr-login-button-color': mode('var(--chakra-colors-orange-600)', 'var(--chakra-colors-orange-300)')(props),
      '--ztr-link-color': mode('var(--chakra-colors-orange-600)', 'var(--chakra-colors-orange-300)')(props)
    }
  }),
};

export default styles;
