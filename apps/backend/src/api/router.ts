import { api } from '@/api/contract';
import { dbProvider } from '@/lib/database';
import { findPlanet } from './routes/planet/find';

export const router = api.use(dbProvider).router({
  planet: {
    find: findPlanet,
  },
});
