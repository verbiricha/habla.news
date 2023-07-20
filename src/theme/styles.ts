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
  }),
};

export default styles;
