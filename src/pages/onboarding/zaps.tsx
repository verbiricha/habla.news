import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
const Zaps = dynamic(() => import("@habla/onboarding/Zaps"), {
  ssr: false,
});

export default function OnboardingProfile() {
  const { t } = useTranslation("common");
  const url = "https://habla.news/onboarding/zaps";
  const metadata = {
    title: t("discover-zaps"),
  };
  return (
    <>
      <Metadata url={url} metadata={metadata} />
      <Layout>
        <Zaps />
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
