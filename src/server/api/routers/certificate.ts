import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const certificateRouter = createTRPCRouter({
    sendCertificate: protectedProcedure.input(z.object({
        file: z.string(),
        recipientId: z.string()
    })).mutation(async ({ ctx, input }) => {
        const { recipientId, file } = input;
        return await ctx.db.certificate.create({
            data: {
                userId: recipientId,
                file
            }
        })
    }),
    getMembersWithoutCertificate: protectedProcedure.input(z.object({
        clubId: z.string(),
    })).query(async ({ ctx, input }) => {
        const { clubId } = input;
        return await ctx.db.club.findUnique({
            where: {
                id: clubId as string
            },
            select: {
                members: {
                    include: {
                        profile: true
                    },
                    
                    where:{
                        AND:[
                            {
                                certificate:{
                                    is:null
                                }
                            },
                            {
                                isMentor:false
                            }
                        ]
                     
                    }
                }
            }
        })
    }),
    getCertificate:protectedProcedure.query(async({ctx})=>{
        const userId = await ctx.session.user.id;
        return await ctx.db.certificate.findUnique({
            where:{
                userId
            }
        })
    })
});
