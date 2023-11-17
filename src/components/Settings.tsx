import { useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import { useToast, Heading, Stack } from "@chakra-ui/react";

import { pubkeyAtom, relayListAtom } from "@habla/state";
import { useUser } from "@habla/nostr/hooks";
import RelayEditor from "@habla/components/nostr/RelayEditor";
import ProfileEditor from "@habla/components/nostr/ProfileEditor";
import ZapsSettings from "@habla/components/nostr/ZapsSettings";
import Tabs from "@habla/components/Tabs";

export default function Settings() {
  const { t } = useTranslation("common");
  const pubkey = useAtomValue(pubkeyAtom);
  const relayList = useAtomValue(relayListAtom);
  const profile = useUser(pubkey);
  const toast = useToast();

  async function onSave() {
    toast({
      title: t("profile-saved"),
    });
  }

  async function onRelaysSave() {
    toast({
      title: t("relays-saved"),
    });
  }

  const tabs = [
    {
      name: t("profile"),
      panel: <ProfileEditor skipText profile={profile} onSave={onSave} />,
    },
    {
      name: t("relays"),
      panel: (
        <RelayEditor
          skipText
          relayList={relayList}
          profile={profile}
          onSave={onRelaysSave}
        />
      ),
    },
    {
      name: t("wallet"),
      panel: <ZapsSettings skipText profile={profile} onSave={onSave} />,
    },
  ];

  return (
    <>
      <Heading>{t("settings")}</Heading>
      {profile?.created_at && <Tabs tabs={tabs} />}
    </>
  );
}
