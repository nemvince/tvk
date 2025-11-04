import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/lib/env/server.ts";
import * as schema from "./schema.ts";

const pool = new Pool({
  connectionString: env.databaseUrl,
});
export const db = drizzle(pool, { schema });
