import axiosInstance from "../utils/axiosInstance";

import { API_PATHS } from "../utils/apiPaths";

// ======================================================
// GET ALL FLASHCARD SETS
// ======================================================

const getAllFlashcardSets =
  async () => {
    try {
      const response =
        await axiosInstance.get(
          API_PATHS.FLASHCARDS
            .GET_ALL_FLASHCARD_SETS
        );

      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message:
            "Failed to fetch flashcard sets",
        }
      );
    }
  };

// ======================================================
// GET FLASHCARDS FOR DOCUMENT
// ======================================================

const getFlashcardsForDocument =
  async (documentId) => {
    try {
      const response =
        await axiosInstance.get(
          API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(
            documentId
          )
        );

      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message:
            "Failed to fetch flashcards",
        }
      );
    }
  };

// ======================================================
// GET SINGLE FLASHCARD SET
// ======================================================

const getFlashcardSetById =
  async (id) => {
    try {
      const response =
        await axiosInstance.get(
          `/api/flashcards/${id}`
        );

      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message:
            "Failed to fetch flashcard set",
        }
      );
    }
  };

// ======================================================
// REVIEW FLASHCARD
// ======================================================

const reviewFlashcard =
  async (cardId) => {
    try {
      const response =
        await axiosInstance.post(
          API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(
            cardId
          )
        );

      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message:
            "Failed to review flashcard",
        }
      );
    }
  };

// ======================================================
// TOGGLE STAR
// ======================================================

const toggleStar =
  async (cardId) => {
    try {
      const response =
        await axiosInstance.put(
          API_PATHS.FLASHCARDS.TOGGLE_STAR(
            cardId
          )
        );

      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message:
            "Failed to star flashcard",
        }
      );
    }
  };

// ======================================================
// UPDATE LAST ACCESSED
// ======================================================

const updateLastAccessed =
  async (id) => {
    try {
      const response =
        await axiosInstance.put(
          `/api/flashcards/access/${id}`
        );

      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message:
            "Failed to update access",
        }
      );
    }
  };

// ======================================================
// DELETE FLASHCARD SET
// ======================================================

const deleteFlashcardSet =
  async (id) => {
    try {
      const response =
        await axiosInstance.delete(
          API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(
            id
          )
        );

      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message:
            "Failed to delete flashcards",
        }
      );
    }
  };

// ======================================================
// EXPORT
// ======================================================

const flashcardService = {
  getAllFlashcardSets,
  getFlashcardsForDocument,
  getFlashcardSetById,
  reviewFlashcard,
  toggleStar,
  updateLastAccessed,
  deleteFlashcardSet,
};

export default flashcardService;