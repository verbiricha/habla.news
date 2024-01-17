import Head from "next/head";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
import Moderation from "@habla/components/Moderation";

export default function ModerationPage() {
  const { t } = useTranslation("common");
  const url = "https://habla.news/moderation";
  const metadata = {
    title: t("moderation"),
  };
  return (
    <>
      <Metadata url={url} metadata={metadata} />
      <Layout>
        <Moderation />
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
