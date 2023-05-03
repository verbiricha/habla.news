import Head from "next/head";
import dynamic from "next/dynamic";

import Layout from "@habla/layouts/Layout";
import { getHandles, getPubkey, getProfile } from "@habla/nip05";

const NProfile = dynamic(() => import("@habla/components/nostr/Profile"), {
  ssr: false,
});

export default function Profile({ handle, pubkey, profile, relays = [] }) {
  return (
    <>
      <Head>
        <title>{profile?.name || handle}</title>
        <meta name="og:title" content={profile?.name || handle} />
        <meta name="og:description" content={profile?.about} />
        {profile?.picture && <meta name="og:image" content={profile.picture} />}
      </Head>
      <Layout>
        <NProfile key={pubkey} pubkey={pubkey} relays={relays} />
      </Layout>
    </>
  );
}

export async function getStaticProps(context) {
  const { handle } = context.params;
  const pubkey = await getPubkey(handle);
  const profile = await getProfile(handle);
  return {
    props: {
      handle,
      pubkey,
      profile,
    },
  };
}

export async function getStaticPaths() {
  const handles = await getHandles();
  const paths = handles.map((handle) => {
    return {
      params: { handle },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
