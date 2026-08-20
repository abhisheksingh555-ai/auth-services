import express from "express";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth service is running",
  });
});

export default app;