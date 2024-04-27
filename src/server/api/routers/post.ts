import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { PostSchema } from "@/lib/schemas/post";
import { db } from "@/server/db";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
    createPost:protectedProcedure.input(z.object({
      title:z.string(),
      desc:z.string()
    })).mutation(async({ ctx,input })=>{

    
      const user = await ctx.session.user
      if(user.role!=="ADMIN") {
        throw new TRPCError({
          code:"FORBIDDEN",
          message:"You're not supposed to create post on homepage!"
        })
      }

      return await db.post.create({
        data:{
          ...input,
        
          user:{
            connect:{
              id:user.id
            }
          }
        }
      })
    })

});
