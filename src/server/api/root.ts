import { createTRPCRouter } from "@/server/api/trpc";
import {  certificateRouter, submissionRouter,assignmentRouter,notificationRouter, postRouter,commentRouter,userRouter,clubRouter,reactionRouter,profileRouter, requestRouter, invitationRouter } from "./routers";
import { authRouter } from "./routers/auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  profile:profileRouter,
  reactions:reactionRouter,
  club:clubRouter,
  user:userRouter,
  comment:commentRouter,
  request:requestRouter,
  invitation:invitationRouter,
  assignment:assignmentRouter,
  notification:notificationRouter,
  submission:submissionRouter,
  certificate:certificateRouter,
  auth:authRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
