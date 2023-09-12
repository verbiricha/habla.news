import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { nip05, nip19 } from "nostr-tools";

import Layout from "@habla/layouts/Wide";

const Nip05Address = dynamic(
  () => import("@habla/components/nostr/Nip05Address"),
  {
    ssr: false,
  }
);

export default function Profile({ nip05, slug }) {
  return (
    <Layout>
      <Nip05Address identifier={slug} query={nip05} />
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
