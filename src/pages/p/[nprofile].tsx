import { useRouter } from "next/router";
import { Helmet } from "react-helmet";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Text } from "@chakra-ui/react";

import Layout from "@habla/layouts/Wide";
import { decodeNpubOrNprofile } from "@habla/nostr";

const NProfile = dynamic(() => import("@habla/components/nostr/Profile"), {
  ssr: false,
});

export default function Profile({ metadata }) {
  const router = useRouter();
  const { nprofile } = router.query;
  const { pubkey, relays } = decodeNpubOrNprofile(nprofile) ?? {};
  const title = metadata?.name ?? "Habla";
  const description = metadata?.about ?? "Speak your mind";
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="og:description" content={description} />
        {metadata?.picture && (
          <meta name="og:image" content={metadata.picture} />
        )}
      </Helmet>
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

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
