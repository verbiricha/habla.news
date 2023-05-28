// Nostr
export const NOTE = 1;
export const CONTACTS = 3;
export const REPOST = 6;
export const REACTION = 7;
export const ZAP = 9735;
export const ZAP_REQUEST = 9734;
export const PROFILE = 0;
export const HIGHLIGHT = 9802;
export const MUTED = 10000;
export const PINNED = 10001;
export const RELAYS = 10002;
export const PEOPLE = 30000;
export const BOOKMARKS = 30001;
export const LONG_FORM = 30023;
export const LONG_FORM_DRAFT = 30024;
export const BADGE = 30009;
export const EMOJIS = 30030;
export const ZAPSTR_TRACK = 31337;
export const ZAPSTR_LIST = 31338;
export const LISTS = [MUTED, PINNED, PEOPLE, BOOKMARKS, ZAPSTR_LIST, EMOJIS];
// Time
export const HOUR = 60 * 60;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;

// eslint-disable-next-line no-useless-escape
export const HASHTAG_REGEX = /(#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+)/g;
