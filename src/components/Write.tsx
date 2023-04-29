import { useState } from "react";
import { useAtom } from "jotai";

import {
  Flex,
  Button,
  IconButton,
  Heading,
  Menu,
  MenuDivider,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
} from "@chakra-ui/react";
import { AddIcon, HamburgerIcon, ViewIcon, EditIcon } from "@chakra-ui/icons";

import { getMetadata } from "@habla/nip23";
import { LONG_FORM, LONG_FORM_DRAFT } from "@habla/const";
import { pubkeyAtom } from "@habla/state";
import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";
import Editor from "@habla/markdown/Editor";

export default function Write() {
  const [pubkey] = useAtom(pubkeyAtom);
  const [showPreview, setShowPreview] = useState(false);
  const [event, setEvent] = useState();
  const { events } = useEvents(
    {
      kinds: [LONG_FORM, LONG_FORM_DRAFT],
      authors: [pubkey],
    },
    {
      cacheUsage: "PARALLEL",
    }
  );
  const posts = events.filter((e) => e.kind === LONG_FORM);
  const published = posts.map((e) => getMetadata(e).identifier);
  const drafts = events.filter(
    (e) =>
      e.kind === LONG_FORM_DRAFT &&
      !published.includes(getMetadata(e).identifier)
  );
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        {showPreview ? (
          <IconButton
            icon={<EditIcon />}
            size="lg"
            aria-label="Edit"
            onClick={() => setShowPreview(false)}
            variant="outline"
          />
        ) : (
          <IconButton
            icon={<ViewIcon />}
            size="lg"
            aria-label="Preview"
            onClick={() => setShowPreview(true)}
            variant="outline"
          />
        )}
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
          />
          <MenuList>
            <MenuItem icon={<AddIcon />} onClick={() => setEvent()}>
              New
            </MenuItem>
            <MenuDivider />
            {drafts.length > 0 && (
              <MenuGroup title="Drafts">
                {drafts.map((d) => (
                  <MenuItem onClick={() => setEvent(d)}>
                    {getMetadata(d).title}
                  </MenuItem>
                ))}
              </MenuGroup>
            )}
            <MenuDivider />
            <MenuGroup title="Posts">
              {posts.map((p) => (
                <MenuItem onClick={() => setEvent(p)}>
                  {getMetadata(p).title}
                </MenuItem>
              ))}
            </MenuGroup>
          </MenuList>
        </Menu>
      </Flex>
      <Editor key={event?.id} showPreview={showPreview} event={event} />
    </>
  );
}
