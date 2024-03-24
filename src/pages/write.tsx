import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Text } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import { pubkeyAtom, sessionAtom } from "@habla/state";
import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
const Write = dynamic(() => import("@habla/components/Write"), {
  ssr: false,
});

export default function WritePage() {
  const { t } = useTranslation("common");
  const url = "https://habla.news/write";
  const metadata = {
    title: t("habla"),
    summary: t("tagline"),
  };
  const pubkey = useAtomValue(pubkeyAtom);
  const session = useAtomValue(sessionAtom);
  const isReadOnly = session?.method === "pubkey";

  return (
    <>
      <Metadata url={url} metadata={metadata} />
      <Layout>
        {(!pubkey || isReadOnly) && <Text>{t("read-only")}</Text>}
        {pubkey && <Write pubkey={pubkey} />}
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
