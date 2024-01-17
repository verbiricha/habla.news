import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
const Progress = dynamic(() => import("@habla/onboarding/Progress"), {
  ssr: false,
});

export default function OnboardingProgress() {
  const { t } = useTranslation("common");
  const url = "https://habla.news/onboarding";
  const metadata = {
    title: t("onboarding"),
  };
  return (
    <>
      <Metadata url={url} metadata={metadata} />
      <Layout>
        <Progress />
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
