import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { useToast, Icon, Button } from "@chakra-ui/react";
import { NDKEvent } from "habla-ndk";
import { CheckIcon } from "@chakra-ui/icons";

import { dateToUnix } from "@habla/time";
import { CONTACTS } from "@habla/const";
import { pubkeyAtom, followsAtom } from "@habla/state";
import { useNdk } from "@habla/nostr/hooks";

export default function FollowButton({ pubkey }) {
  const { t } = useTranslation("common");
  const ndk = useNdk();
  const toast = useToast();
  const [user] = useAtom(pubkeyAtom);
  const [follows, setFollows] = useAtom(followsAtom);
  const following = follows.includes(pubkey);

  async function followPubkey() {
    try {
      const contacts = await ndk.fetchEvent({
        kinds: [CONTACTS],
        authors: [user],
      });
      const newFollows = [...contacts.tags, ["p", pubkey]];
      const newContacts = {
        kind: CONTACTS,
        created_at: dateToUnix(),
        content: contacts.content,
        tags: newFollows,
      };
      const signed = new NDKEvent(ndk, newContacts);
      await signed.sign();
      await ndk.publish(signed);
      setFollows(newFollows.map((t) => t.at(1)));
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
      isDisabled={following}
      variant="outline"
      leftIcon={following ? <Icon as={CheckIcon} color="green.400" /> : null}
      onClick={following ? null : followPubkey}
    >
      {t("follow")}
    </Button>
  );
}
