import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";

import { decodeNote } from "@habla/nostr";
import { useEvent } from "@habla/nostr/hooks";
import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
const EventId = dynamic(() => import("@habla/components/nostr/EventId"), {
  ssr: false,
});

export default function NotePage() {
  const router = useRouter();
  const { t } = useTranslation("common");

  const { note } = router.query;
  const id = decodeNote(note);

  const url = `https://habla.news/n/${note}`;
  const metadata = {
    title: t("habla"),
    summary: t("tagline"),
  };

  return (
    <>
      <Metadata url={url} metadata={metadata} />
      <Layout>{id && <EventId id={id} />}</Layout>
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
