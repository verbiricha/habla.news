import { useAtom } from "jotai";
import { privkeyAtom } from "@habla/state";
import { stepsAtom } from "@habla/onboarding/state";

export function useIsOnboarding() {
  const [privkey] = useAtom(privkeyAtom);
  const [steps] = useAtom(stepsAtom);
  const hasFinishedOnboarding = Object.values(steps).every((t) => t);
  return Boolean(privkey) && !hasFinishedOnboarding;
}

export function useNeedsBackup() {
  const [steps] = useAtom(stepsAtom);
  const isOnboarding = useIsOnboarding();
  return isOnboarding && !steps["backup-keys"];
}
