import { useTranslation } from "next-i18next";
import { Heading, Flex, Box, Img, Text } from "@chakra-ui/react";

export default function NotFound() {
  const { t } = useTranslation("common");
  return (
    <>
      <Heading>{t("not-found")}</Heading>
      <Text>{t("not-found-long")}</Text>
      <Box
        boxSize={{
          base: "xs",
          sm: "sm",
          md: "md",
          lg: "xl",
        }}
        margin="0 auto"
        mt={10}
      >
        <Img src="/family.png" alt={t("oops")} />
      </Box>
    </>
  );
}
