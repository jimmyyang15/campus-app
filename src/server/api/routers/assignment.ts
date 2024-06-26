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
    }),
    getAssignment:protectedProcedure.input(z.object({
        assignmentId:z.string(),
    })).query(async({input,ctx})=>{
        const { assignmentId } = input
        return await ctx.db.assignment.findUnique({
            where:{
                id:assignmentId
            },include:{
                submissions:{
                    include:{
                        user:{
                            include:{
                                profile:true
                            }
                        }
                    }
                }
            }
        })
    }),
    submitAssignment:protectedProcedure.input(z.object({
        assignmentId:z.string(),
        file:z.string()
    })).mutation(async({ctx,input})=>{
        const { assignmentId,file } = input;
        const userId = await ctx.session.user.id;
        return await ctx.db.submission.create({
            data:{
                assignmentId,
                files:file,
                userId,
            }
        })
    }),
    editSubmission:protectedProcedure.input(z.object({
        assignmentId:z.string(),
        file:z.string()
    })).mutation(async({ctx,input})=>{
        const { assignmentId,file } = input;
        const userId = await ctx.session.user.id;
        const submissions = await ctx.db.assignment.findUnique({
            where:{
                id:assignmentId
            },
            select:{
                submissions:true
            }
        });

        const submission = submissions?.submissions.find((item)=>item.userId===userId)

        return await ctx.db.submission.update({
            where:{
               id:submission?.id
            },
            data:{
                files:file,
            }
        })
    }),
    removeSubmission:protectedProcedure.input(z.object({
        submissionId:z.string()
    })).mutation(async({ctx,input})=>{
        const { submissionId } = input;
        return await ctx.db.submission.delete({
            where:{
                id:submissionId
              
            }
        })
    }),
});
