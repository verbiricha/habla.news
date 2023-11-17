import Head from "next/head";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@habla/layouts/Wide";

const Communities = dynamic(
  () => import("@habla/components/nostr/Communities"),
  {
    ssr: false,
  }
);

export default function CommunitiesPage() {
  return (
    <>
      <Head>
        <title>Habla</title>
        <meta name="og:title" content="Communities" />
        <meta name="og:description" content="Browse moderated communities" />
      </Head>
      <Layout>
        <Communities />
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
