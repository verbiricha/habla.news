import { franc } from "franc";
import {micromark} from 'micromark';

export function combineLists(lists) {
  const result = [];

  function recursiveHelper(currIndex, tempList) {
    if (currIndex === lists.length) {
      result.push(tempList.slice());
      return;
    }

    for (let i = 0; i < lists[currIndex].length; i++) {
      tempList.push(lists[currIndex][i]);
      recursiveHelper(currIndex + 1, tempList);
      tempList.pop();
    }
  }

  recursiveHelper(0, []);

  return result;
}

export function normalizeURL(url: string): string {
  let p = new URL(url);
  p.pathname = p.pathname.replace(/\/+/g, "/");
  if (p.pathname.endsWith("/")) p.pathname = p.pathname.slice(0, -1);
  if (
    (p.port === "80" && p.protocol === "ws:") ||
    (p.port === "443" && p.protocol === "wss:")
  )
    p.port = "";
  p.searchParams.sort();
  p.hash = "";
  return p.toString();
}

export function detectLanguage(title: string, summary: string, content: string,): string {
  const div = document.createElement('div');
  div.innerHTML = micromark(content);
  const text = `${title} ${summary || ""} ${div.textContent}`;
  div.remove();
  const language = franc(text, {only: Object.keys(languageMapping)});
  return languageMapping[language];
}

// https://github.com/wooorm/iso-639-3/blob/main/iso6393-to-1.js
const languageMapping = {
  afr: 'af',
  ara: 'ar',
  bul: 'bg',
  deu: 'de',
  eng: 'en',
  spa: 'es',
  fas: 'fa',
  fra: 'fr',
  hrv: 'hr',
  ita: 'it',
  jpn: 'ja',
  kor: 'ko',
  nld: 'nl',
  por: 'pt',
  rus: 'ru',
  slk: 'sk',
  slv: 'sl',
  swe: 'sv',
  tur: 'tr',
  ukr: 'uk',
  cmn: 'zh',
}