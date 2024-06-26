import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { time } from "console";

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
                    include: {
                        profile: true,
                        submissions:true
                    }
                },
                
            }
        });

    }),
    createClub: protectedProcedure.input(z.object({
        name: z.string(),
        desc: z.string().optional(),
        clubImage: z.string().optional(),
        mentorId: z.string(),
        time:z.string(),
        day:z.string()
    })).mutation(async ({ input, ctx }) => {
        const userRole = await ctx.session.user.role;
        const { name, desc, mentorId, clubImage,time,day } = input
        if (userRole !== "ADMIN") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You're not supposed to create clubs"
            })
        }

        return await ctx.db.club.create({
            data: {
                name,
                timeActivity:time,
                dayActivity:day,
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

    getMembers: protectedProcedure.input(z.object({
        clubId:z.string()
    })).query(async ({ ctx,input }) => {
        const { clubId } = input;
        const members = await ctx.db.club.findUnique({
            where:{
                id:clubId
            },
       
           
            select:{
                
                members:{
                    where:{
                        NOT:{
                            isMentor:true
                        }
                    },
                    include:{
                        profile:true
                    }
                },
                
            }
        });
        return members;
    }),
    kickMember:protectedProcedure.input(z.object({
        clubId:z.string(),
        memberId:z.string()
    })).mutation(async({ctx,input})=>{
        const {clubId,memberId} = input
        return await ctx.db.club.update({
            where:{
                id:clubId
            },
            data:{
                members:{
                    disconnect:{
                        id:memberId
                    }
                }
            }
        })
    }),
    getInviteMembers: protectedProcedure.input(z.object({
        clubId: z.string()
    })).query(async ({ ctx, input }) => {
        const clubMembers = await ctx.db.club.findFirst({
            where: {
                id: input.clubId
            },
            select: {
                members: true
            }
        });
        const idMembers = clubMembers?.members.map((item) => item.id);

        return await ctx.db.user.findMany({
            where: {
                AND: [
                    {
                        NOT: {
                            id: {
                                in: idMembers
                            }
                        }

                    }, {
                        NOT: {
                            isMentor: true
                        }
                    }, {
                        NOT: {
                            role: "ADMIN"
                        }
                    },{
                        NOT:{
                            invitationReceived:{
                                clubId:input.clubId
                            }
                        }
                    },{
                        club:null
                    }
                ]

            },
            include:{
                profile:true
            }
        })
    }),

    inviteMember: protectedProcedure.input(z.object({
        recipientId: z.string(),
        clubId:z.string()
    })).mutation(async ({ ctx, input }) => {
        const { recipientId,clubId } = input;
        const user = await ctx.session.user
        return await ctx.db.invitation.create({
            data:{
                recipientId,
                clubId,
                senderId:user.id
            }
        })
    })

});
