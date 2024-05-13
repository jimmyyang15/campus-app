import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
    singlePost:protectedProcedure.input(z.object({
      postId:z.string()
    })).query(async({ input,ctx })=>{
      return await ctx.db.post.findUnique({
        where:{
          id:input.postId
        },
        include:{
          user:{
            include:{
              profile:true
            }
          },
          reactions:true
        }
      })
    }),

    getPosts:protectedProcedure.query(async({ctx})=>{
      const posts = await ctx.db.post.findMany({
        include:{
          user:{
            include:{
              profile:true
            }
          },
          reactions:{
            include:{
              user:true
            }
          }
        },
        orderBy:{
          createdAt:'desc'
        }
      });
      return posts;
    }),

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

      return await ctx.db.post.create({
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
