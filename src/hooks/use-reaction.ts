import { api } from "@/trpc/react";
import { useState } from "react";
import { z } from "zod";

export const useReaction = (postId:string) => {
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
    const {  mutateAsync: giveReaction } =
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
          utils.post.getPosts.invalidate();
          utils.post.singlePost.invalidate({
            postId
          })
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