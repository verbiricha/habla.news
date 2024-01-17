import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Heading } from "@chakra-ui/react";

import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
const Relays = dynamic(() => import("@habla/components/nostr/Relays"), {
  ssr: false,
});

export default function RelaysPage() {
  const { t } = useTranslation("common");
  const url = "https://habla.news/relays";
  const metadata = {
    title: t("relays"),
  };
  return (
    <>
      <Metadata url={url} metadata={metadata} />
      <Layout>
        <Heading>Relays</Heading>
        <Relays />
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
