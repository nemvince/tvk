import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { authSchema } from '@/db/schema/auth';
import { db } from '@/lib/database';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
    debugLogs: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
