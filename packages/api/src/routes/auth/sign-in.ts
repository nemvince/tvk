import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseResponse } from '../../response';

export const signIn = oc
  .input(
    z.object({
      email: z.email(),
      otp: z.string().min(6, 'OTP must be at least 6 characters long'),
    })
  )
  .output(baseResponse);
