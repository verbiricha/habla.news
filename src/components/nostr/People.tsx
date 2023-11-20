import { useMemo } from "react";
import { AvatarGroup, AvatarGroupProps } from "@chakra-ui/react";

import Avatar from "./Avatar";
import { dedupe } from "@habla/util";

interface PeopleProps extends AvatarGroupProps {
  pubkeys: string[];
}

export default function People({ pubkeys, ...rest }: PeopleProps) {
  const deduped = useMemo(() => {
    return dedupe(pubkeys);
  }, [pubkeys]);

  return (
    <AvatarGroup
      size="sm"
      max={6}
      spacing="-0.5rem"
      fontFamily="body"
      {...rest}
    >
      {deduped.map((pk) => (
        <Avatar key={pk} pubkey={pk} size="xs" />
      ))}
    </AvatarGroup>
  );
}
