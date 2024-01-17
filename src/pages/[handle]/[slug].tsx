import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { NDKEvent } from "@nostr-dev-kit/ndk";

import { getHandles, getPubkey } from "@habla/nip05";
import { getProfile, getPost, getPosts } from "@habla/db";
import { useNdk } from "@habla/nostr/hooks";
import { getMetadata } from "@habla/nip23";
import { articleURL } from "@habla/urls";
import Layout from "@habla/layouts/Wide";
import LongFormNote from "@habla/components/nostr/LongFormNote";
import Metadata from "@habla/components/Metadata";

const HablaPost = dynamic(() => import("@habla/components/nostr/HablaPost"), {
  ssr: false,
});

export default function Post({ pubkey, profile, slug, event }) {
  const router = useRouter();

  if (router.isFallback) {
    return <span>Loading...</span>;
  }

  if (!event) {
    return (
      <Layout>
        <HablaPost pubkey={pubkey} slug={slug} />
      </Layout>
    );
  }

  const url = `https://habla.news${articleURL(slug, pubkey, profile, true)}`;
  const metadata = getMetadata(event);
  const ndk = useNdk();
  const ev = new NDKEvent(ndk, event);
  return (
    <>
      <Metadata url={url} metadata={metadata} type="article" />
      <Layout>
        <LongFormNote event={ev} />
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale, params }) {
  const { handle, slug } = params;
  const pubkey = getPubkey(handle);
  if (!pubkey) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const event = await getPost(pubkey, slug);
  const profile = await getProfile(pubkey);
  return {
    props: {
      profile,
      pubkey,
      slug,
      event,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export async function getStaticPaths() {
  const handles = getHandles();
  const pathLists = await Promise.all(
    handles.map(async (handle) => {
      const pubkey = getPubkey(handle);
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
    fallback: "blocking",
  };
}
