import { useEffect, useState } from "react";

import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
 Sparkles,
  FileText,
  Trash2,
  PlayCircle,
} from "lucide-react";

import axiosInstance from "../../utils/axiosInstance";

import documentService from "../../services/documentService";

import quizService from "../../services/quizService";

import Spinner from "../../components/common/Spinner";

import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader";

import Tabs from "../../components/common/Tabs";

import Modal from "../../components/common/Modal";

import SimpleChatInterface from "../../components/chat/SimpleChatInterface";

import FlashcardManager from "../../components/flashcards/FlashcardManager";

const DocumentDetailPage = () => {

  const { id } = useParams();

  const navigate =
    useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [document, setDocument] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("Content");

  const [summary, setSummary] =
    useState("");

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // QUIZ STATES
  // =====================================================

  const [quizzes, setQuizzes] =
    useState([]);

  const [
    showGenerateModal,
    setShowGenerateModal,
  ] = useState(false);

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const [selectedQuiz, setSelectedQuiz] =
    useState(null);

  const [questionCount, setQuestionCount] =
    useState(10);

  const [creatingQuiz, setCreatingQuiz] =
    useState(false);

  // =====================================================
  // EXPLAIN CONCEPT STATES
  // =====================================================

  const [concept, setConcept] =
    useState("");

  const [
    conceptMessages,
    setConceptMessages,
  ] = useState([]);

  const [explaining, setExplaining] =
    useState(false);

  // =====================================================
  // FETCH DOCUMENT
  // =====================================================

  useEffect(() => {

    const fetchDocumentDetails =
      async () => {

        try {

          const data =
            await documentService.getDocumentById(
              id
            );

          setDocument(data);

        } catch (error) {

          console.log(error);

          toast.error(
            "Failed to fetch document details"
          );

        } finally {

          setLoading(false);
        }
      };

    fetchDocumentDetails();

  }, [id]);

  // =====================================================
  // FETCH QUIZZES
  // =====================================================

  useEffect(() => {

    fetchQuizzes();

  }, [id]);

  const fetchQuizzes =
    async () => {

      try {

        const response =
          await quizService.getQuizzesForDocument(
            id
          );

        setQuizzes(
          response.data || []
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =====================================================
  // CONTENT TAB
  // =====================================================

  const renderContent = () => {

    if (loading) {
      return <Spinner />;
    }

    const fileUrl =
      `http://localhost:8000/api/documents/${id}/file`;

    return (

      <iframe
        src={fileUrl}
        className="
        w-full
        h-[75vh]
        bg-white
        rounded-3xl
        border
        shadow-sm
        "
        title="PDF Viewer"
      />
    );
  };

  // =====================================================
  // CHAT TAB
  // =====================================================

  const renderChat = () => {

    return (

      <div
        className="
        bg-white
        rounded-3xl
        border
        shadow-sm
        p-4
        "
      >

        <SimpleChatInterface
          documentId={id}
          document={document}
        />

      </div>
    );
  };

  // =====================================================
  // AI ACTIONS TAB
  // =====================================================

  const renderActions = () => {

    const text =

      document?.content ||

      document?.text ||

      document?.parsedText ||

      document?.extractedText ||

      document?.documentText ||

      document?.data?.content ||

      document?.data?.text ||

      document?.data?.parsedText ||

      document?.data?.extractedText ||

      document?.data?.documentText ||

      "";

    // =====================================================
    // GENERATE SUMMARY
    // =====================================================

    const handleGenerateSummary =
      async () => {

        try {

          setGenerating(true);

          setError("");

          setSummary("");

          const response =
            await axiosInstance.post(
              "/api/ai/summary",
              {
                text: text.slice(
                  0,
                  12000
                ),
              }
            );

          if (
            response.data.success
          ) {

            setSummary(
              response.data.summary
            );

            toast.success(
              "Summary generated successfully!"
            );

          } else {

            setError(
              response.data.message ||
              "Failed to generate summary"
            );
          }

        } catch (error) {

          console.log(error);

          setError(
            "Failed to generate summary"
          );

        } finally {

          setGenerating(false);
        }
      };

    // =====================================================
    // EXPLAIN CONCEPT
    // =====================================================

    const handleExplainConcept =
      async () => {

        if (!concept.trim()) {

          toast.error(
            "Please enter a concept"
          );

          return;
        }

        try {

          setExplaining(true);

          const response =
            await axiosInstance.post(
              "/api/ai/chat",
              {
                documentId: id,
                message: concept,
                documentContent: text,
              }
            );

          const aiResponse =

            response?.data?.response ||

            response?.data?.answer ||

            response?.data?.message ||

            "Relevant answer was not found in the uploaded document.";

          setConceptMessages(
            (prev) => [
              ...prev,
              {
                question: concept,
                answer: aiResponse,
              },
            ]
          );

          setConcept("");

        } catch (error) {

          console.log(error);

          toast.error(
            "Failed to explain concept"
          );

        } finally {

          setExplaining(false);
        }
      };

    return (

      <div className="space-y-6">

        {/* DOCUMENT INFO */}

        <div
          className="
          bg-white
          rounded-3xl
          border
          shadow-sm
          p-8
          "
        >

          <div
            className="
            flex
            items-center
            gap-4
            "
          >

            <div
              className="
              w-16
              h-16
              rounded-2xl
              bg-emerald-100
              flex
              items-center
              justify-center
              "
            >

              <FileText
                className="
                w-8
                h-8
                text-emerald-600
                "
              />

            </div>

            <div>

              <p
                className="
                text-sm
                text-gray-500
                mb-1
                "
              >
                Current Document
              </p>

              <h2
                className="
                text-2xl
                font-bold
                text-gray-800
                "
              >
                {
                  document?.title ||
                  document?.data?.title
                }
              </h2>

            </div>

          </div>

        </div>

        {/* AI SUMMARY */}

        <div
          className="
          bg-white
          rounded-3xl
          border
          shadow-sm
          p-8
          "
        >

          <div
            className="
            flex
            items-start
            justify-between
            gap-5
            flex-wrap
            "
          >

            <div>

              <div
                className="
                flex
                items-center
                gap-3
                mb-3
                "
              >

                <div
                  className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-emerald-100
                  flex
                  items-center
                  justify-center
                  "
                >

                  <Sparkles
                    className="
                    w-6
                    h-6
                    text-emerald-600
                    "
                  />

                </div>

                <div>

                  <h2
                    className="
                    text-2xl
                    font-bold
                    "
                  >
                    AI Summary
                  </h2>

                  <p
                    className="
                    text-gray-500
                    "
                  >
                    Generate a concise summary
                    of your uploaded document
                  </p>

                </div>

              </div>

            </div>

            <button
              onClick={
                handleGenerateSummary
              }
              disabled={
                generating
              }
              className="
              px-6
              py-3
              rounded-2xl
              text-white
              font-semibold
              bg-gradient-to-r
              from-emerald-500
              to-teal-500
              hover:scale-[1.02]
              transition
              duration-300
              shadow-lg
              disabled:opacity-60
              "
            >

              {
                generating
                  ? "Generating..."
                  : "Generate Summary"
              }

            </button>

          </div>

          {summary && (

            <div
              className="
              mt-6
              p-6
              rounded-2xl
              bg-emerald-50
              border
              border-emerald-100
              "
            >

              <h3
                className="
                text-lg
                font-bold
                mb-3
                text-emerald-700
                "
              >
                Generated Summary
              </h3>

              <p
                className="
                text-gray-700
                leading-7
                "
              >
                {summary}
              </p>

            </div>
          )}

        </div>

        {/* EXPLAIN CONCEPT */}

        <div
          className="
          bg-white
          rounded-3xl
          border
          shadow-sm
          p-8
          "
        >

          <h2
            className="
            text-2xl
            font-bold
            mb-2
            "
          >
            Explain Concept
          </h2>

          <p
            className="
            text-gray-500
            mb-5
            "
          >
            Ask anything related to your uploaded document
          </p>

          <div
            className="
            flex
            gap-4
            mb-6
            "
          >

            <input
              type="text"
              placeholder="Enter concept or topic..."
              value={concept}
              onChange={(e) =>
                setConcept(
                  e.target.value
                )
              }
              className="
              flex-1
              border
              rounded-2xl
              px-5
              py-4
              outline-none
              focus:ring-2
              focus:ring-emerald-400
              "
            />

            <button
              onClick={
                handleExplainConcept
              }
              disabled={explaining}
              className="
              px-6
              py-4
              rounded-2xl
              bg-emerald-500
              text-white
              font-semibold
              "
            >

              {
                explaining
                  ? "Explaining..."
                  : "Explain"
              }

            </button>

          </div>

          <div className="space-y-4">

            {conceptMessages.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className="
                  p-5
                  rounded-2xl
                  border
                  bg-gray-50
                  "
                >

                  <h4
                    className="
                    font-bold
                    text-emerald-600
                    mb-2
                    "
                  >
                    Q: {item.question}
                  </h4>

                  <p
                    className="
                    text-gray-700
                    leading-7
                    "
                  >
                    {item.answer}
                  </p>

                </div>
              )
            )}

          </div>

        </div>

        {/* ERROR */}

        {error && (

          <div
            className="
            p-5
            rounded-2xl
            bg-red-50
            text-red-600
            border
            border-red-100
            "
          >
            {error}
          </div>
        )}

      </div>
    );
  };

  // =====================================================
  // FLASHCARDS TAB
  // =====================================================

  const renderFlashcardsTab =
    () => {

      return (

        <div className="p-2">

          <FlashcardManager
            document={document}
          />

        </div>
      );
    };

  // =====================================================
  // QUIZZES TAB
  // =====================================================

  const renderQuizzesTab =
    () => {

      const handleGenerateQuiz =
        async () => {

          try {

            setCreatingQuiz(true);

            await quizService.generateQuiz({

              documentId: id,

              count: Number(
                questionCount
              ),
            });

            toast.success(
              "Quiz generated successfully"
            );

            setShowGenerateModal(false);

            fetchQuizzes();

          } catch (error) {

            console.log(error);

            toast.error(
              "Failed to generate quiz"
            );

          } finally {

            setCreatingQuiz(false);
          }
        };

      const handleDeleteQuiz =
        async () => {

          try {

            await quizService.deleteQuiz(
              selectedQuiz._id
            );

            toast.success(
              "Quiz deleted successfully"
            );

            setShowDeleteModal(false);

            fetchQuizzes();

          } catch (error) {

            console.log(error);

            toast.error(
              "Failed to delete quiz"
            );
          }
        };

      return (

        <div className="space-y-6">

          {/* HEADER */}

          <div
            className="
            flex
            items-center
            justify-between
            "
          >

            <div>

              <h2
                className="
                text-3xl
                font-bold
                "
              >
                Quizzes
              </h2>

              <p
                className="
                text-gray-500
                mt-1
                "
              >
                Generate and practice quizzes
              </p>

            </div>

            <button

              onClick={() =>
                setShowGenerateModal(
                  true
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
              Generate New Quiz
            </button>

          </div>

          {/* QUIZ LIST */}

          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
            "
          >

            {quizzes.map(
              (quiz) => (

                <div

                  key={quiz._id}

                  className="
                  bg-white
                  rounded-3xl
                  border
                  shadow-sm
                  p-6
                  "
                >

                  <div
                    className="
                    flex
                    items-start
                    justify-between
                    mb-5
                    "
                  >

                    <div>

                      <h3
                        className="
                        text-xl
                        font-bold
                        "
                      >
                        {quiz.title}
                      </h3>

                      <p
                        className="
                        text-gray-500
                        mt-2
                        "
                      >
                        {
                          quiz.totalQuestions
                        }
                        {" "}
                        Questions
                      </p>

                    </div>

                    <button

                      onClick={() => {

                        setSelectedQuiz(
                          quiz
                        );

                        setShowDeleteModal(
                          true
                        );
                      }}

                      className="
                      w-10
                      h-10
                      rounded-xl
                      bg-red-50
                      flex
                      items-center
                      justify-center
                      text-red-500
                      "
                    >

                      <Trash2
                        className="
                        w-5
                        h-5
                        "
                      />

                    </button>

                  </div>

                  <div
                    className="
                    flex
                    gap-3
                    "
                  >

                    <button

                      onClick={() => {

                        if (quiz.completedAt) {

                          navigate(
                            `/quizzes/${quiz._id}/results`
                          );

                        } else {

                          navigate(
                            `/quizzes/${quiz._id}`
                          );
                        }
                      }}

                      className="
                      flex-1
                      px-4
                      py-3
                      rounded-2xl
                      bg-emerald-500
                      text-white
                      font-semibold
                      flex
                      items-center
                      justify-center
                      gap-2
                      "
                    >

                      <PlayCircle
                        className="
                        w-5
                        h-5
                        "
                      />

                      {
                        quiz.completedAt
                          ? "View Results"
                          : "Start Quiz"
                      }

                    </button>

                  </div>

                </div>
              )
            )}

          </div>

          {/* GENERATE MODAL */}

          <Modal

            isOpen={
              showGenerateModal
            }

            onClose={() =>
              setShowGenerateModal(
                false
              )
            }

            title="Generate New Quiz"
          >

            <div className="space-y-5">

              <div>

                <label
                  className="
                  block
                  text-sm
                  font-semibold
                  mb-2
                  "
                >
                  Number of Questions
                </label>

                <input
                  type="number"
                  min={1}
                  max={20}
                  value={
                    questionCount
                  }
                  onChange={(e) =>
                    setQuestionCount(
                      e.target.value
                    )
                  }
                  className="
                  w-full
                  border
                  rounded-2xl
                  px-5
                  py-4
                  "
                />

              </div>

              <div
                className="
                flex
                justify-end
                gap-4
                "
              >

                <button

                  onClick={() =>
                    setShowGenerateModal(
                      false
                    )
                  }

                  className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-gray-200
                  "
                >
                  Cancel
                </button>

                <button

                  onClick={
                    handleGenerateQuiz
                  }

                  disabled={
                    creatingQuiz
                  }

                  className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-emerald-500
                  text-white
                  "
                >

                  {
                    creatingQuiz
                      ? "Generating..."
                      : "Generate"
                  }

                </button>

              </div>

            </div>

          </Modal>

          {/* DELETE MODAL */}

          <Modal

            isOpen={
              showDeleteModal
            }

            onClose={() =>
              setShowDeleteModal(
                false
              )
            }

            title="Confirm Delete Quiz"
          >

            <div>

              <p
                className="
                text-gray-600
                mb-6
                "
              >
                Are you sure you want
                to delete this quiz?
              </p>

              <div
                className="
                flex
                justify-end
                gap-4
                "
              >

                <button

                  onClick={() =>
                    setShowDeleteModal(
                      false
                    )
                  }

                  className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-gray-200
                  "
                >
                  Cancel
                </button>

                <button

                  onClick={
                    handleDeleteQuiz
                  }

                  className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-red-500
                  text-white
                  "
                >
                  Delete
                </button>

              </div>

            </div>

          </Modal>

        </div>
      );
    };

  const tabs = [

    {
      name: "Content",
      label: "Content",
      content: renderContent,
    },

    {
      name: "Chat",
      label: "Chat",
      content: renderChat,
    },

    {
      name: "Actions",
      label: "AI Actions",
      content: renderActions,
    },

    {
      name: "Flashcards",
      label: "Flashcards",
      content:
        renderFlashcardsTab,
    },

    {
      name: "Quizzes",
      label: "Quizzes",
      content:
        renderQuizzesTab,
    },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!document) {

    return (

      <div className="p-6">
        Document not found
      </div>
    );
  }

  return (

    <div
      className="
      min-h-screen
      bg-gray-50
      p-6
      "
    >

      <Link
        to="/documents"
        className="
        inline-flex
        items-center
        gap-2
        px-4
        py-2
        mb-6
        rounded-xl
        bg-white
        border
        shadow-sm
        "
      >

        <ArrowLeft
          className="w-4 h-4"
        />

        <span className="font-medium">
          Back
        </span>

      </Link>

      <div className="mb-6">

        <PageHeader
          title={
            document?.title ||
            document?.data?.title
          }
        />

      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={
          setActiveTab
        }
      />

    </div>
  );
};

export default DocumentDetailPage;