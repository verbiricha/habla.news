import { useMemo } from "react";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";

import {
  Flex,
  Box,
  Stack,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Progress,
  Icon,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { useEvents } from "@habla/nostr/hooks";
import User from "@habla/components/nostr/User";
import { RecommendedAppMenu } from "@habla/components/nostr/UnknownKind";
import {
  formatRemainingTime,
  formatShortNumber,
  formatSats,
} from "@habla/format";
import { ZAP } from "@habla/const";
import { useZapsSummary } from "@habla/hooks/useZapsSummary";
import { pubkeyAtom, relaysAtom } from "@habla/state";
import { getRelays, getZapTags } from "@habla/nip57";
import ZapModal from "@habla/components/ZapModal";

export default function Goal({ event }) {
  const { t } = useTranslation("common");
  const zapModal = useDisclosure();
  const [pubkey] = useAtom(pubkeyAtom);
  const [defaultRelays] = useAtom(relaysAtom);
  const relays = useMemo(() => {
    return getRelays(event) || defaultRelays;
  }, [event]);
  const closedAt = useMemo(() => {
    const ts = event.tagValue("closed_at");
    return ts && Number(ts) * 1000;
  }, [event]);
  const isExpired = closedAt && closedAt < Date.now();
  const url = useMemo(() => event.tagValue("r"), [event]);
  const description = useMemo(() => event.tagValue("summary"), [event]);
  const amount = useMemo(
    () => Number(event.tagValue("amount")) / 1000,
    [event]
  );
  const time = closedAt
    ? {
        until: closedAt,
      }
    : {};
  const { events: zapEvents } = useEvents(
    {
      kinds: [ZAP],
      "#e": [event.id],
      ...time,
    },
    {
      relays,
      closeOnEose: isExpired,
    }
  );
  const { zappers, total } = useZapsSummary(zapEvents, pubkey);
  const progress = (total / amount) * 100;
  const isAchieved = progress >= 100;
  const zapTags = useMemo(() => {
    return getZapTags(event);
  }, [event]);
  const beneficiaries = zapTags.map((t) => t.at(1));
  const totalWeight =
    zapTags.length > 0
      ? zapTags.reduce((acc, t) => {
          return acc + Number(t.at(3) ?? "");
        }, 0)
      : 0;
  return (
    <>
      <Card sx={isExpired ? { opacity: 0.5 } : {}}>
        <CardHeader>
          <Flex align="flex-start" justifyContent="space-between">
            <Stack>
              {event.content.length > 0 && (
                <Heading fontSize="xl" style={{ margin: 0, marginBottom: 3 }}>
                  {event.content}
                </Heading>
              )}
              {closedAt && (
                <Text
                  fontFamily="sans-serif"
                  as="span"
                  color="secondary"
                  fontSize="xs"
                >
                  {isExpired && t("ended")}
                  {!isExpired && `${t("ends")} `}
                  {!isExpired && formatRemainingTime(closedAt)}
                </Text>
              )}
            </Stack>
            <RecommendedAppMenu event={event} />
          </Flex>
          <User size="xs" fontSize="md" pubkey={event.pubkey} />
        </CardHeader>
        <CardBody fontFamily="'Inter', serif">
          <Stack>
            {description && <Text>{description}</Text>}
            {url && (
              <Flex align="center" gap={2}>
                <Icon as={ExternalLinkIcon} boxSize={3} color="gray.500" />
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </Flex>
            )}
            <Flex justifyContent="space-between" my={3}>
              <Text as="span">{formatSats(total)}</Text>
              <Text
                as="span"
                sx={
                  isAchieved
                    ? { color: "green.500" }
                    : {
                        color: progress === 0 ? "secondary" : "primary",
                      }
                }
              >
                {isAchieved
                  ? "100"
                  : progress === 0
                  ? "0"
                  : progress.toFixed(2)}
                %
              </Text>
              <Text as="span">{formatSats(amount)}</Text>
            </Flex>
            <Progress value={progress} colorScheme="green" />
            {zapTags.length > 0 && (
              <Stack mt={2} spacing={2}>
                {zapTags.map((t) => {
                  const [, pk, relay, weight] = t;
                  const percentage = Number(weight) / totalWeight;
                  const gotten = zappers
                    .filter((z) =>
                      z.tags.find((t) => t.at(0) === "p" && t.at(1) === pk)
                    )
                    .reduce((acc, z) => acc + z.amount, 0);
                  return (
                    <Flex w="100%" justifyContent="space-between" key={pk}>
                      <User pubkey={pk} />
                      <Flex
                        alignItems="flex-end"
                        flexDir="column"
                        justifyContent="flex-end"
                      >
                        <Text as="span" fontSize="xl">
                          {formatShortNumber((percentage * 100).toFixed(0))}%
                        </Text>
                        <Text color="secondary" as="span" fontSize="sm">
                          {gotten !== 0 && formatSats(gotten)}
                        </Text>
                      </Flex>
                    </Flex>
                  );
                })}
              </Stack>
            )}
          </Stack>
        </CardBody>
        <CardFooter>
          <Button ml="auto" colorScheme="orange" onClick={zapModal.onOpen}>
            {t("contribute")}
          </Button>
        </CardFooter>
      </Card>
      <ZapModal event={event} {...zapModal} />
    </>
  );
}
