import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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

export const getServerSideProps = async ({ locale, query }) => {
  const props = await nip05.queryProfile(query.nip05);
  if (props) {
    return {
      props: {
        ...props,
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
};
