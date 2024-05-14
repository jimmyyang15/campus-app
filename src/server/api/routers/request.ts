import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const requestRouter = createTRPCRouter({
    requestJoin: protectedProcedure
        .input(z.object({
            clubId:z.string()

        })).mutation(async({ input,ctx }) => {
            const userId = await ctx.session.user.id;
            return await ctx.db.request.create({
                data:{
                    clubId:input.clubId,
                    userId
                }
            })
        })



});
