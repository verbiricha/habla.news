import Head from "next/head";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Text } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { pubkeyAtom } from "@habla/state";
import Layout from "@habla/layouts/Wide";

const Studio = dynamic(() => import("@habla/components/Studio"), {
  ssr: false,
});

export default function StudioPage() {
  const [pubkey] = useAtom(pubkeyAtom);
  return (
    <>
      <Head>
        <title>Habla</title>
        <meta name="og:title" content="Habla" />
        <meta name="og:description" content="Speak your mind" />
      </Head>
      <Layout>{pubkey && <Studio pubkey={pubkey} />}</Layout>
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
