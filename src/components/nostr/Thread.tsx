import { useAtom } from "jotai";
import { useColorMode } from "@chakra-ui/react";
import "zapthreads";
import { pubkeyAtom, relaysAtom } from "@habla/state";

export default function Thread({ anchor }) {
  const [loggedInPubkey] = useAtom(pubkeyAtom);
  const [defaultRelays] = useAtom(relaysAtom);
  const { colorMode } = useColorMode();

  return (
    <>
      <style>
        {colorMode == "light"
          ? `
            :root {
              --ztr-font: Inter;
              --ztr-font-size: 15px;
              --ztr-text-color: #2B2B2B;
              --ztr-textarea-color: #2B2B2B;
              --ztr-icon-color: #656565;
              --ztr-link-color:  #92379c;
              --ztr-login-button-color: var(--chakra-colors-orange-500);
              --ztr-background-color: rgba(0, 0, 0, 0.03);
            }
          `
          : `
            :root {
              --ztr-font: Inter;
              --ztr-font-size: 15px;
              --ztr-text-color: #dedede;
              --ztr-icon-color: #656565;
              --ztr-link-color: #e4b144;
              --ztr-login-button-color: #5e584b;
              --ztr-background-color: rgba(255, 255, 255, 0.05);
            }
          `}
      </style>
      <zap-threads
        anchor={anchor}
        pubkey={loggedInPubkey}
        relays={defaultRelays}
        disable-likes={true}
        disable-zaps={true}
        close-on-eose={true}
      />
    </>
  );
}
