import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@habla/layouts/Wide";
import Settings from "@habla/components/Settings";

export default function SettingsPage() {
  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="og:title" content="Settings" />
      </Head>
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
