import { api } from '@/api/contract';
import { dbProvider } from '@/lib/database';
import { requestOtp } from './routes/auth/request-otp';
import { signIn } from './routes/auth/sign-in';
import { findPlanet } from './routes/planet/find';

export const router = api.use(dbProvider).router({
  planet: {
    find: findPlanet,
  },
  auth: {
    requestOtp,
    signIn,
  },
});
