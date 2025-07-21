import { api } from '@/api/contract';

export const findPlanet = api.planet.find.handler(({ input }) => {
  return {
    id: input.id,
    name: 'Earth',
  };
});
