import Head from "next/head";
import dynamic from "next/dynamic";

import { NDKEvent } from "@nostr-dev-kit/ndk";

import {
  getHandles,
  getPubkey,
  getHandle,
  getPost,
  getPosts,
} from "@habla/nip05";
import { useNdk } from "@habla/nostr/hooks";
import { getMetadata } from "@habla/nip23";
import Layout from "@habla/layouts/Layout";

const LongFormNote = dynamic(
  () => import("@habla/components/nostr/LongFormNote"),
  {
    ssr: false,
  }
);

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

export async function getStaticProps({ params }) {
  const { handle, slug } = params;
  const pubkey = await getPubkey(handle);
  const event = await getPost(pubkey, slug);
  return {
    props: { event },
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
      return slugs.map((slug) => {
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
