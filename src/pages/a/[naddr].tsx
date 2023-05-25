import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Helmet } from "react-helmet";
import dynamic from "next/dynamic";
import { Text, Box } from "@chakra-ui/react";

import { decodeNaddr } from "@habla/nostr";
import { getMetadata } from "@habla/nip23";
import Layout from "@habla/layouts/Wide";

const UserCard = dynamic(() => import("@habla/components/nostr/UserCard"), {
  ssr: false,
});

const Address = dynamic(() => import("@habla/components/nostr/Address"), {
  ssr: false,
});

export default function Article({ metadata }) {
  const router = useRouter();
  const { naddr } = router.query;
  const { title, summary, image } = metadata ?? {
    title: "Habla",
    summary: "Speak your mind",
  };
  const { kind, identifier, pubkey, relays } = decodeNaddr(naddr) ?? {};
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta name="og:description" content={summary} />
        {image && <meta name="og:image" content={image} />}
      </Helmet>
      <Layout>
        {kind ? (
          <>
            <Address
              kind={kind}
              identifier={identifier}
              pubkey={pubkey}
              relays={relays}
              naddr={naddr}
            />
            <UserCard pubkey={pubkey} />
          </>
        ) : null}
      </Layout>
    </>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
