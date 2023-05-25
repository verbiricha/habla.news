import dynamic from "next/dynamic";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Heading } from "@chakra-ui/react";

import Layout from "@habla/layouts/Wide";

const Relays = dynamic(() => import("@habla/components/nostr/Relays"), {
  ssr: false,
});

export default function RelaysPage() {
  return (
    <>
      <Head>
        <title>Relays</title>
      </Head>
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
