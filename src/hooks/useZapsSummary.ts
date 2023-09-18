import { useMemo } from "react";
import { getZapRequest, getZapAmount } from "@habla/nip57";

export function useZapsSummary(events, pubkey) {
  const zappers = useMemo(() => {
    return events
      .map((z) => {
        return { ...getZapRequest(z), amount: getZapAmount(z) };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [events]);
  const total = useMemo(() => {
    return zappers.reduce((acc, { amount }) => {
      return acc + amount;
    }, 0);
  }, [zappers]);
  return { zappers, total };
}
