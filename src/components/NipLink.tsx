interface NipLinkProps {
  nip: number;
}

function formatNumber(number) {
  return number.toString().padStart(2, "0");
}

export default function NipLink({ nip }) {
  return (
    <Link
      href={`https://github.com/nostr-protocol/nips/${formatNumber(nip)}.md`}
      target="_blank"
      rel="noopener noreferrer"
    >
      NIP-{formatNumber(nip)}
    </Link>
  );
}
