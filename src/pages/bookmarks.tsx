import Head from "next/head";
import dynamic from "next/dynamic";

import { useAtom } from "jotai";

import { pubkeyAtom } from "@habla/state";
import Layout from "@habla/layouts/Wide";

const Bookmarks = dynamic(() => import("@habla/components/nostr/Bookmarks"), {
  ssr: false,
});

export default function BookmarksPage() {
  const [pubkey] = useAtom(pubkeyAtom);
  return (
    <>
      <Head>
        <title>Bookmarks</title>
        <meta name="og:title" content="Habla" />
        <meta name="og:description" content="Speak your mind" />
      </Head>
      <Layout>{pubkey && <Bookmarks pubkey={pubkey} />}</Layout>
    </>
  );
}
