import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
});

const env = envSchema.parse(process.env);

export default env;