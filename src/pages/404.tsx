import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@habla/layouts/Wide";
import NotFound from "@habla/components/NotFound";

export default function Error() {
  const { t } = useTranslation("common");
  return (
    <>
      <Head>
        <title>{t("oops")}</title>
        <meta name="og:title" content={t("habla")} />
        <meta name="og:description" content={t("tagline")} />
      </Head>
      <Layout>
        <NotFound />
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
