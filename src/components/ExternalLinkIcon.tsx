import { useRouter } from "next/router";
import { IconButton } from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";

export default function ExternalLinkIcon({ href }) {
  const router = useRouter();
  return (
    <IconButton
      cursor="pointer"
      variant="unstyled"
      boxSize={3}
      color="secondary"
      as={LinkIcon}
      onClick={() => router.push(href)}
    />
  );
}
