import { useMemo, useCallback } from "react";
import ReactMarkdown, { uriTransformer } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMark from "remark-mark-plus";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import slugify from "slugify";
import { Text } from "@chakra-ui/react";
import { visit, SKIP } from "unist-util-visit";
import { nip19 } from "nostr-tools";

import HyperText from "./HyperText";
import Hashtag from "./Hashtag";
import NEvent from "./NEvent";
import NRelay from "./NRelay";
import NProfile from "./NProfile";
import NAddr from "./NAddr";
import EventId from "./EventId";
import Mention from "./Mention";

const MentionRegex = /(#\[\d+\])/gi;
const NostrPrefixRegex = /^nostr:/;

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
                  return <EventId id={ref[1]} />;
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
              return <EventId id={id} />;
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

function transformText(ps, tags) {
  let fragments = extractMentions(ps, tags);
  fragments = extractNprofiles(fragments);
  fragments = extractNevents(fragments);
  fragments = extractNrelays(fragments);
  fragments = extractNaddrs(fragments);
  fragments = extractNoteIds(fragments);
  fragments = extractNpubs(fragments);
  return fragments;
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

export default function Markdown({ tags = [], content, highlights = [] }) {
  const highlighted = useMemo(
    () => processHighlights(content, highlights),
    [content, highlights]
  );
  const components = useMemo(() => {
    return {
      h1: ({ children }) => (
        <h1
          id={
            typeof children?.at(0) === "string" &&
            slugify(children[0], { lower: true })
          }
        >
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2
          id={
            typeof children?.at(0) === "string" &&
            slugify(children[0], { lower: true })
          }
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          id={
            typeof children?.at(0) === "string" &&
            slugify(children[0], { lower: true })
          }
        >
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4
          id={
            typeof children?.at(0) === "string" &&
            slugify(children[0], { lower: true })
          }
        >
          {children}
        </h4>
      ),
      h5: ({ children }) => (
        <h5
          id={
            typeof children?.at(0) === "string" &&
            slugify(children[0], { lower: true })
          }
        >
          {children}
        </h5>
      ),
      h6: ({ children }) => (
        <h6
          id={
            typeof children?.at(0) === "string" &&
            slugify(children[0], { lower: true })
          }
        >
          {children}
        </h6>
      ),
      img: ({ alt, src }) => {
        return <img key={src} alt={alt} src={src} />;
      },
      li: ({ children }) =>
        children && <li>{transformText(children, tags)}</li>,
      td: ({ children }) =>
        children && <td>{transformText(children, tags)}</td>,
      p: ({ children }) => children && <p>{transformText(children, tags)}</p>,
      a: (props) => {
        return <HyperText link={props.href}>{props.children}</HyperText>;
      },
    };
  }, [tags, highlights]);

  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[remarkGfm, remarkToc, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      transformLinkUri={nostrUriTransformer}
    >
      {highlighted}
    </ReactMarkdown>
  );
}
