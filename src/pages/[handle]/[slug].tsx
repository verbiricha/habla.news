import Head from "next/head";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { NDKEvent } from "@nostr-dev-kit/ndk";

import { getHandles, getPubkey, getHandle } from "@habla/nip05";
import { getPost, getPosts } from "@habla/db";
import { useNdk } from "@habla/nostr/hooks";
import { getMetadata } from "@habla/nip23";
import Layout from "@habla/layouts/Wide";
import LongFormNote from "@habla/components/nostr/LongFormNote";

export default function Post({ event }) {
  const { title, summary, image } = getMetadata(event);
  const ndk = useNdk();
  const ev = new NDKEvent(ndk, event);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta name="og:description" content={summary} />
        {image && <meta name="og:image" content={image} />}
      </Head>
      <Layout>
        <LongFormNote event={ev} />
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale, params }) {
  const { handle, slug } = params;
  const pubkey = await getPubkey(handle);
  const event = await getPost(pubkey, slug);
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      event,
    },
  };
}

export async function getStaticPaths() {
  const handles = await getHandles();
  const pathLists = await Promise.all(
    handles.map(async (handle) => {
      const pubkey = await getPubkey(handle);
      const articles = await getPosts(pubkey);
      const slugs = articles.map((e) => {
        return getMetadata(e).identifier;
      });
      return slugs
        .filter((slug) => slug)
        .map((slug) => {
          return { params: { handle, slug } };
        });
    })
  );
  const paths = pathLists.flat();

  return {
    paths,
    fallback: false,
  };
}
