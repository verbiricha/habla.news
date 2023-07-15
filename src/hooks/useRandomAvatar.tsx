import { useMemo } from "react";

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTwoDigits(number) {
  return number.toLocaleString("en-US", { minimumIntegerDigits: 2 });
}

export function useRandomAvatar() {
  const n = useMemo(() => {
    return formatTwoDigits(getRandomNumber(1, 20));
  }, []);

  return `/avatars/placeholder_${n}.png`;
}
