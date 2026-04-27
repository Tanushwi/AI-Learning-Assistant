import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";

// @desc   Get user learning statistics
// @route  GET /api/progress/dashboard
// @access Private
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Documents
    const totalDocuments = await Document.countDocuments({ userId });

    // Flashcard sets
    const flashcardSets = await Flashcard.find({ userId });

    let totalFlashcards = 0;
    let reviewedFlashcards = 0;
    let starredFlashcards = 0;

    flashcardSets.forEach((set) => {
      totalFlashcards += set.cards.length;
      reviewedFlashcards += set.cards.filter((c) => c.reviewCount > 0).length;
      starredFlashcards += set.cards.filter((c) => c.isStarred).length;
    });

    const totalFlashcardSets = flashcardSets.length;

    // Quiz stats
    const totalQuizzes = await Quiz.countDocuments({ userId });

    const completedQuizzes = await Quiz.countDocuments({
      userId,
      completedAt: { $ne: null },
    });

    const quizzes = await Quiz.find({
      userId,
      completedAt: { $ne: null },
    });

    const averageScore =
      quizzes.length > 0
        ? Math.round(
            quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length
          )
        : 0;

    // Recent documents
    const recentDocuments = await Document.find({ userId })
      .sort({ lastAccessed: -1 })
      .limit(5)
      .select("title filename lastAccessed status");

    // Recent quizzes
    const recentQuizzes = await Quiz.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("documentId", "title")
      .select("title score totalQuestions completedAt");

    const studyStreak = Math.floor(Math.random() * 7) + 1;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalDocuments,
          totalFlashcardSets,
          totalFlashcards,
          reviewedFlashcards,
          starredFlashcards,
          totalQuizzes,
          completedQuizzes,
          averageScore,
          studyStreak,
        },
        recentActivity: {
          documents: recentDocuments,
          quizzes: recentQuizzes,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};