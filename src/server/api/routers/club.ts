import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const clubRouter = createTRPCRouter({
    getClubs: protectedProcedure.query(async ({ ctx }) => {
        const clubs = await ctx.db.club.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                request: {
                    include: {
                        user: true
                    }
                }
            }
        });
        return clubs;
    }),
    singleClub: protectedProcedure.input(z.object({
        id: z.string()
    })).query(async ({ ctx, input }) => {
        const { id } = input;
        return await ctx.db.club.findFirst({
            where: {
                id
            },
            include: {
                members: {
                    include:{
                        profile:true
                    }
                }
            }
        });

    }),
    createClub: protectedProcedure.input(z.object({
        name: z.string(),
        desc: z.string().optional(),
        clubImage: z.string().optional(),
        mentorId: z.string()
    })).mutation(async ({ input, ctx }) => {
        const userRole = await ctx.session.user.role;
        const { name, desc, mentorId, clubImage } = input
        if (userRole !== "ADMIN") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You're not supposed to create clubs"
            })
        }

        return await ctx.db.club.create({
            data: {
                name,
                desc: desc as string,
                clubImage: clubImage as string,
                members: {
                    connect: {
                        id: mentorId
                    }
                }
            }
        })

    }),

    getMembers:protectedProcedure.query(async ({ ctx }) => {
        const clubs = await ctx.db.club.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                request: {
                    include: {
                        user: true
                    }
                }
            }
        });
        return clubs;
    }),
    getInviteMembers:protectedProcedure.input(z.object({
        clubId:z.string()
    })).query(async({ctx,input })=>{
        const clubMembers = await ctx.db.club.findFirst({
            where:{
                id:input.clubId
            },
            select:{
                members:true
            }
        });
        const idMembers = clubMembers?.members.map((item)=>item.id);

        return await ctx.db.user.findMany({
            where:{
                NOT:{
                    id:{
                        in:idMembers
                    }
                }
            }
        })
    }),

    inviteMember:protectedProcedure.input(z.object({
        username:z.string()
    })).mutation(async({ctx,input })=>{

    })

});
