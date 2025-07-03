import { createTRPCRouter } from './trpc.root.js';
import { userRouter } from './user.router.js';

export const appRouter = createTRPCRouter({
  user: userRouter,
});
