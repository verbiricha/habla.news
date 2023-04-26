import Head from "next/head";
import dynamic from "next/dynamic";

import Layout from "@habla/layouts/Layout";
import Hero from "@habla/components/Hero";

const HomeFeeds = dynamic(() => import("@habla/components/HomeFeeds"), {
  ssr: false,
});

export default function Index() {
  return (
    <>
      <Head>
        <title>Habla</title>
        <meta name="og:title" content="Habla" />
        <meta name="og:description" content="Speak your mind" />
      </Head>
      <Layout hero>
        <HomeFeeds />
      </Layout>
    </>
  );
}
