import express from "express";

import protect from "../middleware/auth.js";

import {
  chat,
  generateSummary,
  generateFlashcards,
  generateQuiz,
  explainConcept,
  getChatHistory,
} from "../controllers/aiController.js";

const router = express.Router();

// ======================================================
// PROTECTED ROUTES
// ======================================================

router.use(protect);

// ======================================================
// CHAT
// ======================================================

router.post(
  "/chat",
  chat
);

// ======================================================
// SUMMARY
// ======================================================

router.post(
  "/summary",
  generateSummary
);

// ======================================================
// FLASHCARDS
// ======================================================

router.post(
  "/flashcards",
  generateFlashcards
);

// ======================================================
// QUIZ
// ======================================================

router.post(
  "/quiz",
  generateQuiz
);

// ======================================================
// EXPLAIN
// ======================================================

router.post(
  "/explain-concept",
  explainConcept
);

// ======================================================
// CHAT HISTORY
// ======================================================

router.get(
  "/chat-history/:documentId",
  getChatHistory
);

export default router;