import { useColorMode, IconButton } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export default function DarkModeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <IconButton
      variant="unstyled"
      color={isDark ? "#FFD700" : "#C2C2C"}
      icon={isDark ? <SunIcon /> : <MoonIcon />}
      aria-label="Toggle Theme"
      onClick={toggleColorMode}
    />
  );
}
