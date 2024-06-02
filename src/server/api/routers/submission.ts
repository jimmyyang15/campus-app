import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const submissionRouter = createTRPCRouter({
    getSubmissions:protectedProcedure.input(z.object({
        assignmentId:z.string()
    })).query(async({ctx,input})=>{
        const { assignmentId } = input;
        return await ctx.db.submission.findMany({
            where:{
                assignmentId
            },
            include:{
                assignment:true,
                user:{
                    include:{
                        profile:true
                    }
                }
            }
        })
    })
});
