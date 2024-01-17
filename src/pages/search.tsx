import Head from "next/head";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Layout from "@habla/layouts/Wide";
import Omnibar from "@habla/components/Omnibar";
import Metadata from "@habla/components/Metadata";

export default function Search() {
  const { t } = useTranslation("common");
  const url = "https://habla.news/search";
  const metadata = {
    title: t("search"),
    summary: t("search-summary"),
  };
  return (
    <>
      <Metadata url={url} metadata={metadata} />
      <Layout>
        <Omnibar />
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
