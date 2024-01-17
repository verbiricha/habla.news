import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@habla/layouts/Wide";
import Settings from "@habla/components/Settings";
import Metadata from "@habla/components/Metadata";

export default function SettingsPage() {
  const { t } = useTranslation("common");
  const metadata = {
    title: t("settings"),
  };
  return (
    <>
      <Metadata url="https://habla.news/settings" metadata={metadata} />
      <Layout>
        <Settings />
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "onboarding"])),
    },
  };
}
