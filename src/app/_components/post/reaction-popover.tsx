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
import { useReaction } from "@/hooks/use-reaction";
type Props = {
  postId: string;
};
const ReactionPopover = ({ postId }: Props) => {
  const { handleReaction, reactionOpen, setReactionOpen } = useReaction(postId);
  return (
    <Popover open={reactionOpen} onOpenChange={setReactionOpen}>
      <PopoverTrigger
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.preventDefault();
        }}
        className="flex items-center gap-x-2 text-xs font-semibold text-gray-500 transition-colors duration-150 ease-in hover:text-foreground"
      >
        <Smile size={13} />
        Reactions
      </PopoverTrigger>
      <PopoverContent
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.preventDefault();
        }}
        className="flex justify-between text-2xl [&>*]:flex-1 [&>*]:cursor-pointer   [&>*]:transition-all [&>*]:duration-150 [&>*]:ease-in"
      >
        <span onClick={(e:any) => handleReaction(e,"THUMBS-UP")}>👍</span>
        <span onClick={(e:any) => handleReaction(e,"HEART")}>❤️</span>
        <span onClick={(e:any) => handleReaction(e,"HAPPY")}>😀</span>
        <span onClick={(e:any) => handleReaction(e,"FUNNY")}>🤣</span>
        <span onClick={(e:any) => handleReaction(e,"FIRE")}>🔥</span>️
      </PopoverContent>
    </Popover>
  );
};

export default ReactionPopover;
