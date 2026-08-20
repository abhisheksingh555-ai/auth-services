import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth service is running",
  });
});

export default app;