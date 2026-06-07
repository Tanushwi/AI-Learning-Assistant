import express from "express";

import Flashcard from "../models/Flashcard.js";

import {
  getAllFlashcardSets,
  getFlashcards,
  reviewFlashcard,
  toggleStarFlashcard,
  deleteFlashcardSet,
} from "../controllers/flashcardController.js";

// ✅ FIXED IMPORT
import auth from "../middleware/auth.js";

const router = express.Router();

// ======================================================
// ALL ROUTES PROTECTED
// ======================================================

router.use(auth);

// ======================================================
// FLASHCARD STATS
// ======================================================

router.get(
  "/stats/total",
  async (req, res) => {
    try {
      const flashcardSets =
        await Flashcard.find({
          userId: req.user._id,
        });

      const totalSets =
        flashcardSets.length;

      let totalCards = 0;

      let reviewedCards = 0;

      flashcardSets.forEach(
        (set) => {
          totalCards +=
            set.cards.length;

          reviewedCards +=
            set.cards.filter(
              (card) =>
                card.reviewCount > 0
            ).length;
        }
      );

      res.status(200).json({
        success: true,
        totalSets,
        totalCards,
        reviewedCards,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch flashcard stats",
      });
    }
  }
);

// ======================================================
// UPDATE LAST ACCESSED
// ======================================================

router.put(
  "/access/:id",
  async (req, res) => {
    try {
      const updatedFlashcard =
        await Flashcard.findOneAndUpdate(
          {
            _id: req.params.id,

            userId:
              req.user._id,
          },

          {
            lastAccessed:
              new Date(),
          },

          {
            new: true,
          }
        );

      if (!updatedFlashcard) {
        return res.status(404).json({
          success: false,

          message:
            "Flashcard set not found",
        });
      }

      res.status(200).json({
        success: true,

        flashcard:
          updatedFlashcard,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          "Failed to update access time",
      });
    }
  }
);

// ======================================================
// REVIEW FLASHCARD
// ======================================================

router.post(
  "/review/:cardId",
  reviewFlashcard
);

// ======================================================
// TOGGLE STAR
// ======================================================

router.put(
  "/star/:cardId",
  toggleStarFlashcard
);

// ======================================================
// GET SINGLE FLASHCARD SET
// ======================================================

router.get(
  "/:id",
  async (req, res) => {
    try {
      const flashcard =
        await Flashcard.findOne({
          _id: req.params.id,

          userId:
            req.user._id,
        }).populate(
          "documentId",
          "title filename"
        );

      if (!flashcard) {
        return res.status(404).json({
          success: false,

          message:
            "Flashcard set not found",
        });
      }

      // ======================================================
      // EXTRA CALCULATED DATA
      // ======================================================

      const totalCards =
        flashcard.cards.length;

      const reviewedCards =
        flashcard.cards.filter(
          (card) =>
            card.reviewCount > 0
        ).length;

      const progress =
        totalCards > 0
          ? Math.round(
              (reviewedCards /
                totalCards) *
                100
            )
          : 0;

      const completed =
        reviewedCards ===
          totalCards &&
        totalCards > 0;

      res.status(200).json({
        ...flashcard.toObject(),

        totalCards,

        reviewedCards,

        progress,

        completed,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          "Failed to fetch flashcard",
      });
    }
  }
);

// ======================================================
// GET FLASHCARDS FOR DOCUMENT
// ======================================================

router.get(
  "/document/:documentId",
  getFlashcards
);

// ======================================================
// GET ALL FLASHCARD SETS
// ======================================================

router.get(
  "/",
  getAllFlashcardSets
);

// ======================================================
// DELETE FLASHCARD SET
// ======================================================

router.delete(
  "/:id",
  deleteFlashcardSet
);

export default router;