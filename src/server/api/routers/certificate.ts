import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const certificateRouter = createTRPCRouter({
    sendCertificate:protectedProcedure.input(z.object({
        file:z.string(),
        recipientId:z.string()
    })).mutation(async({ctx,input})=>{
        const { recipientId,file } = input;
        return await ctx.db.certificate.create({
            data:{
                userId:recipientId,
                file
            }
        })
    })
});
