import { useCallback } from "react";

import { Image } from "@chakra-ui/react";
import Link from "next/link";

// eslint-disable-next-line no-useless-escape
const FileExtensionRegex = /\.([\w]+)$/i;

export default function HyperText({ link, children }) {
  const render = useCallback(() => {
    try {
      const url = new URL(link);
      const extension =
        FileExtensionRegex.test(url.pathname.toLowerCase()) && RegExp.$1;
      if (extension) {
        switch (extension) {
          case "gif":
          case "jpg":
          case "jpeg":
          case "png":
          case "bmp":
          case "webp": {
            return (
              <Image
                src={url.toString()}
                alt={url.toString()}
                maxH="420px"
                width="100%"
                objectFit="contain"
              />
            );
          }
          case "wav":
          case "mp3":
          case "ogg": {
            return <audio key={url.toString()} src={url.toString()} controls />;
          }
          case "mp4":
          case "mov":
          case "mkv":
          case "avi":
          case "m4v":
          case "webm": {
            return <video key={url.toString()} src={url.toString()} controls />;
          }
          default:
            return (
              <Link href={url.toString()}>{children || url.toString()}</Link>
            );
        }
      } else {
        return <Link href={link}>{children || link}</Link>;
      }
    } catch (error) {}
  }, [link, children]);

  return render();
}
