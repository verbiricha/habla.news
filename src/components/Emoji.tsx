import { Image } from "@chakra-ui/react";

export default function Emoji({ src, ...rest }) {
  return (
    <Image
      borderRadius="none"
      display="inline"
      boxSize={5}
      fit="contain"
      src={src}
      {...rest}
    />
  );
}
