import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";

import { decodeNevent } from "@habla/nostr";
import { useEvent } from "@habla/nostr/hooks";
import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
const Thread = dynamic(() => import("@habla/components/nostr/Thread"), {
  ssr: false,
});
const NEvent = dynamic(() => import("@habla/components/nostr/NEvent"), {
  ssr: false,
});

export default function Nevent() {
  const router = useRouter();
  const { t } = useTranslation("common");

  const { nevent } = router.query;
  const { id, author, relays } = decodeNevent(nevent) ?? {};

  const url = `https://habla.news/e/${nevent}`
  const metadata = {
    title: t("habla"),
    summary: t("tagline"),
  };

  return (
    <>
      <Metadata url={url} metadata={metadata} />
      <Layout>
        {id && (
          <NEvent nevent={nevent} id={id} author={author} relays={relays} />
        )}
        <Thread anchor={nevent} />
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
