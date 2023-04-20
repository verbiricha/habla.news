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
  const date = new Date(timestamp * 1000);
  const options = { month: "short", day: "numeric" };
  const formatter = new Intl.DateTimeFormat("en-US", options);
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
    return n;
  } else if (n < 1e6) {
    return `${intl.format(n / 1e3)}K`;
  } else if (n < 1e9) {
    return `${intl.format(n / 1e6)}M`;
  } else {
    return `${intl.format(n / 1e9)}G`;
  }
}
