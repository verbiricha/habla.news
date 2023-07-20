import Head from "next/head";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@habla/layouts/Wide";

const Backup = dynamic(() => import("@habla/onboarding/backup"), {
  ssr: false,
});

export default function OnboardingProgress() {
  return (
    <>
      <Head>
        <title>Backup your keys</title>
        <meta name="og:title" content="Backup your keys" />
      </Head>
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
