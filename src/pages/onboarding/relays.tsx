import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
const Relays = dynamic(() => import("@habla/onboarding/Relays"), {
  ssr: false,
});

export default function OnboardingRelays() {
  const { t } = useTranslation("common");
  const url = "https://habla.news/onboarding/relays";
  const metadata = {
    title: t("add-relays"),
  };
  return (
    <>
      <Metadata url={url} metadata={metadata} />
      <Layout>
        <Relays />
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
