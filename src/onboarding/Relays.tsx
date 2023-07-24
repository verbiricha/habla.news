import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { relayListAtom } from "@habla/state";
import { stepsAtom } from "@habla/onboarding/state";
import RelayEditor from "@habla/components/nostr/RelayEditor";

export default function Relays() {
  const router = useRouter();
  const [relayList] = useAtom(relayListAtom);
  const [steps, setSteps] = useAtom(stepsAtom);

  async function onSave() {
    setSteps({ ...steps, "add-relays": true });
    await router.push("/onboarding");
  }

  async function onCancel() {
    setSteps({ ...steps, "add-relays": true });
    await router.back();
  }

  return (
    <>
      <RelayEditor relayList={relayList} onCancel={onCancel} onSave={onSave} />
    </>
  );
}
