import { PrismaClient } from '../generated/prisma/index.js';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  console.log('🐘 `@my-app/db`: Creating Prisma client.');

  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
