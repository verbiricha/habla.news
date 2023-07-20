import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@habla/layouts/Wide";

const Zaps = dynamic(() => import("@habla/onboarding/Zaps"), {
  ssr: false,
});

export default function OnboardingProfile() {
  return (
    <>
      <Head>
        <title>Discover Zaps</title>
        <meta name="og:title" content="Discover Zaps" />
      </Head>
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
