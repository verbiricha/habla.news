function estimateReadingTime(text: string, wordsPerMinute = 200) {
  const words = text.split(" ");
  const numWords = words.length;
  const readingTimeMinutes = numWords / wordsPerMinute;
  return Math.round(readingTimeMinutes);
}

export function formatReadingTime(text: string) {
  const minutes = estimateReadingTime(text);
  if (minutes > 0) {
    return `${minutes} min read`;
  }
}

export function formatDay(timestamp: number) {
  const locale =
    typeof navigator === "undefined" ? "en-US" : navigator.language;
  const date = new Date(timestamp * 1000);
  const options = { month: "short", day: "numeric" };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
}

export function shortenString(str: string, chunkSize = 16) {
  if (str.length <= chunkSize) {
    return str;
  }
  const firstChars = str.substr(0, chunkSize);
  const lastChars = str.substr(str.length - chunkSize);
  return `${firstChars}...${lastChars}`;
}

export function formatShortNumber(n: number) {
  const intl = new Intl.NumberFormat("en", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (n < 2e3) {
    return intl.format(n);
  } else if (n < 1e6) {
    return `${intl.format(n / 1e3)}K`;
  } else if (n < 1e9) {
    return `${intl.format(n / 1e6)}M`;
  } else {
    return `${intl.format(n / 1e9)}G`;
  }
}

export function formatSats(n: number) {
  const intl = new Intl.NumberFormat("en", {
    minimumFractionDigits: 0,
    maximumFractionDigits: n < 1e8 ? 2 : 8,
  });

  if (n === 1) {
    return `1 sat`;
  } else if (n < 2e3) {
    return `${n} sats`;
  } else if (n < 1e6) {
    return `${intl.format(n / 1e3)}K sats`;
  } else if (n < 1e9) {
    return `${intl.format(n / 1e6)}M sats`;
  } else {
    return `${intl.format(n / 1e8)}BTC`;
  }
}

export function formatRemainingTime(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const remainingTime = date.getTime() - now.getTime();

  const seconds = Math.floor(remainingTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (years !== 0) {
    return rtf.format(years, "year");
  }

  if (months !== 0) {
    return rtf.format(months, "month");
  }

  if (days !== 0) {
    return rtf.format(days, "day");
  }

  if (hours !== 0) {
    return rtf.format(hours, "hour");
  }

  if (minutes !== 0) {
    return rtf.format(minutes, "minute");
  }

  return "";
}
