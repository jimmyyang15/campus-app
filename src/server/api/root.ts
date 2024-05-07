import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { profileRouter } from "@/server/api/routers/profile";
import { reactionRouter } from "@/server/api/routers/reactions";
import { clubRouter } from "@/server/api/routers/club";
import { userRouter } from "@/server/api/routers/user";

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
  user:userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
