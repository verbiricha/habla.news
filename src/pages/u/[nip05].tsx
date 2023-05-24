import dynamic from "next/dynamic";

import { Text } from "@chakra-ui/react";
import { nip05 } from "nostr-tools";

import Layout from "@habla/layouts/Wide";

const NProfile = dynamic(() => import("@habla/components/nostr/Profile"), {
  ssr: false,
});

export default function Profile({ pubkey, relays }) {
  return (
    <Layout>
      <NProfile key={pubkey} pubkey={pubkey} relays={relays} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  pubkey: string;
  relays: string[];
}> = async ({ query }) => {
  const props = await nip05.queryProfile(query.nip05);
  if (props) {
    return { props };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
};
