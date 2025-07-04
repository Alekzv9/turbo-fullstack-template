import { z } from 'zod';

export const SharedSchemaTest = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
});
