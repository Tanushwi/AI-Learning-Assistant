import Flashcard from "../models/Flashcard.js";
import Activity from "../models/Activity.js";

// ======================================================
// GET FLASHCARDS FOR DOCUMENT
// ======================================================
// @route GET /api/flashcards/document/:documentId

export const getFlashcards = async (
  req,
  res,
  next
) => {
  try {
    const flashcards =
      await Flashcard.find({
        userId: req.user._id,
        documentId:
          req.params.documentId,
      })
        .populate(
          "documentId",
          "title filename"
        )
        .sort({ createdAt: -1 });

    res.status(200).json(
      flashcards
    );
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET ALL FLASHCARD SETS
// ======================================================
// @route GET /api/flashcards

export const getAllFlashcardSets =
  async (req, res, next) => {
    try {
      const flashcardSets =
        await Flashcard.find({
          userId: req.user._id,
        })
          .populate(
            "documentId",
            "title filename"
          )
          .sort({
            updatedAt: -1,
          });

      res.status(200).json(
        flashcardSets
      );
    } catch (error) {
      next(error);
    }
  };

// ======================================================
// REVIEW FLASHCARD
// ======================================================
// @route POST /api/flashcards/review/:cardId

export const reviewFlashcard =
  async (req, res, next) => {
    try {
      const { cardId } =
        req.params;

      const flashcardSet =
        await Flashcard.findOne({
          userId: req.user._id,
          "cards._id": cardId,
        });

      if (!flashcardSet) {
        return res.status(404).json({
          success: false,
          message:
            "Flashcard not found",
        });
      }

      const card =
        flashcardSet.cards.id(
          cardId
        );

      if (!card) {
        return res.status(404).json({
          success: false,
          message:
            "Card not found",
        });
      }

      // ============================================
      // UPDATE REVIEW DATA
      // ============================================

      card.reviewCount += 1;

      card.lastReviewed =
        new Date();

      card.isReviewed = true;

      flashcardSet.lastAccessed =
        new Date();

      // ============================================
      // UPDATE PROGRESS
      // ============================================

      flashcardSet.reviewedCards =
        flashcardSet.cards.filter(
          (c) => c.isReviewed
        ).length;

      flashcardSet.totalCards =
        flashcardSet.cards.length;

      flashcardSet.progress =
        Math.round(
          (flashcardSet.reviewedCards /
            flashcardSet.totalCards) *
            100
        );

      flashcardSet.completed =
        flashcardSet.reviewedCards ===
        flashcardSet.totalCards;

      await Activity.create({

  userId:
    req.user._id,

  type: "flashcard",

  message:
    "Reviewed flashcards",

});
      await flashcardSet.save();

      res.status(200).json({
        success: true,

        message:
          "Flashcard reviewed successfully",

        data: {
          reviewedCards:
            flashcardSet.reviewedCards,

          totalCards:
            flashcardSet.totalCards,

          progress:
            flashcardSet.progress,

          card,
        },
      });
    } catch (error) {
      next(error);
    }
  };

// ======================================================
// TOGGLE STAR FLASHCARD
// ======================================================
// @route PUT /api/flashcards/star/:cardId

export const toggleStarFlashcard =
  async (req, res, next) => {
    try {
      const { cardId } =
        req.params;

      const flashcardSet =
        await Flashcard.findOne({
          userId: req.user._id,
          "cards._id": cardId,
        });

      if (!flashcardSet) {
        return res.status(404).json({
          success: false,
          message:
            "Flashcard set not found",
        });
      }

      const card =
        flashcardSet.cards.id(
          cardId
        );

      if (!card) {
        return res.status(404).json({
          success: false,
          message:
            "Card not found",
        });
      }

      card.isStarred =
        !card.isStarred;

      await flashcardSet.save();

      res.status(200).json({
        success: true,

        message: card.isStarred
          ? "Flashcard starred"
          : "Flashcard unstarred",

        data: card,
      });
    } catch (error) {
      next(error);
    }
  };

// ======================================================
// DELETE FLASHCARD SET
// ======================================================
// @route DELETE /api/flashcards/:id

export const deleteFlashcardSet =
  async (req, res, next) => {
    try {
      const flashcardSet =
        await Flashcard.findOne({
          _id: req.params.id,
          userId: req.user._id,
        });

      if (!flashcardSet) {
        return res.status(404).json({
          success: false,
          message:
            "Flashcard set not found",
        });
      }

      await flashcardSet.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Flashcard set deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };