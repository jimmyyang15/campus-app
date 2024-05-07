import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const clubRouter = createTRPCRouter({
    getClubs:protectedProcedure.query(async({ctx})=>{
        const clubs = await ctx.db.club.findMany({
          orderBy:{
            createdAt:'desc'
          }
        });
        return clubs;
      }),
    createClub: protectedProcedure.input(z.object({
        name: z.string(),
        desc: z.string().optional(),
        clubImage:z.string().optional(),
        mentorId:z.string()
    })).mutation(async ({ input, ctx }) => {
        const userRole = await ctx.session.user.role;
        const {name,desc,mentorId,clubImage} = input
        if (userRole !== "ADMIN") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You're not supposed to create clubs"
            })
        }

        return await ctx.db.club.create({
            data:{
                name,
                desc:desc as string,
                clubImage:clubImage as string,
                members:{
                    connect:{
                        id:mentorId 
                    }
                }
            }
        })

    })



});
