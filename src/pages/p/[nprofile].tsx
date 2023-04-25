import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";

import pool, { defaultRelays } from "@habla/pool";
import Layout from "@habla/layouts/Layout";
const Feed = dynamic(() => import("@habla/components/nostr/Feed"), {
  ssr: false,
});
const NProfile = dynamic(() => import("@habla/components/nostr/Profile"), {
  ssr: false,
});

import { decodeNpubOrNprofile } from "@habla/nostr";

export default function Profile({ metadata }) {
  console.log("META", metadata);
  const router = useRouter();
  const { nprofile } = router.query;
  const { pubkey, relays } = decodeNpubOrNprofile(nprofile) ?? {};
  return (
    <>
      <Head>
        <title>{metadata.display_name}</title>
        <meta name="og:title" content={metadata.display_name} />
        <meta name="og:description" content={metadata.about} />
        {metadata.picture && (
          <meta name="og:image" content={metadata.picture} />
        )}
      </Head>
      <Layout>{pubkey && <NProfile pubkey={pubkey} relays={relays} />}</Layout>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { nprofile } = query;
  const { pubkey, relays } = decodeNpubOrNprofile(nprofile);
  const event = await pool.get([...relays, ...defaultRelays], {
    kinds: [0],
    authors: [pubkey],
  });
  const metadata = JSON.parse(event.content);
  return {
    props: {
      metadata,
    },
  };
}
