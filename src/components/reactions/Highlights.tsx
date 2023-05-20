import { EditIcon } from "@chakra-ui/icons";
import HighlightIcon from "@habla/icons/Highlight";
import ReactionCount from "./ReactionCount";

export default function Highlights({ highlights }) {
  return <ReactionCount icon={EditIcon} reactions={highlights} />;
}
