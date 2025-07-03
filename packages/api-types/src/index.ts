import type { UserRole } from '../../../apps/api/src/types.js';
export type { AppRouter } from '../../../apps/api/src/types.js';

export type User = {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
};
