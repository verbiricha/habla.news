import Head from "next/head";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Heading } from "@chakra-ui/react";
import Layout from "@habla/layouts/Wide";
import { COMMUNITY } from "@habla/const";

const Feed = dynamic(() => import("@habla/components/nostr/Feed"), {
  ssr: false,
});

export default function Communities() {
  const { t } = useTranslation("common");
  return (
    <>
      <Head>
        <title>Habla</title>
        <meta name="og:title" content="Communities" />
        <meta name="og:description" content="Browse moderated communities" />
      </Head>
      <Layout>
        <Heading>{t("communities")}</Heading>
        <Feed key={`communities`} filter={{ kinds: [COMMUNITY] }} />
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
