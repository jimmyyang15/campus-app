import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const assignmentRouter = createTRPCRouter({
    createAssignment:protectedProcedure.input(z.object({
        name:z.string(),
        desc:z.string().optional(),
        dueDate:z.date(),
        file:z.string(),
    })).mutation(async({ input,ctx })=>{
        
    })
  



});
