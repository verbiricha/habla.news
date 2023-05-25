import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@habla/layouts/Wide";

const TagFeeds = dynamic(() => import("@habla/components/TagFeeds"), {
  ssr: false,
});

export default function TagPage() {
  const router = useRouter();
  const { tag } = router.query;
  return (
    <>
      <Head>
        <title>Hashtag: {tag}</title>
      </Head>
      <Layout>{tag && <TagFeeds tag={tag} />}</Layout>
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
