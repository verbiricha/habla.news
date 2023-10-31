import { nip05 } from "nostr-tools";
import { useQuery } from "@tanstack/react-query";

export function useNostrAddress(handle?: string) {
  const query = useQuery({
    queryKey: ["nip05", handle],
    queryFn: async () => {
      const result = await nip05.queryProfile(handle);
      if (!result) {
        throw new Error(`Couldn't fetch nip05 for ${handle}`);
      }
      return result;
    },
    cacheTime: 24 * 60 * 60 * 1000,
    retry: false,
    refetchOnMount: false,
    enabled: Boolean(handle),
  });
  return query;
}
