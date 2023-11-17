import { useMemo } from "react";

import type { Tags } from "@habla/types";

interface Split {
  pubkey: string;
  gets?: number;
  percentage: number;
}

export default function useZapSplit(zapTags: Tags, sats?: string): Split[] {
  const totalWeight = useMemo(() => {
    return zapTags.reduce((acc, t) => {
      return acc + Number(t.at(3) ?? "");
    }, 0);
  }, [zapTags]);
  const split = useMemo(() => {
    return zapTags.map((t) => {
      const [, pubkey, , weight] = t;
      const percentage = Number(weight) / totalWeight;
      const value = { pubkey, percentage };
      if (sats) {
        value.gets = Number(sats) * percentage;
      }
      return value;
    });
  }, [zapTags, sats]);

  return split;
}
