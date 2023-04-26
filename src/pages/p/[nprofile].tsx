import Head from "next/head";
import dynamic from "next/dynamic";

import pool, { defaultRelays } from "@habla/pool";
import Layout from "@habla/layouts/Layout";
import { decodeNpubOrNprofile } from "@habla/nostr";

const NProfile = dynamic(() => import("@habla/components/nostr/Profile"), {
  ssr: false,
});

export default function Profile({ pubkey, relays, metadata }) {
  const title = metadata?.display_name ?? "Habla";
  const description = metadata?.about ?? "Speak your mind";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="og:description" content={description} />
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
