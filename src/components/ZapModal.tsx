import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";

import {
  useColorModeValue,
  useToast,
  Box,
  Button,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
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
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { NDKEvent } from "@nostr-dev-kit/ndk";

import { ZAP_REQUEST } from "@habla/const";
import useZapSplit from "@habla/hooks/useZapSplit";
import InputCopy from "@habla/components/InputCopy";
import { relaysAtom } from "@habla/state";
import { useNdk, useUser, useUsers } from "@habla/nostr/hooks";
import { loadService, loadInvoice } from "@habla/lnurl";
import { formatShortNumber, formatSats } from "@habla/format";
import User from "@habla/components/nostr/User";
import { getZapTags, getRelays } from "@habla/nip57";
import("@getalby/bitcoin-connect-react"); // enable NWC

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
    <Stack gap={2} width="100%">
      <Stack align="center">
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

export function ZapSplitModal({ event, isOpen, onClose }) {
  const ndk = useNdk();
  const toast = useToast();
  const { t } = useTranslation("common");
  const bg = useColorModeValue("white", "layer");
  const [defaultRelays] = useAtom(relaysAtom);
  const relays = getRelays(event) || defaultRelays;
  const [isFetchingInvoices, setIsFetchingInvoices] = useState(false);
  const [lnurls, setLnurls] = useState();
  const [canZap, setCanZap] = useState(false);
  const zapTags = useMemo(() => {
    return getZapTags(event);
  }, [event]);
  const recipients = useMemo(() => {
    return zapTags.map((t) => t.at(1));
  }, [event]);
  const isZapSplit = recipients.length > 0;
  const pubkeys = isZapSplit ? recipients : [event.pubkey];
  const profiles = useUsers(pubkeys);
  const hasAddresses = profiles?.length > 0 && profiles.every((p) => p.lud16);
  const [sats, setSats] = useState(defaultZapAmount);
  const split = useZapSplit(zapTags, sats);
  const [invoices, setInvoices] = useState();
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (isOpen && hasAddresses) {
      Promise.all(profiles.map((p) => loadService(p.lud16))).then((lnurls) => {
        setLnurls(lnurls);
        setCanZap(true);
      });
    } else {
      setCanZap(false);
    }
  }, [profiles, isOpen, hasAddresses]);

  async function zapRequest(p: string, zapAmount: number) {
    try {
      const amount = zapAmount * 1000;
      const zr = {
        kind: ZAP_REQUEST,
        created_at: Math.round(Date.now() / 1000),
        content: comment,
        tags: [
          ["p", p],
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
    setInvoices();
    setLnurls();
    onClose();
  }

  async function onZap() {
    try {
      setIsFetchingInvoices(true);
      const fetchedInvoices = await Promise.all(
        split.map(async ({ pubkey, gets }, idx) => {
          const zr = await zapRequest(pubkey, gets);
          return await loadInvoice(lnurls.at(idx), gets, comment, zr);
        })
      );
      const hasFetchedInvoices = fetchedInvoices.every((i) => i?.pr);

      if (!hasFetchedInvoices) {
        toast({
          title: "Could not get invoices",
          status: "error",
        });
        return;
      }

      if (window.webln) {
        try {
          await window.webln.enable();
          for (const i of fetchedInvoices) {
            await window.webln.sendPayment(i.pr);
          }
          toast({
            title: "⚡️ Zapped",
            description: `${sats} sats sent`,
            status: "success",
          });
          closeModal();
        } catch (error) {
          console.error(error);
          setInvoices(fetchedInvoices.map((i) => i.pr));
        }
      } else {
        setInvoices(fetchedInvoices.map((i) => i.pr));
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Could not get invoices",
        status: "error",
      });
    } finally {
      setIsFetchingInvoices(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent dir="auto" bg={bg}>
        <ModalHeader>
          <Stack direction="row" gap={1}>
            <Text fontFamily="'Inter'">Zap</Text>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="'Inter'">
          <Stack alignItems="center" minH="4rem">
            {!lnurls && !canZap && <Spinner />}
            {!lnurls && canZap && (
              <Alert
                status="warning"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="120px"
              >
                <AlertIcon />
                <AlertTitle>{t("cant-zap-title")}</AlertTitle>
                <AlertDescription maxWidth="sm">
                  {t("cant-zap")}
                </AlertDescription>
              </Alert>
            )}
            {lnurls && !invoices && (
              <>
                <SatSlider
                  minSendable={Math.max(...lnurls.map((l) => l.minSendable))}
                  maxSendable={Math.min(...lnurls.map((l) => l.maxSendable))}
                  onSelect={setSats}
                />
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comment (optional)"
                />
              </>
            )}
            {lnurls &&
              invoices &&
              invoices.map((invoice) => {
                return (
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
                );
              })}
            <Stack w="100%">
              {split.map(({ pubkey, gets, percentage }) => {
                return (
                  <Flex align="center" justifyContent="space-between">
                    <User key={pubkey} pubkey={pubkey} size="xs" />
                    <Flex
                      alignItems="flex-end"
                      flexDir="column"
                      justifyContent="flex-end"
                    >
                      <Text as="span" fontSize="md">
                        {formatShortNumber((percentage * 100).toFixed(0))}%
                      </Text>
                      <Text color="secondary" as="span" fontSize="sm">
                        {formatShortNumber(gets)}
                      </Text>
                    </Flex>
                  </Flex>
                );
              })}
            </Stack>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={closeModal}>
            {t("close")}
          </Button>
          <Button
            isDisabled={!lnurls || invoices}
            isLoading={isFetchingInvoices}
            colorScheme="orange"
            onClick={onZap}
          >
            {t("zap")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function SingleZapModal({ event, isOpen, onClose }) {
  const ndk = useNdk();
  const toast = useToast();
  const { t } = useTranslation("common");
  const bg = useColorModeValue("white", "layer");
  const [defaultRelays] = useAtom(relaysAtom);
  const relays = getRelays(event) || defaultRelays;
  const [isFetchingInvoice, setIsFetchingInvoice] = useState(false);
  const [lnurl, setLnurl] = useState();
  const [canZap, setCanZap] = useState(false);
  const [sats, setSats] = useState(defaultZapAmount);
  const [invoice, setInvoice] = useState();
  const [comment, setComment] = useState("");
  const profile = useUser(event.pubkey);

  useEffect(() => {
    if (isOpen && profile?.lud16) {
      loadService(profile.lud16).then((lnurl) => {
        setLnurl(lnurl);
        setCanZap(true);
      });
    } else {
      setCanZap(false);
    }
  }, [profile, isOpen]);

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
      if (!invoice?.pr) {
        toast({
          title: "Could not get invoice",
          status: "error",
        });
        return;
      }
      if (window.webln) {
        try {
          await window.webln.enable();
          await window.webln.sendPayment(invoice.pr);
          toast({
            title: "⚡️ Zapped",
            description: `${sats} sats sent to ${profile.lud16}`,
            status: "success",
          });
          closeModal();
        } catch (error) {
          console.error(error);
          setInvoice(invoice.pr);
        }
      } else {
        if (invoice?.pr) {
          setInvoice(invoice.pr);
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
      <ModalContent dir="auto" bg={bg}>
        <ModalHeader>
          <Stack direction="row" gap={1}>
            <Text fontFamily="'Inter'">Zap</Text>
            <User pubkey={event.pubkey} size="xs" />
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="'Inter'">
          <Stack alignItems="center" minH="4rem">
            {!lnurl && !canZap && <Spinner />}
            {!lnurl && canZap && (
              <Alert
                status="warning"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="120px"
              >
                <AlertIcon />
                <AlertTitle>{t("cant-zap-title")}</AlertTitle>
                <AlertDescription maxWidth="sm">
                  {t("cant-zap")}
                </AlertDescription>
              </Alert>
            )}
            {lnurl && !invoice && (
              <Stack spacing={2}>
                <SatSlider
                  minSendable={lnurl.minSendable}
                  maxSendable={lnurl.maxSendable}
                  onSelect={setSats}
                />
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comment (optional)"
                />
              </Stack>
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
            {t("close")}
          </Button>
          <Button
            isDisabled={!lnurl || invoice}
            isLoading={isFetchingInvoice}
            colorScheme="orange"
            onClick={onZap}
          >
            {t("zap")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function ZapModal({ event, isOpen, onClose }) {
  const zapTags = useMemo(() => {
    return getZapTags(event);
  }, [event]);
  const recipients = useMemo(() => {
    return zapTags.map((t) => t.at(1));
  }, [event]);
  const isZapSplit = recipients.length > 0;
  return isZapSplit ? (
    <ZapSplitModal
      event={event}
      zapTags={zapTags}
      isOpen={isOpen}
      onClose={onClose}
    />
  ) : (
    <SingleZapModal event={event} isOpen={isOpen} onClose={onClose} />
  );
}
