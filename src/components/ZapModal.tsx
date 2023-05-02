// todo: QR
import { useState, useEffect } from "react";

import {
  useToast,
  Box,
  Button,
  Heading,
  Text,
  Spinner,
  Flex,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { useAtom } from "jotai";

import useWebln from "@habla/hooks/useWebln";
import { relaysAtom } from "@habla/state";
import { useUser } from "@habla/nostr/hooks";
import { loadService, loadInvoice } from "@habla/lnurl";
import { formatShortNumber } from "@habla/format";
import User from "@habla/components/nostr/User";

function valueToEmoji(sats) {
  if (sats === 420) {
    return "😏";
  } else if (sats <= 1000) {
    return "🤙";
  } else if (sats <= 5000) {
    return "💜";
  } else if (sats <= 10000) {
    return "😻";
  } else if (sats <= 20000) {
    return "🤩";
  } else if (sats <= 50000) {
    return "🌶️";
  } else if (sats <= 600000) {
    return "🚀";
  } else if (sats < 1000000) {
    return "🔥";
  } else {
    return "🤯";
  }
}

function SatSlider({ minSendable, maxSendable, onSelect }) {
  const [sliderValue, setSliderValue] = useState(minSendable);
  const [showTooltip, setShowTooltip] = useState(false);

  const min = Math.max(1, Math.floor(minSendable / 1000));
  const max = Math.min(Math.floor(maxSendable / 1000), 2e6);

  function onInputChange(e) {
    const v = Number(e.target.value);
    if (v >= min && v <= max) {
      setSliderValue(v);
      onSelect(v);
    }
  }

  return (
    <>
      <Stack align="center" gap={2}>
        <Text fontSize="2xl">{valueToEmoji(sliderValue)}</Text>
        <Heading sx={{ fontFeatureSettings: '"tnum"' }}>
          {formatShortNumber(sliderValue)}
        </Heading>
      </Stack>
      <Slider
        id="slider"
        defaultValue={minSendable}
        min={min}
        max={max}
        colorScheme="orange"
        value={sliderValue}
        focusThumbOnChange={false}
        onChange={(v) => setSliderValue(v)}
        onChangeEnd={onSelect}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Input
        value={sliderValue}
        type="number"
        min={min}
        max={max}
        onChange={onInputChange}
      />
    </>
  );
}

export default function ZapModal({ event, isOpen, onClose }) {
  const toast = useToast();
  const [relays] = useAtom(relaysAtom);
  const webln = useWebln(isOpen);
  const [lnurl, setLnurl] = useState();
  const profile = useUser(event.pubkey);
  const [invoice, setInvoice] = useState();
  const [comment, setComment] = useState("");
  const [sats, setSats] = useState();

  useEffect(() => {
    if (isOpen && profile.lud16) {
      loadService(profile.lud16).then(setLnurl);
    }
  }, [event, profile, isOpen]);

  async function zapRequest() {
    try {
      const amount = sats * 1000;
      const zr = {
        kind: 9734,
        created_at: Math.round(Date.now() / 1000),
        content: comment,
        tags: [
          ["p", event.pubkey],
          event.tagReference(),
          ["amount", String(amount)],
          ["relays", ...relays],
        ],
      };
      return await window.nostr.signEvent(zr);
    } catch (error) {
      console.error("Could not create zap request");
    }
  }

  function closeModal() {
    setComment();
    setSats();
    setInvoice();
    setLnurl();
    onClose();
  }

  async function onZap() {
    try {
      const zr = await zapRequest();
      const invoice = await loadInvoice(lnurl, sats, comment, zr);
      if (webln?.enabled) {
        try {
          await webln.sendPayment(invoice.pr);
          toast({
            title: "Paid",
            status: "success",
          });
          closeModal();
        } catch (error) {
          setInvoice(invoice.pr);
        }
      } else {
        if (invoice?.pr) {
          setInvoice(invoice.pr);
        } else {
          toast({
            title: "Could not get invoice",
            status: "error",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Could not get invoice",
        status: "error",
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Stack direction="row" gap={1}>
            <Text>Zap</Text>
            <User pubkey={event.pubkey} size="xs" />
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack alignItems="center" minH="4rem">
            {!lnurl && <Spinner />}
            {lnurl && (
              <>
                <SatSlider
                  minSendable={lnurl.minSendable}
                  maxSendable={lnurl.maxSendable}
                  onSelect={setSats}
                />
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  type="text"
                  placeholder="Comment (optional)"
                />
              </>
            )}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={closeModal}>
            Close
          </Button>
          <Button isDisabled={!lnurl} colorScheme="orange" onClick={onZap}>
            Zap
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
