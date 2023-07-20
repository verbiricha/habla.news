import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { useToast, Icon, Button } from "@chakra-ui/react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { CheckIcon } from "@chakra-ui/icons";

import { dateToUnix } from "@habla/time";
import { CONTACTS } from "@habla/const";
import {
  pubkeyAtom,
  followsAtom,
  tagsAtom,
  contactListAtom,
} from "@habla/state";
import { useNdk } from "@habla/nostr/hooks";

export function FollowTagButton({ tag }) {
  const { t } = useTranslation("common");
  const ndk = useNdk();
  const toast = useToast();
  const [user] = useAtom(pubkeyAtom);
  const [contactList, setContactList] = useAtom(contactListAtom);
  const [tags] = useAtom(tagsAtom);
  const following = tags.includes(tag);

  async function followTag() {
    try {
      const newFollows =
        contactList?.tags.length > 0
          ? [...contactList?.tags, ["t", tag]]
          : [["t", tag]];
      const newContacts = {
        kind: CONTACTS,
        created_at: dateToUnix(),
        content: contactList?.content || "",
        tags: newFollows,
      };
      setContactList(newContacts);
      const signed = new NDKEvent(ndk, newContacts);
      await signed.sign();
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
    ndk?.signer && (
      <Button
        isDisabled={following}
        variant="outline"
        leftIcon={following ? <Icon as={CheckIcon} color="green.400" /> : null}
        onClick={following ? null : followTag}
      >
        {t("follow")}
      </Button>
    )
  );
}

export default function FollowButton({ pubkey }) {
  const { t } = useTranslation("common");
  const ndk = useNdk();
  const toast = useToast();
  const [user] = useAtom(pubkeyAtom);
  const [contactList, setContactList] = useAtom(contactListAtom);
  const [follows] = useAtom(followsAtom);
  const following = follows.includes(pubkey);

  async function followPubkey() {
    try {
      const newFollows =
        contactList?.tags.length > 0
          ? [...contactList?.tags, ["p", pubkey, "wss://purplepag.es"]]
          : [["p", pubkey, "wss://purplepag.es"]];
      const newContacts = {
        kind: CONTACTS,
        created_at: dateToUnix(),
        content: contactList?.content || "",
        tags: newFollows,
      };
      setContactList(newContacts);
      const signed = new NDKEvent(ndk, newContacts);
      await signed.sign();
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
    ndk?.signer && (
      <Button
        isDisabled={following}
        variant="outline"
        leftIcon={following ? <Icon as={CheckIcon} color="green.400" /> : null}
        onClick={following ? null : followPubkey}
      >
        {t("follow")}
      </Button>
    )
  );
}
