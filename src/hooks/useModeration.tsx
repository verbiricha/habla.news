import { useMemo, useCallback } from "react";

import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import { useToast } from "@chakra-ui/react";

import { mutedAtom, privateMutedAtom } from "@habla/state";
import { MUTED } from "@habla/const";
import { useNdk } from "@habla/nostr/hooks";
import { dateToUnix } from "@habla/time";
import { filterTagList } from "@habla/tags";
import type { Tag } from "@habla/types";

export default function useModeration() {
  const ndk = useNdk();
  const { t } = useTranslation("common");
  const toast = useToast();
  const [muted, setMuted] = useAtom(mutedAtom);
  const [privateMuted, setPrivateMuted] = useAtom(privateMutedAtom);
  const mutedTags = useMemo(() => {
    return muted?.tags || [];
  }, [muted]);
  const publicMutedWords = useMemo(() => {
    return filterTagList(mutedTags, "word");
  }, [muted, privateMuted]);
  const privateMutedWords = useMemo(() => {
    return filterTagList(privateMuted, "word");
  }, [muted, privateMuted]);
  const mutedWords = useMemo(() => {
    return publicMutedWords.concat(privateMutedWords);
  }, [publicMutedWords, privateMutedWords]);

  const isTagMuted = useCallback(
    (tag: Tag) => {
      const [name, value] = tag;
      const isPublicMute = muted?.tags.find(
        (t) => t.at(0) === name && t.at(1) === value
      );
      return Boolean(
        isPublicMute ||
          privateMuted.find((t) => t.at(0) === name && t.at(1) === value)
      );
    },
    [muted, privateMuted]
  );

  async function muteTag(tag: Tag, isPrivate: boolean) {
    const [name, value] = tag;
    const publicMutes = isPrivate ? mutedTags : mutedTags.concat([tag]);
    const privateMutes = isPrivate ? privateMuted.concat([tag]) : privateMuted;
    let encryptedContent = muted?.content || "";

    try {
      const user = await ndk.signer.user();
      encryptedContent = await ndk.signer.encrypt(
        user,
        JSON.stringify(privateMutes)
      );
    } catch (error) {
      console.error(error);
    }

    try {
      const ev = {
        kind: MUTED,
        tags: publicMutes,
        content: encryptedContent,
        created_at: dateToUnix(),
      };
      const ndkEvent = new NDKEvent(ndk, ev);
      await ndkEvent.sign();
      setMuted(ndkEvent.rawEvent());
      setPrivateMuted(privateMutes);
      await ndkEvent.publish();
      if (name === "p") {
        toast({
          title: t("muted"),
          description: t("person-muted", {
            value,
          }),
          status: "success",
        });
      } else if (name === "t") {
        toast({
          title: t("muted"),
          description: t("tag-muted", {
            value,
          }),
          status: "success",
        });
      } else if (name === "word") {
        toast({
          title: t("muted"),
          description: t("word-muted", {
            value,
          }),
          status: "success",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: t("server-error"),
        description: t("mute-fail"),
        status: "error",
      });
    }
  }

  async function unmuteTag(tag: Tag) {
    const [name, value] = tag;
    const publicMutes = mutedTags.filter(
      (t) => !(t.at(0) === name && t.at(1) === value)
    );
    const privateMutes = privateMuted.filter(
      (t) => !(t.at(0) === name && t.at(1) === value)
    );
    let encryptedContent = muted?.content || "";

    try {
      const user = await ndk.signer.user();
      encryptedContent = await ndk.signer.encrypt(
        user,
        JSON.stringify(privateMutes)
      );
    } catch (error) {
      console.error(error);
    }

    try {
      const ev = {
        kind: MUTED,
        tags: publicMutes,
        content: encryptedContent,
        created_at: dateToUnix(),
      };
      const ndkEvent = new NDKEvent(ndk, ev);
      await ndkEvent.sign();
      setMuted(ndkEvent.rawEvent());
      setPrivateMuted(privateMutes);
      await ndkEvent.publish();
      if (name === "p") {
        toast({
          title: t("unmuted"),
          description: t("person-unmuted", {
            value,
          }),
          status: "success",
        });
      } else if (name === "t") {
        toast({
          title: t("unmuted"),
          description: t("tag-unmuted", {
            value,
          }),
          status: "success",
        });
      } else if (name === "word") {
        toast({
          title: t("unmuted"),
          description: t("word-unmuted", {
            value,
          }),
          status: "success",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: t("server-error"),
        description: t("mute-fail"),
        status: "error",
      });
    }
  }

  return {
    mutedWords,
    publicMutedWords,
    privateMutedWords,
    isTagMuted,
    muteTag,
    unmuteTag,
  };
}
