import dotenv from "dotenv";

// =====================================================
// LOAD ENV FIRST
// =====================================================

dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";

import documentRoutes,
{
  fileRouter,
} from "./routes/documentRoutes.js";

import flashcardRoutes from "./routes/flashcardRoutes.js";

import aiRoutes from "./routes/aiRoutes.js";

import quizRoutes from "./routes/quizRoutes.js";

import progressRoutes from "./routes/progressRoutes.js";

import summaryRouter from "./routes/summaryRoutes.js";

// =====================================================
// EXPRESS APP
// =====================================================

const app = express();

// =====================================================
// CONNECT DATABASE
// =====================================================

connectDB();

// =====================================================
// MIDDLEWARES
// =====================================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// STATIC FILES
// =====================================================

app.use(
  "/uploads",
  express.static("uploads")
);

// =====================================================
// BASIC ROUTE
// =====================================================

app.get("/", (req, res) => {

  res.send(
    "API is running 🚀"
  );

});

// =====================================================
// TEST ROUTE
// =====================================================

app.get(
  "/api/test",
  (req, res) => {

    res.json({
      success: true,
      message:
        "Backend working ✅",
    });

  }
);

// =====================================================
// API ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/documents",
  fileRouter
);

app.use(
  "/api/documents",
  documentRoutes
);

app.use(
  "/api/flashcards",
  flashcardRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

app.use(
  "/api/quizzes",
  quizRoutes
);

app.use(
  "/api/progress",
  progressRoutes
);

app.use(
  "/api/summary",
  summaryRouter
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {

  res.status(404).json({

    success: false,

    error:
      "Route not found",

  });

});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(errorHandler);

// =====================================================
// SERVER START
// =====================================================

const PORT =
  process.env.PORT || 8000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );

});