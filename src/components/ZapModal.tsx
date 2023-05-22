import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

import {
  useColorModeValue,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { NDKEvent } from "@nostr-dev-kit/ndk";

import { ZAP_REQUEST } from "@habla/const";
import useWebln from "@habla/hooks/useWebln";
import InputCopy from "@habla/components/InputCopy";
import { relaysAtom } from "@habla/state";
import { useNdk, useUser } from "@habla/nostr/hooks";
import { loadService, loadInvoice } from "@habla/lnurl";
import { formatShortNumber } from "@habla/format";
import User from "@habla/components/nostr/User";

const QrCode = dynamic(() => import("@habla/components/QrCode"), {
  ssr: false,
});

function valueToEmoji(sats) {
  if (sats < 420) {
    return "👍";
  } else if (sats === 420) {
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
  } else if (sats < 1500000) {
    return "🤯";
  } else {
    return "🏆";
  }
}

const defaultZapAmount = 21;

function SatSlider({ minSendable, maxSendable, onSelect }) {
  const [amount, setAmount] = useState(defaultZapAmount);
  const [showTooltip, setShowTooltip] = useState(false);
  const min = Math.max(1, Math.floor(minSendable / 1000));
  const max = Math.min(Math.floor(maxSendable / 1000), 2e6);
  const amounts = [
    defaultZapAmount,
    1_000,
    5_000,
    10_000,
    20_000,
    50_000,
    100_000,
    1_000_000,
    2_000_000,
  ];

  function selectAmount(a) {
    setAmount(a);
    onSelect(a);
  }

  function onInputChange(changed) {
    const v = Number(changed);
    if (changed < min) {
      selectAmount(min);
    } else if (changed > max) {
      selectAmount(max);
    } else {
      selectAmount(changed);
    }
  }

  return (
    <Stack gap={1} width="100%">
      <Stack align="center" gap={2}>
        <Heading sx={{ fontFeatureSettings: '"tnum"' }}>
          {formatShortNumber(amount)}
        </Heading>
      </Stack>
      <Flex flexWrap="wrap" gap={3}>
        {amounts
          .filter((a) => a >= min && a <= max)
          .map((a) => (
            <Button
              key={a}
              flexGrow="1"
              colorScheme={amount === a ? "orange" : "gray"}
              onClick={() => selectAmount(a)}
            >
              {valueToEmoji(a)} {formatShortNumber(a)}
            </Button>
          ))}
      </Flex>
      <NumberInput
        defaultValue={defaultZapAmount}
        value={amount}
        min={min}
        max={max}
        onChange={onInputChange}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Stack>
  );
}

export default function ZapModal({ event, isOpen, onClose }) {
  const ndk = useNdk();
  const toast = useToast();
  const [relays] = useAtom(relaysAtom);
  const [isFetchingInvoice, setIsFetchingInvoice] = useState(false);
  const webln = useWebln(isOpen);
  const [lnurl, setLnurl] = useState();
  const profile = useUser(event.pubkey);
  const [invoice, setInvoice] = useState();
  const [comment, setComment] = useState("");
  const [sats, setSats] = useState(defaultZapAmount);
  const bg = useColorModeValue("white", "layer");

  useEffect(() => {
    if (isOpen && profile?.lud16) {
      loadService(profile.lud16).then(setLnurl);
    }
  }, [event, profile, isOpen]);

  async function zapRequest() {
    try {
      const amount = sats * 1000;
      const zr = {
        kind: ZAP_REQUEST,
        created_at: Math.round(Date.now() / 1000),
        content: comment,
        tags: [
          ["p", event.pubkey],
          event.tagReference(),
          ["amount", String(amount)],
          ["relays", ...relays],
        ],
      };
      const signed = new NDKEvent(ndk, zr);
      await signed.sign();
      return signed.toNostrEvent();
    } catch (error) {
      console.error("Could not create zap request");
    }
  }

  function closeModal() {
    setSats(defaultZapAmount);
    setComment();
    setInvoice();
    setLnurl();
    onClose();
  }

  async function onZap() {
    try {
      setIsFetchingInvoice(true);
      const zr = await zapRequest();
      const invoice = await loadInvoice(lnurl, sats, comment, zr);
      if (webln?.enabled && invoice?.pr) {
        try {
          await webln.sendPayment(invoice.pr);
          toast({
            title: "⚡️ Zapped",
            description: `${sats} sats sent to ${profile.lud16}`,
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
      console.error(error);
      toast({
        title: "Could not get invoice",
        status: "error",
      });
    } finally {
      setIsFetchingInvoice(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent bg={bg}>
        <ModalHeader>
          <Stack direction="row" gap={1}>
            <Text fontFamily="'Inter'">Zap</Text>
            <User pubkey={event.pubkey} size="xs" />
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="'Inter'">
          <Stack alignItems="center" minH="4rem">
            {!lnurl && <Spinner />}
            {lnurl && !invoice && (
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
            {lnurl && invoice && (
              <>
                <Box cursor="pointer">
                  <QrCode data={invoice} link={`lightning:${invoice}`} />
                </Box>
                <Stack>
                  <InputCopy text={invoice} />
                  <Button
                    colorScheme="orange"
                    onClick={() => window.open(`lightning:${invoice}`)}
                  >
                    Open in wallet
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={closeModal}>
            Close
          </Button>
          <Button
            isDisabled={!lnurl || invoice}
            isLoading={isFetchingInvoice}
            colorScheme="orange"
            onClick={onZap}
          >
            Zap
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
