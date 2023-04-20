import { decode } from "light-bolt11-decoder";

import { findTag } from "./tags";

export function getZapRequest(zap) {
  let zapRequest = findTag(zap, "description");
  if (zapRequest) {
    try {
      if (zapRequest.startsWith("%")) {
        zapRequest = decodeURIComponent(zapRequest);
      }
      return JSON.parse(zapRequest);
    } catch (e) {
      console.warn("Invalid zap", zapRequest);
    }
  }
}

export function getZapAmount(zap) {
  try {
    const invoice = findTag(zap, "bolt11");
    if (invoice) {
      const decoded = decode(invoice);
      const amount = decoded.sections.find(({ name }) => name === "amount");
      return Number(amount.value) / 1000;
    }
    return 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}
