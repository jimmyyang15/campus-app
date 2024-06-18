
import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
    getMentors:protectedProcedure.query(async({ctx})=>{
        const mentors = await ctx.db.user.findMany({
            where:{
                isMentor:true
            },
            include:{
                profile:true
            }

        })
        return mentors;
      }),
  



});
