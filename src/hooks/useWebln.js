import { useEffect, useRef } from "react";

export default function useWebln(enable = true) {
  const maybeWebLn =
    useRef(typeof window !== "undefined" && "webln" in window ? window.webln : null)

  useEffect(() => {
    if (maybeWebLn.current && !maybeWebLn.current.enabled && enable) {
      const enable = async () => {
        await import('@getalby/bitcoin-connect-react')
        return maybeWebLn.current.enable().catch(() => console.debug("Couldn't enable WebLN"))
      }
      enable()
    }
  }, [enable]);

  return maybeWebLn.current;
}
