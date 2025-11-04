import { z } from "zod";
import { clientEnvSchema } from "@/lib/env/client";
import { makeTypedEnvironment } from "@/lib/env/common";

const serverEnvSchema = clientEnvSchema.extend({
  DATABASE_URL: z.string().url(),
});

export const env = makeTypedEnvironment(serverEnvSchema.parse)(Bun.env);
