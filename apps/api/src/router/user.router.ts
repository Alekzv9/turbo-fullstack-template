import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { comparePassword, generateToken, hashPassword } from '../lib/auth';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from './trpc.root';
import { db } from '@my-app/db';

export const userRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      const isPasswordValid = await comparePassword(
        input.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      const token = generateToken(user.id);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const existingUser = await db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        });
      }

      const hashedPassword = await hashPassword(input.password);

      const user = await db.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      const token = generateToken(user.id);

      return { token, user };
    }),
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await db.user.update({
        where: { id: ctx.user.id },
        data: input,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      return user;
    }),
});
