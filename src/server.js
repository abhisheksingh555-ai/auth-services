import app from "./app.js";
import env from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});


server.on("error", (error) => {
  console.error("Server error:", error);
  process.exit(1);
});