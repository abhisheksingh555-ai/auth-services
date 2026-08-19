import app from "./app.js";
import env from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { connectRedis } from "./config/redis.js";

const startServer = async () => {
  try {
    // MongoDB
    await connectDatabase();
    console.log("✅ MongoDB connection verified");

    // Redis
    await connectRedis();
    console.log("✅ Redis connection verified");

    // Start HTTP server
    app.listen(env.PORT, () => {
      console.log(`Auth service running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("erver startup failed:", error.message);
    process.exit(1);
  }
};

startServer();