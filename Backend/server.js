import path from "path";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authroutes.js";
import uploadRoutes from "./routes/uploadroutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import profileRoutes from "./routes/profileRoutes.js"; 

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/profile", profileRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("HIRIZE API running");
});


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
