import Head from "next/head";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@habla/layouts/Layout";
import Omnibar from "@habla/components/Omnibar";

export default function Search() {
  return (
    <>
      <Head>
        <title>Search</title>
        <meta name="og:title" content="Search by URL, nostr id or term" />
      </Head>
      <Layout>
        <Omnibar />
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
