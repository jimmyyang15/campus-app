import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";

export const postRouter = createTRPCRouter({

    createPost:protectedProcedure.input(z.object({
      title:z.string(),
      content:z.string()
    })).mutation(async({ ctx,input })=>{

    
      const user = await ctx.session.user
      if(user.role!=="ADMIN") {
        throw new TRPCError({
          code:"FORBIDDEN",
          message:"You're not supposed to create post on homepage!"
        })
      };

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
