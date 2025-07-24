import { z } from 'zod';

export const baseResponse = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.object().optional(),
});
