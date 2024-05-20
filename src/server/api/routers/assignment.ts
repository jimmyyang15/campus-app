import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { join } from "path";
import { mkdir, stat, writeFile } from "fs/promises";
import mime from 'mime'
export const assignmentRouter = createTRPCRouter({
    createAssignment: protectedProcedure.input(z.object({
        name: z.string(),
        desc: z.string().optional(),
        dueDate: z.date(),
        file: z.string()
    })).mutation(async ({ input, ctx }) => {

        return await ctx.db.assignment.create({
            data:input
        })



    })
});
