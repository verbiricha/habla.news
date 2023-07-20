import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@habla/layouts/Wide";

const Profile = dynamic(() => import("@habla/onboarding/Profile"), {
  ssr: false,
});

export default function OnboardingProfile() {
  return (
    <>
      <Head>
        <title>Fill out your profile</title>
        <meta name="og:title" content="Fill out your profile" />
      </Head>
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
