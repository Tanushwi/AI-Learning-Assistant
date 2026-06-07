import { useEffect, useState } from "react";

import {
  Brain,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance";

import toast from "react-hot-toast";

const FlashcardManager = ({ document }) => {

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [
    flashcardSets,
    setFlashcardSets,
  ] = useState([]);

  const [
    deleteModal,
    setDeleteModal,
  ] = useState(false);

  const [
    selectedSet,
    setSelectedSet,
  ] = useState(null);

  // =====================================================
  // FETCH FLASHCARDS
  // =====================================================

  const fetchFlashcards =
    async () => {

      try {

        const realDocument =
          document?.data ||
          document;

        const docId =
          realDocument?._id ||
          realDocument?.id;

        if (!docId) return;

        const response =
          await axiosInstance.get(
            `/api/flashcards/document/${docId}`
          );

        setFlashcardSets(
          response.data || []
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    if (document) {

      fetchFlashcards();
    }

  }, [document]);

  // =====================================================
  // GENERATE
  // =====================================================

  const handleGenerateFlashcards =
    async () => {

      try {

        setLoading(true);

        const realDocument =
          document?.data ||
          document;

        const docId =
          realDocument?._id ||
          realDocument?.id;

        const text =
          realDocument?.content ||
          realDocument?.extractedText ||
          "";

        if (!docId) {

          toast.error(
            "Document ID missing"
          );

          return;
        }

        if (!text) {

          toast.error(
            "Document content missing"
          );

          return;
        }

        const response =
          await axiosInstance.post(
            "/api/ai/flashcards",
            {
              documentId: docId,
              text,
              count: 10,
            }
          );

        toast.success(
          "Flashcards generated successfully"
        );

        fetchFlashcards();

        navigate(
          `/flashcards/${response.data.data._id}`
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to generate flashcards"
        );

      } finally {

        setLoading(false);
      }
    };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete =
    async () => {

      try {

        await axiosInstance.delete(
          `/api/flashcards/${selectedSet._id}`
        );

        toast.success(
          "Flashcard set deleted successfully"
        );

        fetchFlashcards();

        setDeleteModal(false);

      } catch (error) {

        console.log(error);

        toast.error(
          "Delete failed"
        );
      }
    };

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (
    flashcardSets.length === 0
  ) {

    return (

      <div
        className="
        w-full
        min-h-[70vh]
        bg-white
        rounded-[32px]
        border
        shadow-sm
        flex
        flex-col
        items-center
        justify-center
        text-center
        p-10
        "
      >

        <div
          className="
          w-28
          h-28
          rounded-3xl
          bg-emerald-100
          flex
          items-center
          justify-center
          mb-8
          "
        >

          <Brain
            className="
            w-14
            h-14
            text-emerald-600
            "
          />

        </div>

        <h2
          className="
          text-5xl
          font-bold
          text-slate-800
          mb-5
          "
        >
          No Flashcards Yet
        </h2>

        <p
          className="
          text-xl
          text-gray-500
          max-w-xl
          mb-10
          "
        >
          Generate smart AI flashcards
          from your document.
        </p>

        <button
          onClick={
            handleGenerateFlashcards
          }
          disabled={loading}
          className="
          px-10
          py-5
          rounded-2xl
          bg-gradient-to-r
          from-emerald-500
          to-teal-500
          text-white
          font-semibold
          text-lg
          flex
          items-center
          gap-3
          shadow-lg
          "
        >

          <Sparkles
            className="
            w-6
            h-6
            "
          />

          {
            loading
              ? "Generating..."
              : "Generate Flashcards"
          }

        </button>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <>

      <div
        className="
        bg-white
        rounded-[32px]
        border
        shadow-sm
        p-8
        "
      >

        <div
          className="
          flex
          items-center
          justify-between
          mb-10
          "
        >

          <div>

            <h2
              className="
              text-4xl
              font-bold
              "
            >
              Your Flashcard Sets
            </h2>

            <p className="text-gray-500 mt-2">
              {
                flashcardSets.length
              } sets available
            </p>

          </div>

          <button
            onClick={
              handleGenerateFlashcards
            }
            disabled={loading}
            className="
            px-6
            py-4
            rounded-2xl
            bg-gradient-to-r
            from-emerald-500
            to-teal-500
            text-white
            font-semibold
            shadow-lg
            "
          >
            {
              loading
                ? "Generating..."
                : "Generate New Set"
            }
          </button>

        </div>

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
          "
        >

          {
            flashcardSets.map(
              (set) => (

                <div
                  key={set._id}
                  onClick={() =>
                    navigate(
                      `/flashcards/${set._id}`
                    )
                  }
                  className="
                  border-2
                  border-gray-200
                  rounded-3xl
                  p-6
                  relative
                  hover:border-emerald-400
                  hover:shadow-xl
                  duration-300
                  cursor-pointer
                  "
                >

                  <button
                    onClick={(e) => {

                      e.stopPropagation();

                      setSelectedSet(
                        set
                      );

                      setDeleteModal(
                        true
                      );
                    }}
                    className="
                    absolute
                    top-5
                    right-5
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

                  <div
                    className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-emerald-100
                    flex
                    items-center
                    justify-center
                    mb-5
                    "
                  >

                    <Brain
                      className="
                      w-8
                      h-8
                      text-emerald-600
                      "
                    />

                  </div>

                  <h3
                    className="
                    text-2xl
                    font-bold
                    mb-3
                    "
                  >
                    Flashcard Set
                  </h3>

                  <p
                    className="
                    text-gray-500
                    mb-6
                    "
                  >
                    Created on{" "}
                    {
                      new Date(
                        set.createdAt
                      ).toLocaleDateString()
                    }
                  </p>

                  <div
                    className="
                    inline-flex
                    px-4
                    py-2
                    rounded-xl
                    bg-emerald-100
                    text-emerald-700
                    font-semibold
                    "
                  >
                    {
                      set.cards?.length || 0
                    } cards
                  </div>

                </div>
              )
            )
          }

        </div>

      </div>

      {/* DELETE MODAL */}

      {
        deleteModal && (

          <div
            className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-50
            "
          >

            <div
              className="
              bg-white
              rounded-3xl
              p-8
              w-[90%]
              max-w-md
              relative
              shadow-2xl
              animate-in
              fade-in
              zoom-in
              "
            >

              {/* CLOSE */}

              <button
                onClick={() =>
                  setDeleteModal(
                    false
                  )
                }
                className="
                absolute
                top-5
                right-5
                text-gray-400
                hover:text-black
                "
              >

                <X />

              </button>

              {/* ICON */}

              <div
                className="
                flex
                justify-center
                mb-4
                "
              >

                <div
                  className="
                  w-16
                  h-16
                  rounded-full
                  bg-red-100
                  flex
                  items-center
                  justify-center
                  "
                >

                  <Trash2
                    className="
                    text-red-500
                    w-8
                    h-8
                    "
                  />

                </div>

              </div>

              {/* TITLE */}

              <h2
                className="
                text-3xl
                font-bold
                text-center
                mb-4
                "
              >
                Confirm Deletion
              </h2>

              {/* MESSAGE */}

              <p
                className="
                text-gray-500
                text-center
                leading-relaxed
                mb-8
                "
              >

                Are you sure you want to
                delete this flashcard set?

                <br />

                This action cannot be undone.

              </p>

              {/* BUTTONS */}

              <div
                className="
                flex
                items-center
                justify-center
                gap-4
                "
              >

                <button
                  onClick={() =>
                    setDeleteModal(
                      false
                    )
                  }
                  className="
                  px-6
                  py-3
                  rounded-xl
                  border
                  font-semibold
                  hover:bg-gray-100
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleDelete
                  }
                  className="
                  px-6
                  py-3
                  rounded-xl
                  bg-red-500
                  text-white
                  font-semibold
                  hover:bg-red-600
                  "
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        )
      }

    </>
  );
};

export default FlashcardManager;