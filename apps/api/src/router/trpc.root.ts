import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { z } from 'zod';
import { verifyToken } from '../lib/auth.js';
import { db } from '@my-app/db';

export const createContext = ({ req }: CreateFastifyContextOptions) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  let user = null;
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      user = { id: decoded.userId };
    }
  }

  return { user, req };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof z.ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Create router
export const createTRPCRouter = t.router;

// Create procedure
export const publicProcedure = t.procedure;

// Middleware to fetch full user data for protected routes
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in',
    });
  }

  const fullUser = await db.user.findUnique({
    where: { id: ctx.user.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!fullUser) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not found',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: fullUser,
    },
  });
});

// Admin middleware
const isAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in',
    });
  }

  const user = await db.user.findUnique({
    where: { id: ctx.user.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);
export const adminProcedure = t.procedure.use(isAdmin);
