import Head from "next/head";
import dynamic from "next/dynamic";

import pool, { defaultRelays } from "@habla/pool";
import Layout from "@habla/layouts/Layout";
import { decodeNpubOrNprofile } from "@habla/nostr";

const NProfile = dynamic(() => import("@habla/components/nostr/Profile"), {
  ssr: false,
});

export default function Profile({ pubkey, relays, metadata }) {
  return (
    <>
      <Head>
        <title>{metadata?.display_name}</title>
        <meta name="og:title" content={metadata?.display_name} />
        <meta name="og:description" content={metadata?.about} />
        {metadata?.picture && (
          <meta name="og:image" content={metadata.picture} />
        )}
      </Head>
      <Layout>
        <NProfile pubkey={pubkey} relays={relays} />
      </Layout>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { nprofile } = query;
  const { pubkey, relays } = decodeNpubOrNprofile(nprofile) ?? {};
  if (!pubkey) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
      props: {},
    };
  }
  const event = await pool.get([...relays, ...defaultRelays], {
    kinds: [0],
    authors: [pubkey],
  });
  const metadata = event ? JSON.parse(event.content) : {};
  return {
    props: {
      metadata,
      pubkey,
      relays,
    },
  };
}
