import Link from "next/link";

export default function Hashtag({ tag }) {
  return (
    <Link shallow={true} href={`/t/${tag}`}>
      {tag}
    </Link>
  );
}
