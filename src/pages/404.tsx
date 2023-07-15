import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Heading, Flex, Box, Img, Text } from "@chakra-ui/react";

export default function Error() {
  const { t } = useTranslation("common");
  return (
    <>
      <Head>
        <title>{t("oops")}</title>
        <meta name="og:title" content={t("habla")} />
        <meta name="og:description" content={t("tagline")} />
      </Head>
      <Flex flexDir="column" px={4} alignItems="center">
        <Flex
          flexDir="column"
          gap={5}
          maxWidth={["100%", "100%", "48rem"]}
          width="100%"
          mt={5}
        >
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
        </Flex>
      </Flex>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
