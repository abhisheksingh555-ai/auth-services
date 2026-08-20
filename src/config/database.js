import mongoose from "mongoose";
import env from "./env.js";

const mongodbConnect = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default mongodbConnect;