import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const commentRouter = createTRPCRouter({
    createComment: protectedProcedure
        .input(z.object({
            comment:z.string(),
            postId:z.string()

        })).mutation(async({ input,ctx }) => {
            const userId = await ctx.session.user.id;
            return await ctx.db.comment.create({
                data:{
                    text:input.comment,
                    userId,
                    postId:input.postId
                }
            })
        })



});
