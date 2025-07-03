import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    PORT: z.coerce.number().default(3001),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
  },
  clientPrefix: 'PUBLIC_',
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
