import app from "./app.js";
import env from "./config/env.js";
import mongodbConnect from "./config/database.js";

const startServer = async () => {
  try {
    await mongodbConnect();

    const server = app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();