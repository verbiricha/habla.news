import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
const Backup = dynamic(() => import("@habla/onboarding/backup"), {
  ssr: false,
});

export default function OnboardingProgress() {
  const { t } = useTranslation("common");
  const url = "https://habla.news/onboarding/backup";
  const metadata = {
    title: t("backup-keys"),
  };
  return (
    <>
      <Metadata url={url} metadata={metadata} />
      <Layout>
        <Backup />
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
