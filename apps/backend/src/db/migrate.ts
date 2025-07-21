import { migrate } from 'drizzle-orm/bun-sql/migrator';
import { db } from '@/lib/database';

migrate(db, {
  migrationsFolder: './drizzle',
});
