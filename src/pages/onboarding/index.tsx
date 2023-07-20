import Head from "next/head";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@habla/layouts/Wide";

const Progress = dynamic(() => import("@habla/onboarding/Progress"), {
  ssr: false,
});

export default function OnboardingProgress() {
  return (
    <>
      <Head>
        <title>Profile progress</title>
        <meta name="og:title" content="Profile progress" />
      </Head>
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
