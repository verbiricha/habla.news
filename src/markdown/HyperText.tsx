import { useCallback } from "react";

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
              <img
                alt={url.toString()}
                key={url.toString()}
                src={url.toString()}
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
