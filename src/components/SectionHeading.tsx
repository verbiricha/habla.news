import { Heading } from "@chakra-ui/react";

export default function SectionHeading({ children }) {
  return (
    <Heading
      mt={6}
      mb={4}
      sx={{
        fontFamily: "'Inter'",
        textTransform: "uppercase",
        color: "#989898",
        fontWeight: "700",
        fontSize: "13px",
        lineHeight: "16px",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </Heading>
  );
}
