import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { nip05, nip19 } from "nostr-tools";

import Layout from "@habla/layouts/Wide";

const Address = dynamic(() => import("@habla/components/nostr/Address"), {
  ssr: false,
});

export default function Profile({ pubkey, relays, identifier }) {
  const naddr = nip19.naddrEncode({ pubkey, relays, identifier });
  return (
    <Layout>
      <Address
        kind={30023}
        identifier={identifier}
        pubkey={pubkey}
        relays={relays}
        naddr={naddr}
      />
    </Layout>
  );
}

export const getServerSideProps = async ({ locale, query }) => {
  const profile = await nip05.queryProfile(query.nip05);
  const identifier = query.slug;
  const props = { ...profile, identifier };
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
