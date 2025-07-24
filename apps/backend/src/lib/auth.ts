import { logger } from '@tvk/logger';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP } from 'better-auth/plugins';
import { authSchema } from '@/db/schema/auth';
import { db } from '@/lib/database';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
    debugLogs: true,
  }),
  plugins: [
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        // shut the linter up for now
        await Promise.resolve();

        // TODO: Implement actual email sending logic

        logger.info(`Sending OTP to ${email}: ${otp}`);
      },
    }),
  ],
});
