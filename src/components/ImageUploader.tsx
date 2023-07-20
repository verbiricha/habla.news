import { useState } from "react";
import { useTranslation } from "next-i18next";
import { Avatar } from "@chakra-ui/react";
import NostrAvatar from "@habla/components/nostr/Avatar";

interface ImageUploaderProps {
  onImageUpload: (img: string) => void;
}

export function ImageUploader(props: ImageUploaderProps) {
  const { t } = useTranslation("common");
  const [avatar, setAvatar] = useState();
  return (
    <>
      {avatar ? (
        <Avatar size="lg" src={avatar} />
      ) : (
        <NostrAvatar size="lg" pubkey={pubkey} />
      )}
      <Input
        placeholder={t("image-url")}
        value={avatar}
        onChange={(ev) => setAvatar(ev.target.value)}
      />
    </>
  );
}
