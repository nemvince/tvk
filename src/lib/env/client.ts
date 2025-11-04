import { z } from "zod";
import { makeTypedEnvironment } from "@/lib/env/common";

export const clientEnvSchema = z.object({
  VITE_SITE_URL: z.string().url().default("http://localhost:3000"),
});

export const env = makeTypedEnvironment(clientEnvSchema.parse)(import.meta.env);
