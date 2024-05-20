import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const assignmentRouter = createTRPCRouter({
    createAssignment: protectedProcedure.input(z.object({
        name: z.string(),
        desc: z.string().optional(),
        dueDate: z.date(),
        file: z.string(),
        clubId:z.string(),
    })).mutation(async ({ input, ctx }) => {

        return await ctx.db.assignment.create({
            data: input
        })
    }),
    getAssignments:protectedProcedure.input(z.object({
        clubId:z.string()
    })).query(async({input,ctx})=>{
        const { clubId } = input
        return await ctx.db.assignment.findMany({
            where:{
                clubId
            }
        })
    })
});
