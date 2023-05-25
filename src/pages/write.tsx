import Head from "next/head";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Text } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { pubkeyAtom } from "@habla/state";
import Layout from "@habla/layouts/Wide";

const Write = dynamic(() => import("@habla/components/Write"), {
  ssr: false,
});

export default function WritePage() {
  const [pubkey] = useAtom(pubkeyAtom);
  return (
    <>
      <Head>
        <title>Habla</title>
        <meta name="og:title" content="Habla" />
        <meta name="og:description" content="Speak your mind" />
      </Head>
      <Layout>
        {!pubkey && <Text>Log in to write</Text>}
        {pubkey && <Write pubkey={pubkey} />}
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
