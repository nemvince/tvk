import { authContract } from './routes/auth';
import { planetContract } from './routes/planet';

export const tvkApiContract = {
  planet: planetContract,
  auth: authContract,
};
