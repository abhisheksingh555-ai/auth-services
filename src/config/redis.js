import { createClient } from "redis";
import env from "./env.js";

const redisClient = createClient({
  url: env.REDIS_URL,

  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("Redis reconnection failed");
        return new Error("Redis reconnection limit exceeded");
      }

      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("connect", () => {
  console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
  console.log("Redis connected");
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error.message);
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    return redisClient;
  } catch (error) {
    console.error("Redis connection failed:", error.message);
    process.exit(1);
  }
};

const disconnectRedis = async () => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log("Redis disconnected");
    }
  } catch (error) {
    console.error(
      "Redis disconnection failed:",
      error.message
    );
  }
};

export {
  redisClient,
  connectRedis,
  disconnectRedis,
};

export default redisClient;