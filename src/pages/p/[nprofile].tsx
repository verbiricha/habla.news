import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";

import { Text } from "@chakra-ui/react";

import Layout from "@habla/layouts/Layout";
import { decodeNpubOrNprofile } from "@habla/nostr";

const NProfile = dynamic(() => import("@habla/components/nostr/Profile"), {
  ssr: false,
});

export default function Profile({ metadata }) {
  const router = useRouter();
  const { nprofile } = router.query;
  const { pubkey, relays } = decodeNpubOrNprofile(nprofile) ?? {};
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
        {!pubkey ? (
          <Text>Could not find user</Text>
        ) : (
          <NProfile key={pubkey} pubkey={pubkey} relays={relays} />
        )}
      </Layout>
    </>
  );
}
