import { useAtomValue } from "jotai";
import { sessionAtom } from "@habla/state";
import { stepsAtom } from "@habla/onboarding/state";

export function useIsOnboarding() {
  const session = useAtomValue(sessionAtom);
  const privkey = session?.privkey;
  const steps = useAtomValue(stepsAtom);
  const hasFinishedOnboarding = Object.values(steps).every((t) => t);
  return Boolean(privkey) && !hasFinishedOnboarding;
}

export function useNeedsBackup() {
  const steps = useAtomValue(stepsAtom);
  const isOnboarding = useIsOnboarding();
  return isOnboarding && !steps["backup-keys"];
}
