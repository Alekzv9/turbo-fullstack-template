import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@my-app/api-types';

export const trpc = createTRPCReact<AppRouter>();
