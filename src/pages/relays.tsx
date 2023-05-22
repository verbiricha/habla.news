import dynamic from "next/dynamic";
import Head from "next/head";

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
        <Relays />
      </Layout>
    </>
  );
}
