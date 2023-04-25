import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";

import pool, { defaultRelays } from "@habla/pool";
import { decodeNaddr } from "@habla/nostr";
import { getMetadata } from "@habla/nip23";
import Layout from "@habla/layouts/Layout";

const Address = dynamic(() => import("@habla/components/nostr/Address"), {
  ssr: false,
});

export default function Article({ metadata }) {
  const { title, summary, image } = metadata ?? {
    title: "Habla",
    summary: "Speak your mind",
  };
  const router = useRouter();
  const { naddr } = router.query;
  const { kind, identifier, pubkey, relays } = decodeNaddr(naddr) ?? {};
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="og:description" content={summary} />
        {image && <meta name="og:image" content={image} />}
      </Head>
      <Layout>
        {kind && (
          <Address
            kind={kind}
            identifier={identifier}
            pubkey={pubkey}
            relays={relays}
            naddr={naddr}
          />
        )}
      </Layout>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { naddr } = query;
  const { kind, identifier, pubkey, relays } = decodeNaddr(naddr);
  const event = await pool.get([...relays, ...defaultRelays], {
    kinds: [kind],
    authors: [pubkey],
    "#d": [identifier],
  });
  const metadata = getMetadata(event);
  return {
    props: {
      metadata,
    },
  };
}
