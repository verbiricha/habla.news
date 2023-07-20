import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@habla/layouts/Wide";

const Relays = dynamic(() => import("@habla/onboarding/Relays"), {
  ssr: false,
});

export default function OnboardingRelays() {
  return (
    <>
      <Head>
        <title>Add Relays</title>
        <meta name="og:title" content="Add Relays" />
      </Head>
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
