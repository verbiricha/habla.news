import RepostIcon from "@habla/icons/Repost";
import ReactionCount from "@habla/components/reactions/ReactionCount";

export default function Reposts({ event, reposts }) {
  return <ReactionCount icon={RepostIcon} reactions={reposts} />;
}
