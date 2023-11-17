import { useMemo } from "react";
import { Tooltip, Avatar } from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";

export default function RelayFavicon({
  url,
  includeTooltip = true,
  children,
  ...rest
}) {
  const hasNoFavicon = useMemo(() => {
    return url.includes("relay.damus.io") || url.includes("relay.snort.social");
  }, [url]);
  const domain = url
    .replace(hasNoFavicon ? "wss://relay." : "wss://", "https://")
    .replace("ws://", "http://")
    .replace(/\/$/, "");
  const icon = (
    <Avatar
      size="xs"
      src={`${domain}/favicon.ico`}
      icon={<PhoneIcon />}
      {...rest}
    >
      {children}
    </Avatar>
  );
  return includeTooltip ? <Tooltip label={url}>{icon}</Tooltip> : icon;
}
