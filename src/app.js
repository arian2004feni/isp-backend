import express from "express";
import cors from "cors";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

export default app;
