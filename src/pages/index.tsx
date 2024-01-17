import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { Stack } from "@chakra-ui/react";

import Layout from "@habla/layouts/Layout";
import Hero from "@habla/components/Hero";
import HotTopics from "@habla/components/HotTopics";
import Metadata from "@habla/components/Metadata";
import Featured, { FeaturedAuthors } from "@habla/components/Featured";

const HomeFeeds = dynamic(() => import("@habla/components/HomeFeeds"), {
  ssr: false,
});

export default function Index() {
  const { t } = useTranslation("common");
  const url = "https://habla.news";
  const metadata = {
    title: t("habla"),
    summary: t("tagline"),
    image: "https://habla.news/family.png",
  };
  return (
    <>
      <Metadata url={url} metadata={metadata} />
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

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
