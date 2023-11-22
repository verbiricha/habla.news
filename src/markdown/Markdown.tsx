import dynamic from "next/dynamic";
import { useMemo, useCallback } from "react";
import ReactMarkdown, { uriTransformer } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Image } from "@chakra-ui/react";
import { visit, SKIP } from "unist-util-visit";
import { nip19 } from "nostr-tools";

import HyperText from "./HyperText";
import Hashtag from "./Hashtag";
import Emoji from "@habla/components/Emoji";

const NEvent = dynamic(() => import("./NEvent"), {
  ssr: false,
});
const NRelay = dynamic(() => import("./NRelay"), {
  ssr: false,
});
const NProfile = dynamic(() => import("./NProfile"), {
  ssr: false,
});
const NAddr = dynamic(() => import("./NAddr"), {
  ssr: false,
});
const EventId = dynamic(() => import("@habla/components/nostr/EventId"), {
  ssr: false,
});
const Mention = dynamic(() => import("./Mention"), {
  ssr: false,
});

const MentionRegex = /(#\[\d+\])/gi;
const NostrPrefixRegex = /^nostr:/;

function extractCustomEmoji(fragments, tags) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/:(\w+):/g).map((i) => {
          const t = tags.find((a) => a[0] === "emoji" && a[1] === i);
          if (t) {
            return <Emoji src={t[2]} />;
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function extractMentions(fragments, tags) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(MentionRegex).map((match) => {
          const matchTag = match.match(/#\[(\d+)\]/);
          if (matchTag && matchTag.length === 2) {
            const idx = parseInt(matchTag[1]);
            const ref = tags?.find((a, i) => i === idx);
            if (ref) {
              switch (ref[0]) {
                case "p": {
                  return <Mention key={ref[1]} pubkey={ref[1]} />;
                }
                case "e": {
                  return <EventId id={ref[1]} mx="auto" />;
                }
                case "t": {
                  return <Hashtag tag={ref[1]} />;
                }
                case "a": {
                  try {
                    const [k, pubkey, identifier] = ref[1].split(":");
                    const relay = ref[2];
                    const relays = relay?.length > 0 ? [relay] : [];
                    const naddr = nip19.naddrEncode({
                      kind: Number(k),
                      identifier,
                      pubkey,
                      relays,
                    });
                    return (
                      <NAddr naddr={naddr} kind={Number(k)} d={d} pubkey={p} />
                    );
                  } catch (error) {
                    return ref[1];
                  }
                }
                default:
                  return ref[1];
              }
            }
            return null;
          } else {
            return match;
          }
        });
      }
      return f;
    })
    .flat();
}

