import { names } from "@habla/nip05";

export default function handler(req, res) {
  res.status(200).json({ names });
}
