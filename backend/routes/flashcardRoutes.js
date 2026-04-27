import express from "express";
import {
  getFlashcards,
  getAllFlashcardSets,
  reviewFlashcard,
  toggleStarFlashcard,
  deleteFlashcardSet
} from "../controllers/flashcardController.js";

import protect from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

// Get all flashcard sets
router.get("/", getAllFlashcardSets);

// Get flashcards for a document
router.get("/:documentId", getFlashcards);

// Review flashcard (cardId in URL)
router.post("/:cardId/review", reviewFlashcard);

// Toggle star flashcard (cardId in URL)
router.put("/:cardId/star", toggleStarFlashcard);

// Delete flashcard set
router.delete("/:id", deleteFlashcardSet);

export default router;