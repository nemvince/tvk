import { logger } from '@tvk/logger';
import { migrate } from 'drizzle-orm/bun-sql/migrator';
import { db } from '@/lib/database';

export const migrateDb = async () => {
  await migrate(db, {
    migrationsFolder: './drizzle',
  });
};

if (import.meta.main) {
  try {
    await migrateDb();
    logger.info('Database migration completed successfully.');
  } catch (error) {
    logger.error('Database migration failed:', error);
    process.exit(1);
  }
}
