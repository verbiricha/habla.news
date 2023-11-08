import { VoidApi } from "@void-cat/api";
import { useState } from "react";
import { useTranslation } from "next-i18next";

import { useToast, Input, Avatar } from "@chakra-ui/react";

import NostrAvatar from "@habla/components/nostr/Avatar";
import { FILE_EXT_REGEX } from "@habla/const";

type UploadResult = {
  url?: string;
  error?: string;
};

// void.cat

const voidCatHost = "https://void.cat";
const voidCatApi = new VoidApi(voidCatHost);

async function voidCatUpload(file: File | Blob): Promise<UploadResult> {
  const uploader = voidCatApi.getUploader(file);

  const rsp = await uploader.upload({
    "V-Strip-Metadata": "true",
  });
  if (rsp.ok) {
    let ext = file.name.match(FILE_EXT_REGEX);
    if (rsp.file?.metadata?.mimeType === "image/webp") {
      ext = ["", "webp"];
    }
    const resultUrl =
      rsp.file?.metadata?.url ??
      `${voidCatHost}/d/${rsp.file?.id}${ext ? `.${ext[1]}` : ""}`;

    const ret = {
      url: resultUrl,
    } as UploadResult;

    return ret;
  } else {
    return {
      error: rsp.errorMessage,
    };
  }
}

interface ImageUploaderProps {
  pubkey: string;
  onImageUpload: (img: string) => void;
}

export default function ImageUploader({ pubkey, onImageUpload }) {
  const { t } = useTranslation("common");
  const [avatar, setAvatar] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  async function onFileChange(ev) {
    const file = ev.target.files[0];
    if (file) {
      try {
        setIsUploading(true);
        const upload = await uploadImage(file, "void.cat");
        if (upload.url) {
          setAvatar(upload.url);
          onImageUpload(upload.url);
          toast({
            status: "success",
            title: t("file-uploaded"),
          });
        }
        if (upload.error) {
          toast({
            status: "error",
            title: upload.error,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    }
  }

  function uploadImage(file, provider) {
    // todo: multiple providers
    return voidCatUpload(file);
  }

  return (
    <>
      {avatar ? (
        <Avatar size="xl" src={avatar} />
      ) : (
        <NostrAvatar size="xl" pubkey={pubkey} />
      )}
      <Input isDisabled={isUploading} type="file" onChange={onFileChange} />
    </>
  );
}
