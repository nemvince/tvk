import { env } from 'bun';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),
});

const envData = envSchema.safeParse(env);

if (!envData.success) {
  throw new Error(
    `Environment variables validation failed: ${envData.error.message}`
  );
}

export default envData.data;
