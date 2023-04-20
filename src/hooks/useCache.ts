import { useMemo } from "react";

const storage = typeof window === "undefined" ? {} : window.localStorage;

function getKey(key: string) {
  return storage.getItem(key);
}

function removeKey(key: string) {
  storage.removeItem(key);
}

function getJsonKey(key: string) {
  const cached = getKey(key);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      console.error(error);
      storage.removeItem(key);
    }
  }
}

function setJsonKey(key: string, value: any) {
  setKey(key, JSON.stringify(value));
}

function setKey(key: string, value: string) {
  storage.setItem(key, value);
}

export default function useCache(key) {
  const cached = useMemo(() => {
    return getJsonKey(key);
  }, [key]);

  return cached;
}
