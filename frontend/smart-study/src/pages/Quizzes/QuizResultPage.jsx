import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Trophy,
  CheckCircle2,
  XCircle,
  BookOpen,
} from "lucide-react";

import toast from "react-hot-toast";

import quizService from "../../services/quizService";

import Spinner from "../../components/common/Spinner";

const QuizResultPage = () => {

  const { quizId } =
    useParams();

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [quizData, setQuizData] =
    useState(null);

  // =====================================================
  // FETCH RESULTS
  // =====================================================

  useEffect(() => {

    fetchResults();

  }, []);

  const fetchResults =
    async () => {

      try {

        const response =
          await quizService.getQuizResults(
            quizId
          );

        setQuizData(
          response.data
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to load quiz results"
        );

      } finally {

        setLoading(false);
      }
    };

  // =====================================================
  // SCORE HELPERS
  // =====================================================

  const getScoreColor =
    (score) => {

      if (score >= 80) {
        return "text-emerald-600";
      }

      if (score >= 50) {
        return "text-yellow-500";
      }

      return "text-red-500";
    };

  const getMessage =
    (score) => {

      if (score >= 80) {
        return "Excellent Work!";
      }

      if (score >= 50) {
        return "Good Job!";
      }

      return "Keep Practicing!";
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return <Spinner />;
  }

  if (!quizData) {

    return (

      <div className="p-10">
        Failed to load results
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const quiz =
    quizData.quiz;

  const results =
    quizData.results;

  const score =
    quiz.score;

  const correctCount =
    results.filter(
      (item) => item.isCorrect
    ).length;

  const incorrectCount =
    results.length - correctCount;

  return (

    <div
      className="
      min-h-screen
      bg-gray-50
      p-6
      "
    >

      <div
        className="
        max-w-5xl
        mx-auto
        "
      >

        {/* BACK BUTTON */}

        <button

          onClick={() =>
            navigate(-1)
          }

          className="
          mb-6
          inline-flex
          items-center
          gap-2
          px-4
          py-2
          rounded-xl
          bg-white
          border
          shadow-sm
          hover:bg-gray-50
          transition
          "
        >

          <ArrowLeft
            className="
            w-4
            h-4
            "
          />

          Back

        </button>

        {/* PAGE TITLE */}

        <h1
          className="
          text-3xl
          font-bold
          mb-6
          "
        >
          {quiz.title} Results
        </h1>

        {/* SCORE CARD */}

        <div
          className="
          bg-white
          rounded-3xl
          border
          shadow-sm
          p-10
          text-center
          mb-8
          "
        >

          <div
            className="
            w-20
            h-20
            rounded-full
            bg-emerald-100
            flex
            items-center
            justify-center
            mx-auto
            mb-5
            "
          >

            <Trophy
              className="
              w-10
              h-10
              text-emerald-600
              "
            />

          </div>

          <p
            className="
            text-sm
            uppercase
            tracking-wider
            text-gray-500
            mb-2
            "
          >
            Your Score
          </p>

          <h2
            className={`
            text-6xl
            font-bold
            mb-3
            ${getScoreColor(score)}
            `}
          >
            {score}%
          </h2>

          <p
            className="
            text-xl
            font-semibold
            text-gray-700
            "
          >
            {getMessage(score)}
          </p>

          {/* STATS */}

          <div
            className="
            flex
            flex-wrap
            justify-center
            gap-4
            mt-8
            "
          >

            <div
              className="
              px-5
              py-3
              rounded-2xl
              bg-gray-100
              text-gray-700
              font-semibold
              "
            >
              {results.length} Total
            </div>

            <div
              className="
              px-5
              py-3
              rounded-2xl
              bg-emerald-100
              text-emerald-700
              font-semibold
              "
            >
              {correctCount} Correct
            </div>

            <div
              className="
              px-5
              py-3
              rounded-2xl
              bg-red-100
              text-red-700
              font-semibold
              "
            >
              {incorrectCount} Incorrect
            </div>

          </div>

        </div>

        {/* DETAILED REVIEW */}

        <div className="space-y-6">

          <div
            className="
            flex
            items-center
            gap-3
            mb-2
            "
          >

            <BookOpen
              className="
              w-6
              h-6
              text-emerald-600
              "
            />

            <h2
              className="
              text-2xl
              font-bold
              "
            >
              Detailed Review
            </h2>

          </div>

          {results.map(
            (
              result,
              index
            ) => (

              <div

                key={index}

                className="
                bg-white
                rounded-3xl
                border
                shadow-sm
                p-6
                "
              >

                {/* QUESTION */}

                <div
                  className="
                  flex
                  items-start
                  justify-between
                  gap-4
                  mb-6
                  "
                >

                  <div>

                    <p
                      className="
                      text-sm
                      text-gray-500
                      mb-2
                      "
                    >
                      Question {index + 1}
                    </p>

                    <h3
                      className="
                      text-lg
                      font-semibold
                      "
                    >
                      {result.question}
                    </h3>

                  </div>

                  {result.isCorrect ? (

                    <div
                      className="
                      w-10
                      h-10
                      rounded-full
                      bg-emerald-100
                      flex
                      items-center
                      justify-center
                      "
                    >

                      <CheckCircle2
                        className="
                        w-5
                        h-5
                        text-emerald-600
                        "
                      />

                    </div>

                  ) : (

                    <div
                      className="
                      w-10
                      h-10
                      rounded-full
                      bg-red-100
                      flex
                      items-center
                      justify-center
                      "
                    >

                      <XCircle
                        className="
                        w-5
                        h-5
                        text-red-600
                        "
                      />

                    </div>
                  )}

                </div>

                {/* OPTIONS */}

                <div className="space-y-3">

                  {result.options.map(
                    (
                      option,
                      optionIndex
                    ) => {

                      const isCorrect =
                        option ===
                        result.correctAnswer;

                      const isSelected =
                        option ===
                        result.selectedAnswer;

                      return (

                        <div

                          key={optionIndex}

                          className={`
                          border
                          rounded-2xl
                          px-5
                          py-4
                          flex
                          items-center
                          justify-between

                          ${
                            isCorrect
                              ? "bg-emerald-50 border-emerald-300"
                              : isSelected && !isCorrect
                              ? "bg-red-50 border-red-300"
                              : "bg-gray-50 border-gray-200"
                          }
                          `}
                        >

                          <span
                            className="
                            font-medium
                            "
                          >
                            {option}
                          </span>

                          <div
                            className="
                            flex
                            items-center
                            gap-2
                            "
                          >

                            {isCorrect && (

                              <span
                                className="
                                text-xs
                                font-semibold
                                px-3
                                py-1
                                rounded-full
                                bg-emerald-100
                                text-emerald-700
                                "
                              >
                                Correct
                              </span>
                            )}

                            {isSelected &&
                              !isCorrect && (

                              <span
                                className="
                                text-xs
                                font-semibold
                                px-3
                                py-1
                                rounded-full
                                bg-red-100
                                text-red-700
                                "
                              >
                                Your Answer
                              </span>
                            )}

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

                {/* EXPLANATION */}

                <div
                  className="
                  mt-6
                  rounded-2xl
                  bg-gray-50
                  border
                  p-5
                  "
                >

                  <p
                    className="
                    text-xs
                    uppercase
                    tracking-wide
                    text-gray-500
                    mb-2
                    font-semibold
                    "
                  >
                    Explanation
                  </p>

                  <p
                    className="
                    text-gray-700
                    leading-relaxed
                    "
                  >
                    {result.explanation}
                  </p>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
};

export default QuizResultPage;