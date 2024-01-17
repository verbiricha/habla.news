import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Heading, Flex, Box, Img, Text } from "@chakra-ui/react";

import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";

export default function ServerError() {
  const { t } = useTranslation("common");
  const metadata = {
    title: t("oops"),
  };
  return (
    <>
      <Metadata metadata={metadata} />
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
