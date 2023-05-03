import Head from "next/head";
import dynamic from "next/dynamic";
import { Stack } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import Markdown from "@habla/markdown/Markdown";
import Layout from "@habla/layouts/Layout";
import { getHandles, getPubkey, getProfile } from "@habla/nip05";
import User from "@habla/components/User";

const UserContent = dynamic(
  () => import("@habla/components/nostr/UserContent"),
  {
    ssr: false,
  }
);

export default function Profile({ handle, pubkey, profile, relays = [] }) {
  return (
    <>
      <Head>
        <title>{profile?.name || handle}</title>
        <meta name="og:title" content={profile?.name || handle} />
        <meta name="og:type" content="profile" />
        <meta name="og:description" content={profile?.about} />
        {profile?.picture && <meta name="og:image" content={profile.picture} />}
      </Head>
      <Layout>
        <Stack alignItems="center" spacing="2">
          <User
            pubkey={pubkey}
            user={profile}
            size="xl"
            flexDirection="column"
          />
          {profile?.about && <Markdown content={profile?.about} />}
        </Stack>
        <UserContent pubkey={pubkey} />
      </Layout>
    </>
  );
}

export async function getStaticProps(context) {
  const { handle } = context.params;
  const pubkey = await getPubkey(handle);
  const profile = await getProfile(pubkey);
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
