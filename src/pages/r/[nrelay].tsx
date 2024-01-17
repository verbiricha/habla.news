import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Text } from "@chakra-ui/react";

import { decodeNrelay } from "@habla/nostr";
import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
const Relay = dynamic(() => import("@habla/components/nostr/Relay"), {
  ssr: false,
});

export default function RelayPage({ relay }) {
  const router = useRouter();
  const metadata = {
    title: relay,
  };
  return (
    <>
      <Metadata metadata={metadata} />
      <Layout>
        <Relay key={relay} relay={relay} />
      </Layout>
    </>
  );
}

export async function getServerSideProps({ query, locale }) {
  const relay = decodeNrelay(query.nrelay);
  if (relay) {
    return {
      props: {
        relay,
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
}
