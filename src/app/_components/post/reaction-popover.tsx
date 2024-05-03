"use client"

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { api } from "@/trpc/react";
import { z } from "zod";
type Props = {
  postId:string;
}
const ReactionPopover = ({ postId}:Props) => {
   const REACTION_TYPES = ["THUMBS-UP", "HEART", "HAPPY", "FUNNY", "FIRE"] as const
   const zReactionType = z.enum(REACTION_TYPES)
   type ReactionType_Zod = z.infer<typeof zReactionType>
  const { isLoading,mutateAsync:giveReaction } = api.reactions.giveReaction.useMutation({

  });

  const handleReaction = async(type:ReactionType_Zod) => {
   
    await giveReaction({
      type,
      postId
    })
  }
  return (
    <div>
      <Popover>
        <PopoverTrigger className="text-sm font-semibold text-gray-500">
          Reactions
        </PopoverTrigger>
        <PopoverContent className="flex justify-between text-2xl [&>*]:cursor-pointer [&>*]:flex-1   [&>*]:transition-all [&>*]:ease-in [&>*]:duration-150">
          <span onClick={()=>handleReaction("THUMBS-UP")}>👍</span>
          <span onClick={()=>handleReaction("HEART")}>❤️</span>
          <span onClick={()=>handleReaction("HAPPY")}>😀</span>
          <span onClick={()=>handleReaction("FUNNY")}>🤣</span>
          <span onClick={()=>handleReaction("FIRE")}>🔥</span>
          ️
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ReactionPopover;
