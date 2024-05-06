"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { api } from "@/trpc/react";
import { z } from "zod";
import { Smile } from "lucide-react";
type Props = {
  postId: string;
};
const ReactionPopover = ({ postId }: Props) => {
  const [reactionOpen, setReactionOpen] = useState(false);
  const utils = api.useUtils()
  const REACTION_TYPES = [
    "THUMBS-UP",
    "HEART",
    "HAPPY",
    "FUNNY",
    "FIRE",
  ] as const;
  const zReactionType = z.enum(REACTION_TYPES);
  type ReactionType_Zod = z.infer<typeof zReactionType>;
  const { isLoading, mutateAsync: giveReaction } =
    api.reactions.giveReaction.useMutation({
      // async onMutate(newReaction) {
      //   // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      //   await utils.reactions.postReactions.cancel({
      //     postId
      //   })
  
      //   // Get the data from the queryCache
      //   const prevData = utils.reactions.postReactions.getData({
      //     postId
      //   });
  
      //   // Optimistically update the data with our new post
      //   utils.reactions.postReactions.setData({postId}, (old) => {[...old,newReaction]});
  
      //   // Return the previous data so we can revert if something goes wrong
      //   return { prevData };
      // },
      onSettled() {
        // Sync with server once mutation has settled
        utils.post.getPosts.invalidate()
      },
    });

  const handleReaction = async (type: ReactionType_Zod) => {
    setReactionOpen(false)
    await giveReaction({
      type,
      postId,
    });
  };
  return (
      <Popover open={reactionOpen} onOpenChange={setReactionOpen}>
        <PopoverTrigger className="flex items-center gap-x-2 text-xs font-semibold text-gray-500 transition-colors duration-150 ease-in hover:text-foreground">
          <Smile size={13} />
          Reactions
        </PopoverTrigger>
        <PopoverContent className="flex justify-between text-2xl [&>*]:flex-1 [&>*]:cursor-pointer   [&>*]:transition-all [&>*]:duration-150 [&>*]:ease-in">
          <span onClick={() => handleReaction("THUMBS-UP")}>👍</span>
          <span onClick={() => handleReaction("HEART")}>❤️</span>
          <span onClick={() => handleReaction("HAPPY")}>😀</span>
          <span onClick={() => handleReaction("FUNNY")}>🤣</span>
          <span onClick={() => handleReaction("FIRE")}>🔥</span>️
        </PopoverContent>
      </Popover>
  );
};

export default ReactionPopover;
