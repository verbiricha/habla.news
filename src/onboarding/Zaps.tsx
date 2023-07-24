import { useRouter } from "next/router";
import { useAtom } from "jotai";

import { pubkeyAtom } from "@habla/state";
import { stepsAtom } from "@habla/onboarding/state";
import { useUser } from "@habla/nostr/hooks";
import ZapsSettings from "@habla/components/nostr/ZapsSettings";

export default function DiscoverZaps() {
  const [pubkey] = useAtom(pubkeyAtom);
  const [steps, setSteps] = useAtom(stepsAtom);
  const profile = useUser(pubkey);
  const router = useRouter();

  async function onSave() {
    setSteps({ ...steps, "discover-zaps": true });
    await router.push("/onboarding");
  }

  async function onCancel() {
    setSteps({ ...steps, "discover-zaps": true });
    await router.back();
  }

  return (
    <>
      {profile?.id && (
        <ZapsSettings profile={profile} onCancel={onCancel} onSave={onSave} />
      )}
    </>
  );
}
