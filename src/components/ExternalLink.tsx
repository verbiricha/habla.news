import Link from "next/link";

import { Text } from "@chakra-ui/react";

export default function ExternalLink({ children, href, ...rest }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <Text as="span" color="highlight" {...rest}>
        {children}
      </Text>
    </Link>
  );
}
