import { Role } from '@my-app/db';
import type { appRouter } from './router/index.js';

export type AppRouter = typeof appRouter;
export type UserRole = Role;