function extractNpubs(fragments) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/(nostr:npub1[a-z0-9]+)/g).map((i) => {
          if (i.startsWith("nostr:npub1")) {
            try {
              const raw = i.replace(NostrPrefixRegex, "");
              const pubkey = nip19.decode(raw).data;
              return <Mention pubkey={pubkey} />;
            } catch (error) {
              return i;
            }
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function extractNaddrs(fragments) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/(nostr:naddr1[a-z0-9]+)/g).map((i) => {
          if (i.startsWith("nostr:naddr1")) {
            try {
              const naddr = i.replace(NostrPrefixRegex, "");
              const { kind, pubkey, identifier, relays } =
                nip19.decode(naddr).data;
              return (
                <NAddr
                  naddr={naddr}
                  kind={kind}
                  pubkey={pubkey}
                  identifier={identifier}
                  relays={relays}
                />
              );
            } catch (error) {
              return i;
            }
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function extractNprofiles(fragments) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/(nostr:nprofile1[a-z0-9]+)/g).map((i) => {
          if (i.startsWith("nostr:nprofile1")) {
            try {
              const nprofile = i.replace(NostrPrefixRegex, "");
              const { pubkey, relays } = nip19.decode(nprofile).data;
              return (
                <NProfile pubkey={pubkey} relays={relays} nprofile={nprofile} />
              );
            } catch (error) {
              return i;
            }
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function extractNevents(fragments) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/(nostr:nevent1[a-z0-9]+)/g).map((i) => {
          if (i.startsWith("nostr:nevent1")) {
            try {
              const nevent = i.replace(NostrPrefixRegex, "");
              const { id, relays } = nip19.decode(nevent).data;
              return <NEvent nevent={nevent} id={id} relays={relays} />;
            } catch (error) {
              return i;
            }
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function extractNrelays(fragments) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/(nostr:nrelay1[a-z0-9]+)/g).map((i) => {
          if (i.startsWith("nostr:nrelay1")) {
            try {
              const nrelay = i.replace(NostrPrefixRegex, "");
              const relay = nip19.decode(nrelay).data;
              return <NRelay nrelay={nrelay} url={relay} />;
            } catch (error) {
              return i;
            }
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function extractNoteIds(fragments) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/(nostr:note1[a-z0-9]+)/g).map((i) => {
          if (i.startsWith("nostr:note1")) {
            try {
              const id = nip19.decode(i.replace(NostrPrefixRegex, "")).data;
              return <EventId id={id} mx="auto" />;
            } catch (error) {
              return i;
            }
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}

function transformText(ps, tags, transform) {
  let fragments = extractMentions(ps, tags);
  fragments = extractNprofiles(fragments);
  fragments = extractNevents(fragments);
  fragments = extractNrelays(fragments);
  fragments = extractNaddrs(fragments);
  fragments = extractNoteIds(fragments);
  fragments = extractNpubs(fragments);
  fragments = extractCustomEmoji(fragments, tags);

  return transform(fragments);
}

function nostrUriTransformer(uri) {
  const nostrProtocol = "nostr:";

  if (uri.startsWith(nostrProtocol)) {
    return uri;
  } else {
    return uriTransformer(uri);
  }
}

function processHighlights(content, hs) {
  const highlighted = [...new Set(hs.map(({ content }) => content))];
  let result = content;
  highlighted.forEach((h) => {
    result = result.replace(h, `<mark>${h}</mark>`);
  });
  return result;
}

export default function Markdown({
  tags = [],
  content,
  highlights = [],
  onHighlightClick,
}) {
  const highlighted = useMemo(
    () => processHighlights(content, highlights),
    [content, highlights]
  );
  const mark = ({ children, ...rest }) => {
    const content = children.filter((c) => typeof c === "string").join("");
    function onClick(ev) {
      ev.stopPropagation();
      onHighlightClick(content);
    }
    if (content) {
      return (
        <mark style={{ cursor: "pointer" }} onClick={onClick}>
          {children}
        </mark>
      );
    }
    return <mark>{children}</mark>;
  };
  const components = useMemo(() => {
    return {
      mark,
      img: ({ alt, src }) => {
        return (
          <Image
            src={src}
            alt={alt}
            my={4}
            maxH="420px"
            width="100%"
            objectFit="contain"
          />
        );
      },
      li: ({ children, ...props }) => {
        return (
          children &&
          transformText(children, tags, (t) => <li {...props}>{t}</li>)
        );
      },
      td: ({ children }) =>
        children && transformText(children, tags, (t) => <td>{t}</td>),
      p: ({ children }) =>
        children && transformText(children, tags, (t) => <p>{t}</p>),
      a: (props) => {
        const isInternal = props.href.startsWith("#");
        function goToHref(ev) {
          ev.stopPropagation();
        }
        return isInternal ? (
          <a {...props} className="article-link" onClick={goToHref}>
            {props.children}
          </a>
        ) : (
          <HyperText className="article-link" link={props.href}>
            {props.children}
          </HyperText>
        );
      },
    };
  }, [tags]);

  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      transformLinkUri={nostrUriTransformer}
    >
      {highlighted}
    </ReactMarkdown>
  );
}
