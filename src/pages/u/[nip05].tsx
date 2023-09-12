import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Text } from "@chakra-ui/react";
import { nip05 } from "nostr-tools";

import Layout from "@habla/layouts/Wide";

const NProfile = dynamic(() => import("@habla/components/nostr/NostrAddress"), {
  ssr: false,
});

export default function Profile({ nip05 }) {
  return (
    <Layout>
      <NProfile query={nip05} key={nip05} />
    </Layout>
  );
}

export const getServerSideProps = async ({ locale, query }) => {
  return {
    props: {
      ...query,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
