import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const requestRouter = createTRPCRouter({
    requestJoin: protectedProcedure
        .input(z.object({
            clubId: z.string()

        })).mutation(async ({ input, ctx }) => {
            const userId = await ctx.session.user.id;
            return await ctx.db.request.create({
                data: {
                    clubId: input.clubId,
                    userId
                }
            })
    }),
    getRequests: protectedProcedure.input(z.object({
        clubId: z.string()
    })).query(async ({ input, ctx }) => {
        return await ctx.db.request.findMany({
            where:{
                clubId:input.clubId
            },
            include:{
                user:{
                    include:{
                        profile:true
                    }
                }
            }
        })
    }),
    dismissRequest:protectedProcedure.input(z.object({
        id:z.string(),

    })).mutation(async({input,ctx})=>{
        const { id } = input;
  

        return await ctx.db.club.delete({
            where:{
                id
            },
       
        })
    }),
    acceptRequest:protectedProcedure.input(z.object({
        id:z.string(),
        userId:z.string(),
        clubId:z.string()
    })).mutation(async({input,ctx})=>{
        const { clubId,userId,id } = input;
        await ctx.db.request.delete({
            where:{
                id
            }
        })

        return await ctx.db.club.update({
            where:{
                id:clubId
            },
            data:{
                members:{
                    connect:{
                        id:userId
                    }
                }
            }
        })
    })



});
