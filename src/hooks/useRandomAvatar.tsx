import { useMemo } from "react";

function getRandomNumber(seed, min, max) {
  return Math.floor(seed * (max - min + 1)) + min;
}

function formatTwoDigits(number) {
  return number.toLocaleString("en-US", { minimumIntegerDigits: 2 });
}

export function useRandomAvatar(seed) {
  const n = useMemo(() => {
    return formatTwoDigits(getRandomNumber(seed, 1, 20));
  }, []);

  return `/avatars/placeholder_${n}.png`;
}
