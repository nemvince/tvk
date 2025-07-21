import { SQL } from 'bun';
import { drizzle } from 'drizzle-orm/bun-sql';
import { api } from '@/api/contract';

const databaseClient = new SQL({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
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
