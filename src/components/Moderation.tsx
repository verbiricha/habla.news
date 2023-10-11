import { useMemo, useState } from "react";
import {
  Stack,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Divider,
  Heading,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useAtom, useAtomValue } from "jotai";

import User from "@habla/components/nostr/User";
import { mutedAtom, privateMutedAtom } from "@habla/state";
import type { Pubkey } from "@habla/types";
import { findTags, filterTagList } from "@habla/tags";
import useModeration from "@habla/hooks/useModeration";

interface MuteProps {
  placeholder: string;
  onMute: (v: string, isPrivate: boolean) => void;
}

function Mute({ tag, placeholder, onMute }) {
  const { t } = useTranslation("common");
  const [value, setValue] = useState("");
  const [muteType, setMuteType] = useState("public");

  function onClick() {
    onMute([tag, value], muteType === "private");
    setValue("");
  }

  return (
    <Flex gap={2}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
      />
      <Select maxW="7rem" onChange={(ev) => setMuteType(ev.target.value)}>
        <option value="public">{t("public")}</option>
        <option value="private">{t("private")}</option>
      </Select>
      <Button
        isDisabled={!value || value.trim().length === 0}
        colorScheme="orange"
        onClick={onClick}
      >
        {t("add")}
      </Button>
    </Flex>
  );
}

function TagList({ children }) {
  return (
    <Flex flexWrap="wrap" gap={2}>
      {children}
    </Flex>
  );
}

export default function Moderation() {
  const { t } = useTranslation("common");
  const [muted, setMuted] = useAtom(mutedAtom);
  const [privateMuted, setPrivateMuted] = useAtom(privateMutedAtom);
  const { publicMutedWords, privateMutedWords, muteTag, unmuteTag } =
    useModeration();

  // public
  const mutedTags = useMemo(() => {
    return muted ? findTags(muted, "t") : [];
  }, [muted]);
  const mutedPeople = useMemo(() => {
    return muted ? findTags(muted, "p") : [];
  }, [muted]);

  // private
  const privMutedTags = useMemo(() => {
    return filterTagList(privateMuted, "t");
  }, [privateMuted]);
  const privMutedPeople = useMemo(() => {
    return filterTagList(privateMuted, "p");
  }, [privateMuted]);
  const privMutedWords = useMemo(() => {
    return filterTagList(privateMuted, "word");
  }, [privateMuted]);

  return (
    <Stack gap={3} mb={6}>
      <Heading>{t("moderation")}</Heading>
      <Text>{t("moderation-descr")}</Text>
      <Heading fontSize="3xl">{t("people")}</Heading>
      {mutedPeople.length === 0 && (
        <Text color="secondary" fontSize="sm">
          {t("no-people")}
        </Text>
      )}
      <TagList>
        {mutedPeople.map((t) => {
          return (
            <Tag key={t}>
              <TagLabel>
                <User size="xs" fontSize="xs" pubkey={t} />
              </TagLabel>
              <TagCloseButton onClick={() => unmuteTag(["p", t])} />
            </Tag>
          );
        })}
      </TagList>
      <Heading fontSize="xl">{t("private-people")}</Heading>
      {privMutedPeople.length === 0 && (
        <Text color="secondary" fontSize="sm">
          {t("no-private-people")}
        </Text>
      )}
      <TagList>
        {privMutedPeople.map((t) => {
          return (
            <Tag key={t}>
              <TagLabel>
                <User size="xs" fontSize="xs" pubkey={t} />
              </TagLabel>
              <TagCloseButton onClick={() => unmuteTag(["p", t], true)} />
            </Tag>
          );
        })}
      </TagList>
      <Divider />
      <Heading fontSize="3xl">{t("tags")}</Heading>
      {mutedTags.length === 0 && (
        <Text color="secondary" fontSize="sm">
          {t("no-tags")}
        </Text>
      )}
      <TagList>
        {mutedTags.map((t) => {
          return (
            <Tag key={t}>
              <TagLabel>{t}</TagLabel>
              <TagCloseButton onClick={() => unmuteTag(["t", t])} />
            </Tag>
          );
        })}
      </TagList>
      <Heading fontSize="xl">{t("private-tags")}</Heading>
      {privMutedTags.length === 0 && (
        <Text color="secondary" fontSize="sm">
          {t("no-private-tags")}
        </Text>
      )}
      <TagList>
        {privMutedTags.map((t) => {
          return (
            <Tag key={t}>
              <TagLabel>{t}</TagLabel>
              <TagCloseButton onClick={() => unmuteTag(["t", t], true)} />
            </Tag>
          );
        })}
      </TagList>
      <Mute placeholder={t("mute-tag")} tag="t" onMute={muteTag} />
      <Divider />
      <Heading fontSize="3xl">{t("words")}</Heading>
      {publicMutedWords.length === 0 && (
        <Text color="secondary" fontSize="sm">
          {t("no-words")}
        </Text>
      )}
      <TagList>
        {publicMutedWords.map((t) => {
          return (
            <Tag key={t}>
              <TagLabel>{t}</TagLabel>
              <TagCloseButton onClick={() => unmuteTag(["word", t])} />
            </Tag>
          );
        })}
      </TagList>
      <Heading fontSize="xl">{t("private-words")}</Heading>
      {privMutedWords.length === 0 && (
        <Text color="secondary" fontSize="sm">
          {t("no-private-words")}
        </Text>
      )}
      <TagList>
        {privMutedWords.map((t) => {
          return (
            <Tag key={t}>
              <TagLabel>{t}</TagLabel>
              <TagCloseButton onClick={() => unmuteTag(["word", t], true)} />
            </Tag>
          );
        })}
      </TagList>
      <Mute placeholder={t("mute-word")} tag="word" onMute={muteTag} />
    </Stack>
  );
}
