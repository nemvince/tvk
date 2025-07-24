import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseResponse } from '../../response';

export const requestOtp = oc
  .input(
    z.object({
      email: z.email(),
      type: z.enum(['email-verification', 'sign-in', 'forget-password']),
    })
  )
  .output(baseResponse);
