import mongoose from "mongoose";
import env from "./env.js";

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(env.MONGO_URI, {
      maxPoolSize: 20,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );

    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  } catch (error) {
    console.error(
      "MongoDB disconnection failed:",
      error.message
    );
  }
};

export {
  connectDatabase,
  disconnectDatabase,
};

export default connectDatabase;