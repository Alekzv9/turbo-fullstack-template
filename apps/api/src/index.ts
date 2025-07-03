import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './router/index.js';
import { env } from './env.js';
import { createContext } from './router/trpc.root.js';

const server = Fastify({ logger: true });

await server.register(cors, {
  origin:
    env.NODE_ENV === 'production'
      ? ['https://yourdomain.com']
      : ['http://localhost:3000'],
  credentials: true,
});

await server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext,
  },
});

const start = async () => {
  try {
    const port = env.PORT ?? 3001;
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 API Server running on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
