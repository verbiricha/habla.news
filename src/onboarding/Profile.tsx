import { useRouter } from "next/router";
import { useAtom } from "jotai";

import { pubkeyAtom } from "@habla/state";
import { stepsAtom } from "@habla/onboarding/state";
import { useUser } from "@habla/nostr/hooks";
import ProfileEditor from "@habla/components/nostr/ProfileEditor";

export default function Profile() {
  const [pubkey] = useAtom(pubkeyAtom);
  const [steps, setSteps] = useAtom(stepsAtom);
  const profile = useUser(pubkey);
  const router = useRouter();

  async function onSave() {
    setSteps({ ...steps, "fill-profile": true });
    await router.push("/onboarding");
  }

  async function onCancel() {
    setSteps({ ...steps, "fill-profile": true });
    await router.back();
  }

  return (
    <>
      {profile?.id && (
        <ProfileEditor profile={profile} onCancel={onCancel} onSave={onSave} />
      )}
    </>
  );
}
