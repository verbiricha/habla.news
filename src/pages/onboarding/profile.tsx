import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
const Profile = dynamic(() => import("@habla/onboarding/Profile"), {
  ssr: false,
});

export default function OnboardingProfile() {
  const { t } = useTranslation("common");
  const url = "https://habla.news/onboarding/profile";
  const metadata = {
    title: t("fill-profile"),
  };
  return (
    <>
      <Metadata url={url} metadata={metadata} />
      <Layout>
        <Profile />
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
