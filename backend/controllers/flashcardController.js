import Flashcard from "../models/Flashcard.js";


// @desc    Get all flashcards for a document
// @route   GET /api/flashcards/:documentId
// @access  Private
export const getFlashcards = async (req, res, next) => {
  try {

    const flashcards = await Flashcard.find({
      userId: req.user._id,
      documentId: req.params.documentId
    })
      .populate("documentId", "title filename")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Get all flashcard sets for a user
// @route   GET /api/flashcards
// @access  Private
export const getAllFlashcardSets = async (req, res, next) => {
  try {

    const flashcardSets = await Flashcard.find({ userId: req.user._id })
      .populate("documentId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets
    });

  } catch (error) {
    next(error);
  }
};



// @desc    Mark flashcard as reviewed
// @route   POST /api/flashcards/:cardId/review
// @access  Private
export const reviewFlashcard = async (req, res, next) => {
  try {

    const cardId = req.params.cardId;

    const flashcardSet = await Flashcard.findOne({
      cards: { $elemMatch: { _id: cardId } },
      userId: req.user._id
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found",
        statusCode: 404
      });
    }

    const card = flashcardSet.cards.id(cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Card not found in set",
        statusCode: 404
      });
    }

    card.lastReviewed = new Date();
    card.reviewCount = (card.reviewCount || 0) + 1;

    if (req.body.difficulty) {
      card.difficulty = req.body.difficulty;
    }

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      message: "Flashcard reviewed successfully",
      data: card
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Toggle star/favorite on flashcard
// @route   PUT /api/flashcards/:cardId/star
// @access  Private
export const toggleStarFlashcard = async (req, res, next) => {
  try {

    const { cardId } = req.params;

    const flashcardSet = await Flashcard.findOne({
      "cards._id": cardId,
      userId: req.user._id
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set not found",
        statusCode: 404
      });
    }

    const card = flashcardSet.cards.id(cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Card not found in set",
        statusCode: 404
      });
    }

    card.isStarred = !card.isStarred;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: `Flashcard ${card.isStarred ? "starred" : "unstarred"}`
    });

  } catch (error) {
    next(error);
  }
};



// @desc    Delete flashcard set
// @route   DELETE /api/flashcards/:id
// @access  Private
export const deleteFlashcardSet = async (req, res, next) => {
  try {

    const flashcardSet = await Flashcard.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set not found",
        statusCode: 404
      });
    }

    await flashcardSet.deleteOne();

    res.status(200).json({
      success: true,
      message: "Flashcard set deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};