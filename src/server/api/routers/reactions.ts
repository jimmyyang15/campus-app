import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

const ReactionTypeSchema = z.enum(["THUMBS-UP", "HEART", "HAPPY", "FUNNY", "FIRE"]);
export const reactionRouter = createTRPCRouter({
    postReactions:protectedProcedure.input(z.object({
        postId:z.string()
      })).query(async({ input,ctx })=>{
        return await ctx.db.reaction.findMany({
          where:{
            id:input.postId
          }
        })
      }),
    
    giveReaction:protectedProcedure.input(z.object({
      type:ReactionTypeSchema,
      postId:z.string(),
    })).mutation(async({ ctx,input })=>{
        const user = await ctx.session.user;
        const { postId,type } = input;
        const existingReaction = await ctx.db.reaction.findFirst({
            where:{
                AND:[
                    {
                        userId:user.id
                    },{
                        postId
                    }
                ]
                
            }
        });

        if(existingReaction?.type === type) {
            return await ctx.db.reaction.delete({
                where:{
                    id:existingReaction.id
                }
            })
        }

        if(existingReaction) {
            return await ctx.db.reaction.update({
                where:{
                    id:existingReaction.id
                }, data:{
                    type
                }
            })
       
        }


        return await ctx.db.reaction.create({
            data:{
                ...input,
                userId:user.id

            }
        })
    
      
    })

});
