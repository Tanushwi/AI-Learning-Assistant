import axiosInstance from "../utils/axiosInstance";

import { API_PATHS } from "../utils/apiPaths";

// =====================================================
// GENERATE QUIZ
// =====================================================

const generateQuiz = async (payload) => {

  try {

    const response =
      await axiosInstance.post(
        API_PATHS.QUIZZES.GENERATE_QUIZ,
        payload
      );

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        message:
          "Failed to generate quiz",
      }
    );
  }
};

// =====================================================
// GET QUIZZES FOR DOCUMENT
// =====================================================

const getQuizzesForDocument =
  async (documentId) => {

    try {

      const response =
        await axiosInstance.get(
          API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(
            documentId
          )
        );

      return response.data;

    } catch (error) {

      throw (
        error.response?.data || {
          message:
            "Failed to fetch quizzes",
        }
      );
    }
  };

// =====================================================
// GET QUIZ BY ID
// =====================================================

const getQuizById =
  async (quizId) => {

    try {

      const response =
        await axiosInstance.get(
          API_PATHS.QUIZZES.GET_QUIZ_BY_ID(
            quizId
          )
        );

      return response.data;

    } catch (error) {

      throw (
        error.response?.data || {
          message:
            "Failed to fetch quiz",
        }
      );
    }
  };

// =====================================================
// SUBMIT QUIZ
// =====================================================

const submitQuiz =
  async (quizId, answers) => {

    try {

      const response =
        await axiosInstance.post(
          API_PATHS.QUIZZES.SUBMIT_QUIZ(
            quizId
          ),
          { answers }
        );

      return response.data;

    } catch (error) {

      throw (
        error.response?.data || {
          message:
            "Failed to submit quiz",
        }
      );
    }
  };

// =====================================================
// GET QUIZ RESULTS
// =====================================================

const getQuizResults =
  async (quizId) => {

    try {

      const response =
        await axiosInstance.get(
          API_PATHS.QUIZZES.GET_QUIZ_RESULTS(
            quizId
          )
        );

      return response.data;

    } catch (error) {

      throw (
        error.response?.data || {
          message:
            "Failed to fetch quiz results",
        }
      );
    }
  };

// =====================================================
// DELETE QUIZ
// =====================================================

const deleteQuiz =
  async (quizId) => {

    try {

      const response =
        await axiosInstance.delete(
          API_PATHS.QUIZZES.DELETE_QUIZ(
            quizId
          )
        );

      return response.data;

    } catch (error) {

      throw (
        error.response?.data || {
          message:
            "Failed to delete quiz",
        }
      );
    }
  };

const quizService = {

  generateQuiz,

  getQuizzesForDocument,

  getQuizById,

  submitQuiz,

  getQuizResults,

  deleteQuiz,
};

export default quizService;