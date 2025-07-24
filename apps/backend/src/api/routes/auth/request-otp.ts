import { ORPCError } from '@orpc/server';
import { api } from '@/api/contract';
import { auth } from '@/lib/auth';

export const requestOtp = api.auth.requestOtp.handler(async ({ input }) => {
  try {
    await auth.api.sendVerificationOTP({
      body: {
        email: input.email,
        type: input.type,
      },
    });

    return {
      success: true,
      message: 'OTP sent successfully',
    };
  } catch (_) {
    throw new ORPCError('INTERNAL_SERVER_ERROR');
  }
});
