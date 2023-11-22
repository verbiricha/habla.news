import { useCallback } from "react";

import { Image } from "@chakra-ui/react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import Link from "next/link";

// eslint-disable-next-line no-useless-escape
const FileExtensionRegex = /\.([\w]+)$/i;
const TweetUrlRegex =
  /https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/;

export default function HyperText({ link, children, ...rest }) {
  const render = useCallback(() => {
    try {
      const url = new URL(link);
      const extension =
        FileExtensionRegex.test(url.pathname.toLowerCase()) && RegExp.$1;
      const tweetId = TweetUrlRegex.test(link) && RegExp.$2;
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
                my={4}
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
              <Link {...rest} href={url.toString()}>
                {children || url.toString()}
              </Link>
            );
        }
      } else if (tweetId) {
        return (
          <div key={tweetId}>
            <TwitterTweetEmbed tweetId={tweetId} />
          </div>
        );
      } else {
        return (
          <Link {...rest} href={link}>
            {children || link}
          </Link>
        );
      }
    } catch (error) {
      return (
        <Link {...rest} href={link}>
          {children || link}
        </Link>
      );
    }
  }, [link, children]);

  return render();
}
