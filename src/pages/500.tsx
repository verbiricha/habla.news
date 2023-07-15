import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Heading, Flex, Box, Img, Text } from "@chakra-ui/react";

import Layout from "@habla/layouts/Wide";

export default function ServerError() {
  const { t } = useTranslation("common");
  return (
    <>
      <Head>
        <title>{t("oops")}</title>
        <meta name="og:title" content={t("habla")} />
        <meta name="og:description" content={t("tagline")} />
      </Head>
      <Layout>
        <Heading>{t("server-error")}</Heading>
        <Text>{t("server-error-long")}</Text>
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
      </Layout>
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
