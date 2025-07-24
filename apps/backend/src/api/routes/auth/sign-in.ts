import { ORPCError } from '@orpc/server';
import { api } from '@/api/contract';
import { auth } from '@/lib/auth';

export const signIn = api.auth.signIn.handler(async ({ input }) => {
  try {
    await auth.api.signInEmailOTP({
      body: {
        email: input.email,
        otp: input.otp,
      },
    });

    return {
      success: true,
      message: 'Signed in successfully',
    };
  } catch {
    throw new ORPCError('INTERNAL_SERVER_ERROR');
  }
});
