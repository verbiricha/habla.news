import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
} from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import { useUser, useEvents } from "@habla/nostr/hooks";
import Highlight from "@habla/components/nostr/feed/Highlight";
import Markdown from "@habla/markdown/Markdown";

import User from "./User";
import LongFormNote from "./feed/LongFormNote";

export default function Profile({ pubkey, relays }) {
  const profile = useUser(pubkey);
  const { events } = useEvents(
    {
      kinds: [LONG_FORM, HIGHLIGHT],
      authors: [pubkey],
    },
    { relays, closeOnEose: false }
  );

  return (
    <>
      <Stack alignItems="center" spacing="2">
        <User
          pubkey={pubkey}
          relays={relays}
          size="xl"
          flexDirection="column"
        />
        {profile?.about && (
          <Prose textAlign="center">
            <Markdown content={profile?.about} />
          </Prose>
        )}
      </Stack>
      <Tabs key={pubkey} variant="soft-rounded" colorScheme="purple">
        <TabList>
          <Tab>Posts</Tab>
          <Tab>Highlights</Tab>
          <Tab isDisabled>Bookmarks</Tab>
          <Tab isDisabled>⚡ Zapped</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <Stack spacing="2">
              {events
                .filter((e) => e.kind === LONG_FORM && e.pubkey === pubkey)
                .map((e) => (
                  <LongFormNote key={e.id} event={e} excludeAuthor />
                ))}
            </Stack>
          </TabPanel>
          <TabPanel px={0}>
            <Stack spacing="2">
              {events
                .filter((e) => e.kind === HIGHLIGHT && e.pubkey === pubkey)
                .map((e) => (
                  <Highlight key={e.id} event={e} />
                ))}
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
