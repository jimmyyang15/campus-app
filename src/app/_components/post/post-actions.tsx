import React from "react";
import ReactionPopover from "./reaction-popover";
import { Button } from "@/app/_components/ui/button";
import { MessageSquareText, Share } from "lucide-react";

type Props = {
  postId: string;
  noComments?: boolean;
};
const PostActions = ({ postId, noComments }: Props) => {
  return (
    <div className="flex items-center gap-x-4">
      <ReactionPopover  postId={postId} />

      {noComments ? null : (
        <Button className="bg-transparent text-xs text-gray-500 hover:bg-transparent hover:text-foreground">
          <MessageSquareText size={13} className="mr-2" />
          Comments
        </Button>
      )}


    </div>
  );
};

export default PostActions;
