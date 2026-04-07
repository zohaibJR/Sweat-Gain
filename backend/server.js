import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import userRoutes       from "./routes/userRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import exerciseRoutes   from "./routes/exerciseRoutes.js";
import goalRoutes       from "./routes/goalRoutes.js";
import paymentRoutes    from "./routes/paymentRoutes.js";

import './cron/attendanceCron.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  }
}));
app.use(express.json());

// Serve uploaded screenshots statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

app.get("/", (req, res) => res.send("SweatAndGain API Running ✅"));

app.use("/api/users",      userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/exercises",  exerciseRoutes);
app.use("/api/goals",      goalRoutes);
app.use("/api/payment",    paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
