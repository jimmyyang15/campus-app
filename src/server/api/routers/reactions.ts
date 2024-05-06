import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";

const ReactionTypeSchema = z.enum(["THUMBS-UP", "HEART", "HAPPY", "FUNNY", "FIRE"]);
export const reactionRouter = createTRPCRouter({
    postReactions:protectedProcedure.input(z.object({
        postId:z.string()
      })).query(async({ input })=>{
        return await db.reaction.findMany({
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
        const existingReaction = await db.reaction.findFirst({
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

        if(existingReaction) {
            return await db.reaction.update({
                where:{
                    id:existingReaction.id
                }, data:{
                    type
                }
            })
       
        }

        return await db.reaction.create({
            data:{
                ...input,
                userId:user.id

            }
        })
    
      
    })

});
