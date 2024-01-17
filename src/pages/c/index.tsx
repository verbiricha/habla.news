import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
const Communities = dynamic(
  () => import("@habla/components/nostr/Communities"),
  {
    ssr: false,
  }
);

export default function CommunitiesPage() {
  const { t } = useTranslation("common");
  const url = "https://habla.news/c";
  const metadata = {
    title: t("communities"),
    summary: t("communities-summary"),
  };
  return (
    <>
      <Metadata url={url} metadata={metadata} />
      <Layout>
        <Communities />
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
