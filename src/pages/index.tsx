import Head from "next/head";
import dynamic from "next/dynamic";

import { Stack } from "@chakra-ui/react";

import Layout from "@habla/layouts/Layout";
import Hero from "@habla/components/Hero";
import HotTopics from "@habla/components/HotTopics";
import Featured, { FeaturedAuthors } from "@habla/components/Featured";

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
      <Layout
        aside={
          <Stack spacing={8} display={["none", "none", "block"]}>
            <Hero />
            <Featured />
            <HotTopics />
            <FeaturedAuthors />
          </Stack>
        }
      >
        <HomeFeeds />
      </Layout>
    </>
  );
}
