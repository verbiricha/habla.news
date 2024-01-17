import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@habla/layouts/Wide";
import NotFound from "@habla/components/NotFound";
import Metadata from "@habla/components/Metadata";

export default function Error() {
  const { t } = useTranslation("common");
  const metadata = {
    title: t("oops"),
    summary: t("tagline"),
  };
  return (
    <>
      <Metadata metadata={metadata} />
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
