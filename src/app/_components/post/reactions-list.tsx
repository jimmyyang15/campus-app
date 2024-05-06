"use client";
import { Reaction } from "@prisma/client";
import React, { useMemo } from "react";
import { Button } from "@/app/_components/ui/button";
import ReactionButton from "./reaction-button";
import { ReactionWithUser } from "@/types";
import { useReaction } from "@/hooks/use-reaction";

type Props = {
  postId: string;
  reactions: Reaction[];
};

const ReactionsList = ({ postId, reactions }: Props) => {
  const thumbsUp = useMemo(() => {
    return reactions?.filter((item) => item.type === "THUMBS-UP");
  }, [reactions]);
  const happyReactions = useMemo(() => {
    return reactions?.filter((item) => item.type === "HAPPY");
  }, [reactions]);
  const fireReactions = useMemo(() => {
    return reactions?.filter((item) => item.type === "FIRE");
  }, [reactions]);
  const heartReactions = useMemo(() => {
    return reactions?.filter((item) => item.type === "HEART");
  }, [reactions]);
  const funnyReactions = useMemo(() => {
    return reactions?.filter((item) => item.type === "FUNNY");
  }, [reactions]);

  console.log(thumbsUp, heartReactions);
  const { handleReaction } = useReaction(postId)
  return (
    <div className="flex items-center gap-x-4  text-gray-500">
      <ReactionButton icon={"👍"} count={thumbsUp?.length} items={thumbsUp as ReactionWithUser[]} handleReact={()=>handleReaction("THUMBS-UP")} />
      <ReactionButton icon={"❤️"} count={heartReactions?.length} items={heartReactions as ReactionWithUser[]} handleReact={()=>handleReaction("HEART")} />
      <ReactionButton icon={"😀"} count={happyReactions?.length} items={happyReactions as ReactionWithUser[]} handleReact={()=>handleReaction("HAPPY")} />
      <ReactionButton icon={"🤣"} count={funnyReactions?.length} items={funnyReactions as ReactionWithUser[]} handleReact={()=>handleReaction("FUNNY")} />
      <ReactionButton icon={"🔥"} count={fireReactions?.length} items={fireReactions as ReactionWithUser[]} handleReact={()=>handleReaction("FIRE")} />
    </div>
  );
};

export default ReactionsList;
