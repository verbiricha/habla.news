import { useEffect } from "react";

export default function useWebln(enable = true) {
  const maybeWebLn =
    typeof window !== "undefined" && "webln" in window ? window.webln : null;

  useEffect(() => {
    if (maybeWebLn && !maybeWebLn.enabled && enable) {
      maybeWebLn.enable().catch(() => {
        console.debug("Couldn't enable WebLN");
      });
    }
  }, [maybeWebLn, enable]);

  return maybeWebLn;
}
