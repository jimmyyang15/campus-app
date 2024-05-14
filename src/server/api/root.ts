import { createTRPCRouter } from "@/server/api/trpc";
import { postRouter,commentRouter,userRouter,clubRouter,reactionRouter,profileRouter, requestRouter } from "./routers";

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
});

// export type definition of API
export type AppRouter = typeof appRouter;
