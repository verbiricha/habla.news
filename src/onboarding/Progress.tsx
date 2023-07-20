import { useRouter } from "next/router";
import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  Text,
  Icon,
  Progress as BaseProgress,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";

import HeartsIcon from "@habla/icons/Hearts";
import KeyIcon from "@habla/icons/Key";
import ContentIcon from "@habla/icons/Content";
import RelayIcon from "@habla/icons/Relay";
import ZapIcon from "@habla/icons/Zap";
import VideoIcon from "@habla/icons/Video";
import { pubkeyAtom } from "@habla/state";
import NostrAvatar from "@habla/components/nostr/Avatar";
import { OnboardingProgress, stepsAtom } from "@habla/onboarding/state";

function Sticker({ bg, icon, size }) {
  return (
    <Flex
      height={size}
      width={size}
      alignItems="center"
      justifyContent="center"
      bg={bg}
      borderRadius="24px"
    >
      <Icon
        as={icon}
        boxSize={{
          base: 5,
          sm: 6,
        }}
      />
    </Flex>
  );
}

function ProgressSection({
  icon,
  bg,
  title,
  descr,
  cta,
  ctaAction,
  more,
  moreAction,
  isFinished,
}) {
  const size = {
    base: "42px",
    sm: "64px",
  };
  return (
    <Flex alignItems="flex-start" gap={8} py={4}>
      <Box height={size} width={size}>
        <Sticker size={size} icon={icon} bg={bg} />
      </Box>
      <Stack overflow="wrap">
        <Heading fontSize="2xl">{title}</Heading>
        <Text fontSize="sm">{descr}</Text>
        <Stack maxW="200px">
          {cta && (
            <Button
              leftIcon={isFinished && <Icon as={CheckIcon} color="green.300" />}
              variant={isFinished ? "outline" : "dark"}
              size="xs"
              onClick={ctaAction}
            >
              {cta}
            </Button>
          )}
          {more && (
            <Text
              cursor="pointer"
              onClick={moreAction}
              color="highlight"
              fontSize="xs"
            >
              {more}
            </Text>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
}

function BriefIntro() {
  const { t } = useTranslation("onboarding");
  return (
    <ProgressSection
      title={t("brief-intro")}
      descr={t("brief-intro-descr")}
      icon={HeartsIcon}
      bg="rgba(217, 51, 151, 0.10)"
    />
  );
}

function Backup({ isFinished }) {
  const { t } = useTranslation("onboarding");
  const router = useRouter();
  return (
    <ProgressSection
      isFinished={isFinished}
      title={t("backup-keys")}
      descr={t("backup-keys-descr")}
      cta={t("backup-keys-cta")}
      ctaAction={() =>
        router.push(`/onboarding/backup`, null, { shallow: true })
      }
      icon={KeyIcon}
      bg="rgba(51, 107, 217, 0.10)"
    />
  );
}

function FillYourProfile({ isFinished }) {
  const { t } = useTranslation("onboarding");
  const router = useRouter();
  return (
    <ProgressSection
      isFinished={isFinished}
      title={t("fill-profile")}
      descr={t("fill-profile-descr")}
      cta={t("fill-profile-cta")}
      ctaAction={() =>
        router.push(`/onboarding/profile`, null, { shallow: true })
      }
      icon={ContentIcon}
      bg="rgba(51, 207, 217, 0.10)"
    />
  );
}

function AddRelays({ isFinished }) {
  const { t } = useTranslation("onboarding");
  const router = useRouter();
  return (
    <ProgressSection
      isFinished={isFinished}
      title={t("add-relays")}
      descr={t("add-relays-descr")}
      cta={t("add-relays-cta")}
      ctaAction={() =>
        router.push(`/onboarding/relays`, null, { shallow: true })
      }
      more={t("add-relays-more")}
      moreAction={() => router.push("/tony/1680693703323")}
      icon={RelayIcon}
      bg="rgba(94, 51, 217, 0.10)"
    />
  );
}

function DiscoverZaps({ isFinished }) {
  const { t } = useTranslation("onboarding");
  const router = useRouter();
  return (
    <ProgressSection
      isFinished={isFinished}
      title={t("discover-zaps")}
      descr={t("discover-zaps-descr")}
      cta={t("discover-zaps-cta")}
      ctaAction={() => router.push(`/onboarding/zaps`, null, { shallow: true })}
      more={t("discover-zaps-more")}
      moreAction={() => router.push("/tony/1684221922877")}
      icon={ZapIcon}
      bg="rgba(217, 121, 51, 0.10)"
    />
  );
}

function getProgress(s: OnboardingProgress): number {
  const values = Object.values(s);
  const done = values.filter((s) => s);
  return 100 * (done.length / values.length);
}

export default function Progress() {
  const [pubkey] = useAtom(pubkeyAtom);
  const [steps] = useAtom(stepsAtom);
  const { t } = useTranslation("onboarding");
  const progress = getProgress(steps);
  const percentage = Math.floor(progress);

  return (
    <Card variant="elevated" mb={10}>
      <CardBody py={5} px={6}>
        <Stack gap={4}>
          <Flex alignItems="flex-start" gap={4} mb={5}>
            {pubkey && <NostrAvatar pubkey={pubkey} size="lg" />}
            <Stack flex={1}>
              <Flex alignItems="center" gap={2}>
                <Heading fontSize="2xl">{t("profile-progress")}</Heading>
                <Heading fontSize="2xl">{percentage}%</Heading>
              </Flex>
              <BaseProgress colorScheme="orange" value={percentage} h={2} />
            </Stack>
          </Flex>
          <Stack>
            <Backup isFinished={steps["backup-keys"]} />
            <FillYourProfile isFinished={steps["fill-profile"]} />
            <AddRelays isFinished={steps["add-relays"]} />
            <DiscoverZaps isFinished={steps["discover-zaps"]} />
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
}
