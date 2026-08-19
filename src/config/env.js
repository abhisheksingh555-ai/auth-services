import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(5000),

  MONGO_URI: z
    .string()
    .min(1, "MONGO_URI is required"),

  REDIS_URL: z
    .string()
    .min(1, "REDIS_URL is required"),

  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),

  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),

  JWT_ACCESS_EXPIRES_IN: z
    .string()
    .default("15m"),

  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .default("7d"),

  COOKIE_SECRET: z
    .string()
    .min(32, "COOKIE_SECRET must be at least 32 characters"),

  CORS_ORIGIN: z
    .string()
    .default("http://localhost:5173"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  console.error(
    parsedEnv.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }))
  );

  process.exit(1);
}

const env = parsedEnv.data;

export default env;