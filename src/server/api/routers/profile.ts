import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const profileRouter = createTRPCRouter({
    updateProfile: protectedProcedure
        .input(z.object({
            fullName: z.string().optional(),
            city: z.string().optional(),
            dob: z.date().optional(),
            profilePicture:z.string().optional()

        })).mutation(async({ input,ctx }) => {
            const userId =await ctx.session.user.id
            return await ctx.db.profile.update({
                where:{
                    userId
                },data:input
            })
        })



});
