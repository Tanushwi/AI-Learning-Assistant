import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import documentRoutes, { fileRouter } from "./routes/documentRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import summaryRouter from "./routes/summaryRoutes.js";

dotenv.config();

const app = express();

// ✅ DB CONNECT
connectDB();

// ✅ MIDDLEWARES
app.use(cors());
app.use(express.json());

// ✅ STATIC FILES
app.use("/uploads", express.static("uploads"));

// ✅ BASIC TEST (IMPORTANT)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/documents", fileRouter);
app.use("/api/documents", documentRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);

// 🔥 SUMMARY ROUTE (FINAL)
app.use("/api/summary", summaryRouter);





// ✅ BACKEND TEST
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working ✅" });
});

// ❌ 404 HANDLER (LAST ME HI HONA CHAHIYE)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// ❌ ERROR HANDLER (LAST)
app.use(errorHandler);

// 🚀 SERVER START
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});