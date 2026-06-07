import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import quizService from "../../services/quizService";

import toast from "react-hot-toast";

const QuizTakePage = () => {

  const { quizId } =
    useParams();

  const navigate =
    useNavigate();

  const [quiz, setQuiz] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(0);

  const [answers, setAnswers] =
    useState({});

  // =====================================================
  // FETCH QUIZ
  // =====================================================

  useEffect(() => {

    fetchQuiz();

  }, []);

  const fetchQuiz =
    async () => {

      try {

        const response =
          await quizService.getQuizById(
            quizId
          );

        setQuiz(
          response.data
        );

      } catch (error) {

        toast.error(
          "Failed to fetch quiz"
        );

      } finally {

        setLoading(false);
      }
    };

  // =====================================================
  // SELECT ANSWER
  // =====================================================

  const handleSelectOption =
    (option) => {

      setAnswers(
        (prev) => ({

          ...prev,

          [currentQuestion]:
            option,
        })
      );
    };

  // =====================================================
  // SUBMIT QUIZ
  // =====================================================

  const handleSubmitQuiz =
    async () => {

      // ============================================
      // CHECK ALL ANSWERED
      // ============================================

      if (

        Object.keys(
          answers
        ).length !==
        quiz.questions.length

      ) {

        toast.error(
          "Please answer all questions"
        );

        return;
      }

      try {

        const formattedAnswers =
          Object.entries(
            answers
          ).map(
            ([
              questionIndex,
              selectedAnswer,
            ]) => ({

              questionIndex:
                Number(
                  questionIndex
                ),

              selectedAnswer,
            })
          );

        await quizService.submitQuiz(
          quizId,
          formattedAnswers
        );

        toast.success(
          "Quiz submitted successfully"
        );

        navigate(
          `/quizzes/${quizId}/results`
        );

      } catch (error) {

        toast.error(

          error.message ||

          "Failed to submit quiz"
        );
      }
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        "
      >
        Loading...
      </div>
    );
  }

  // =====================================================
  // CURRENT QUESTION
  // =====================================================

  const question =
    quiz.questions[
      currentQuestion
    ];

  // =====================================================
  // PROGRESS
  // =====================================================

  const progress =
    (
      Object.keys(
        answers
      ).length /
      quiz.questions.length
    ) * 100;

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

        <div
          className="
          bg-white
          rounded-3xl
          border
          shadow-sm
          p-8
          "
        >

          {/* HEADER */}

          <div
            className="
            flex
            items-center
            justify-between
            mb-5
            "
          >

            <h1
              className="
              text-3xl
              font-bold
              "
            >
              {quiz.title}
            </h1>

            <p
              className="
              text-emerald-600
              font-semibold
              "
            >

              Question
              {" "}
              {currentQuestion + 1}
              {" / "}
              {quiz.questions.length}

            </p>

          </div>

          {/* PROGRESS BAR */}

          <div
            className="
            w-full
            h-3
            bg-gray-200
            rounded-full
            overflow-hidden
            mb-10
            "
          >

            <div
              className="
              h-full
              bg-emerald-500
              transition-all
              duration-300
              "
              style={{
                width:
                  `${progress}%`,
              }}
            />

          </div>

          {/* QUESTION */}

          <h2
            className="
            text-2xl
            font-semibold
            leading-10
            mb-8
            "
          >
            {question.question}
          </h2>

          {/* OPTIONS */}

          <div
            className="
            space-y-4
            "
          >

            {question.options.map(
              (
                option,
                index
              ) => (

                <button
                  key={index}

                  onClick={() =>
                    handleSelectOption(
                      option
                    )
                  }

                  className={`
                  w-full
                  text-left
                  p-5
                  rounded-2xl
                  border-2
                  transition

                  ${

                    answers[
                      currentQuestion
                    ] === option

                      ?

                      "border-emerald-500 bg-emerald-50"

                      :

                      "border-gray-200 hover:border-emerald-300 bg-white"

                  }
                  `}
                >

                  {option}

                </button>
              )
            )}

          </div>

          {/* PREV NEXT */}

          <div
            className="
            flex
            items-center
            justify-between
            mt-10
            "
          >

            <button

              onClick={() =>
                setCurrentQuestion(
                  (prev) =>
                    prev - 1
                )
              }

              disabled={
                currentQuestion === 0
              }

              className="
              px-6
              py-3
              rounded-2xl
              bg-gray-200
              disabled:opacity-50
              "
            >
              Previous
            </button>

            {

              currentQuestion ===
              quiz.questions.length - 1

                ?

                (

                  <button

                    onClick={
                      handleSubmitQuiz
                    }

                    className="
                    px-6
                    py-3
                    rounded-2xl
                    bg-emerald-500
                    text-white
                    font-semibold
                    "
                  >
                    Submit Quiz
                  </button>
                )

                :

                (

                  <button

                    onClick={() =>
                      setCurrentQuestion(
                        (prev) =>
                          prev + 1
                      )
                    }

                    className="
                    px-6
                    py-3
                    rounded-2xl
                    bg-emerald-500
                    text-white
                    font-semibold
                    "
                  >
                    Next
                  </button>
                )
            }

          </div>

          {/* QUESTION NAVIGATION */}

          <div
            className="
            flex
            flex-wrap
            gap-3
            mt-10
            justify-center
            "
          >

            {quiz.questions.map(
              (
                _,
                index
              ) => (

                <button

                  key={index}

                  onClick={() =>
                    setCurrentQuestion(
                      index
                    )
                  }

                  className={`

                  w-12
                  h-12
                  rounded-xl
                  font-semibold
                  transition

                  ${

                    currentQuestion ===
                    index

                      ?

                      "bg-emerald-500 text-white"

                      :

                      answers[index]

                      ?

                      "bg-emerald-100 text-emerald-700"

                      :

                      "bg-gray-200"

                  }
                  `}
                >

                  {index + 1}

                </button>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default QuizTakePage;