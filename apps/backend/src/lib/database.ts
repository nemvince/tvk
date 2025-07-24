import { SQL } from 'bun';
import { drizzle } from 'drizzle-orm/bun-sql';
import { api } from '@/api/contract';
import env from '@/lib/env';

const databaseClient = new SQL({
  url: env.DATABASE_URL,
});

export const db = drizzle({ client: databaseClient });

export const dbProvider = api.middleware(async ({ context, next }) => {
  try {
    await databaseClient.connect();
    return next({
      context: { ...context, db },
    });
  } catch (_) {
    throw new Error('Database operation failed');
  }
});
