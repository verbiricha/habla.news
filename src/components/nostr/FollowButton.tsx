import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { useToast, Icon, Button } from "@chakra-ui/react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { CheckIcon } from "@chakra-ui/icons";

import { dateToUnix } from "@habla/time";
import { CONTACTS, BOOKMARKS, COMMUNITIES } from "@habla/const";
import {
  pubkeyAtom,
  followsAtom,
  tagsAtom,
  communitiesAtom,
  contactListAtom,
} from "@habla/state";
import { useNdk } from "@habla/nostr/hooks";
import type { Tag } from "@habla/types";

export function FollowCommunityButton({ reference }) {
  const [tag, value] = reference;
  const { t } = useTranslation("common");
  const ndk = useNdk();
  const toast = useToast();
  const [user] = useAtom(pubkeyAtom);
  const [communities, setCommunities] = useAtom(communitiesAtom);
  const following = communities?.tags.find(
    (t) => t.at(0) === tag && t.at(1) === value
  );

  async function followCommunity() {
    try {
      const newFollows =
        communities?.tags.length > 0
          ? [...communities?.tags, [tag, value]]
          : [[tag, value]];
      const newContacts = {
        kind: COMMUNITIES,
        created_at: dateToUnix(),
        content: communities?.content || "",
        tags: newFollows,
      };
      const signed = new NDKEvent(ndk, newContacts);
      await signed.sign();
      setCommunities(newContacts);
      await ndk.publish(signed);
    } catch (error) {
      console.error(error);
      toast({
        title: "Could not sign event",
        status: "error",
      });
    }
  }

  async function unfollowCommunity() {
    try {
      const newFollows =
        communities?.tags.filter((t) => t.at(1) !== value) || [];
      const newContacts = {
        kind: COMMUNITIES,
        created_at: dateToUnix(),
        content: communities?.content || "",
        tags: newFollows,
      };
      const signed = new NDKEvent(ndk, newContacts);
      await signed.sign();
      setCommunities(newContacts);
      await ndk.publish(signed);
    } catch (error) {
      console.error(error);
      toast({
        title: "Could not sign event",
        status: "error",
      });
    }
  }

  return (
    <Button
      variant="outline"
      leftIcon={following ? <Icon as={CheckIcon} color="green.400" /> : null}
      onClick={following ? unfollowCommunity : followCommunity}
    >
      {following ? t("unfollow") : t("follow")}
    </Button>
  );
}

interface FollowReferenceButtonProps {
  reference: Tag;
}

export function FollowReferenceButton({
  reference,
  ...rest
}: FollowReferenceButtonProps) {
  const [tag, value] = reference;
  const { t } = useTranslation("common");
  const ndk = useNdk();
  const toast = useToast();
  const [user] = useAtom(pubkeyAtom);
  const [contactList, setContactList] = useAtom(contactListAtom);
  const following = contactList?.tags.find(
    (t) => t.at(0) === tag && t.at(1) === value
  );

  async function followReference() {
    if (!contactList || contactList?.tags.length === 0) {
      toast({
        title: "Could not find contact list",
        status: "error",
      });
      return;
    }
    try {
      const newFollows =
        contactList?.tags.length > 0
          ? [...contactList?.tags, [tag, value]]
          : [[tag, value]];
      const newContacts = {
        kind: CONTACTS,
        created_at: dateToUnix(),
        content: contactList?.content || "",
        tags: newFollows,
      };
      const signed = new NDKEvent(ndk, newContacts);
      await signed.sign();
      setContactList(newContacts);
      await ndk.publish(signed);
    } catch (error) {
      console.error(error);
      toast({
        title: "Could not sign event",
        status: "error",
      });
    }
  }

  async function unfollowReference() {
    if (!contactList || contactList?.tags.length === 0) {
      toast({
        title: "Could not find contact list",
        status: "error",
      });
      return;
    }
    try {
      const newFollows =
        contactList?.tags.filter(
          (t) => !(t.at(0) === tag && t.at(1) === value)
        ) || [];
      const newContacts = {
        kind: CONTACTS,
        created_at: dateToUnix(),
        content: contactList?.content || "",
        tags: newFollows,
      };
      const signed = new NDKEvent(ndk, newContacts);
      await signed.sign();
      setContactList(newContacts);
      await ndk.publish(signed);
    } catch (error) {
      console.error(error);
      toast({
        title: "Could not sign event",
        status: "error",
      });
    }
  }

  return (
    <Button
      variant="outline"
      leftIcon={following ? <Icon as={CheckIcon} color="green.400" /> : null}
      onClick={following ? unfollowReference : followReference}
      {...rest}
    >
      {following ? t("unfollow") : t("follow")}
    </Button>
  );
}

export function FollowAddressButton({ address, ...rest }) {
  return <FollowReferenceButton reference={["a", address]} {...rest} />;
}

export function FollowTagButton({ tag, ...rest }) {
  return <FollowReferenceButton reference={["t", tag]} {...rest} />;
}

export function FollowEvent({ id, ...rest }) {
  return <FollowReferenceButton reference={["e", id]} {...rest} />;
}

export function FollowURL({ href, ...rest }) {
  return <FollowReferenceButton reference={["r", href]} {...rest} />;
}

export default function FollowButton({ pubkey, ...rest }) {
  return <FollowReferenceButton reference={["p", pubkey]} {...rest} />;
}
