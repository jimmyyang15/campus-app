import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const invitationRouter = createTRPCRouter({
    getInvitations: protectedProcedure
        .query(async({ ctx }) => {
            const userId = await ctx.session.user.id;
            return await ctx.db.invitation.findMany({
                where:{
                    recipientId:userId
                },
                include:{
                    club:true,
                    sender:{
                        include:{
                            profile:true
                        }
                    }
                }
            })
        }),
        acceptInvitation:protectedProcedure.input(z.object({
            clubId:z.string(),
            invitationId:z.string()
        })).mutation(async({ctx,input})=>{
            const userId = await ctx.session.user.id;
            const { invitationId,clubId } = input;
            await ctx.db.invitation.delete({
                where:{
                    id:invitationId
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
