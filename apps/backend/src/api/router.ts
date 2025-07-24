import { api } from '@/api/contract';
import { dbProvider } from '@/lib/database';
import { requestOtp } from './routes/auth/requestOtp';
import { signIn } from './routes/auth/signIn';
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
