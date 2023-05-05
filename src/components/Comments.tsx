import CommentIcon from "@habla/icons/Comment";
import ReactionCount from "@habla/components/reactions/ReactionCount";

export default function Comments({ event, comments }) {
  return <ReactionCount icon={CommentIcon} reactions={comments} />;
}
