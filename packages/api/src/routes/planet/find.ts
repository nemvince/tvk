import { oc } from '@orpc/contract';
import { z } from 'zod';

export const findPlanet = oc
  .input(
    z.object({
      id: z.number().int().positive(),
    })
  )
  .output(
    z.object({
      id: z.number().int().positive(),
      name: z.string(),
    })
  );
