import { useMemo } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Flex, Stack } from "@chakra-ui/react";
import { NDKEvent } from "@nostr-dev-kit/ndk";

import Markdown from "@habla/markdown/Markdown";
import Metadata from "@habla/components/Metadata";
import Layout from "@habla/layouts/Wide";
import User from "@habla/components/User";
import { getHandles, getPubkey } from "@habla/nip05";
import { getProfile, getEvents } from "@habla/db";
import { useNdk } from "@habla/nostr/hooks";
import { ProfileHeading } from "@habla/components/nostr/Profile";
import UserContent from "@habla/components/nostr/UserContent";
import {
  LONG_FORM,
  HIGHLIGHT,
  SUPPORT,
  BOOKMARKS,
  deprecatedBookmarkLists,
} from "@habla/const";

export default function Profile({
  handle,
  pubkey,
  profile,
  events,
  relays = [],
}) {
  const ndk = useNdk();
  const ndkEvents = useMemo(
    () =>
      events
        .filter((e) => [LONG_FORM, HIGHLIGHT].includes(e.kind))
        .map((e) => new NDKEvent(ndk, e)),
    [events]
  );
  const supporters = useMemo(() => {
    return events
      .filter((e) => e.kind === SUPPORT && e.pubkey !== pubkey)
      .map((e) => new NDKEvent(ndk, e));
  }, [events]);
  const supporting = useMemo(() => {
    return events
      .filter((e) => e.kind === SUPPORT && e.pubkey === pubkey)
      .map((e) => new NDKEvent(ndk, e));
  }, [events]);
  const bookmarks = useMemo(() => {
    return events
      .filter((e) => e.kind === BOOKMARKS)
      .map((e) => new NDKEvent(ndk, e))
      .filter((e) => !deprecatedBookmarkLists.has(e.tagValue("d")));
  }, [events]);

  const url = `https://habla.news/${handle}`;
  const metadata = {
    title: profile?.name || handle || pubkey,
    summary: profile?.about,
    image: profile?.picture,
  };

  return (
    <>
      <Metadata type="profile" url={url} metadata={metadata} />
      <Layout>
        <ProfileHeading
          profile={profile}
          pubkey={pubkey}
          relays={relays}
          supports={supporting}
          supporters={supporters}
        />
        <UserContent events={ndkEvents} pubkey={pubkey} bookmarks={bookmarks} />
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale, params }) {
  const { handle } = params;
  const pubkey = getPubkey(handle);
  const events = await getEvents(pubkey);
  const profile = await getProfile(pubkey);
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      handle,
      pubkey,
      events,
      profile,
    },
  };
}

export async function getStaticPaths() {
  const handles = getHandles();
  const paths = handles.map((handle) => {
    return {
      params: { handle },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
