import { api } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { z } from "zod";

export const useReaction = (postId:string) => {
    const [reactionOpen, setReactionOpen] = useState(false);
    const queryClient = useQueryClient();
    const REACTION_TYPES = [
      "THUMBS-UP",
      "HEART",
      "HAPPY",
      "FUNNY",
      "FIRE",
    ] as const;
    const zReactionType = z.enum(REACTION_TYPES);
    type ReactionType_Zod = z.infer<typeof zReactionType>;
    const {  mutateAsync: giveReaction } =
      useMutation({
        mutationFn:(payload:{
          type:string,
          postId:string
        })=>axios.post(`/api/posts/reaction`,payload),
        onSettled() {
          // Sync with server once mutation has settled
          queryClient.invalidateQueries(['postsList'])
          queryClient.invalidateQueries(['postDetail'])
        },
      });
  const handleReaction = async (type: ReactionType_Zod) => {
    setReactionOpen(false)
    await giveReaction({
      type,
      postId,
    });
  }

  return { handleReaction,reactionOpen,setReactionOpen }
}