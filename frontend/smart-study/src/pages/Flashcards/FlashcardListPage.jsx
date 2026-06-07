import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  BookOpen,
  Trash2,
} from "lucide-react";

import flashcardService from "../../services/flashcardService";

const FlashcardListPage = () => {

  const navigate = useNavigate();

  const [flashcards, setFlashcards] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // FETCH FLASHCARDS
  // =====================================================

  const fetchFlashcards = async () => {

    try {

      setLoading(true);

      const response =
        await flashcardService.getAllFlashcardSets();

      console.log(
        "FLASHCARD RESPONSE:",
        response
      );

      const flashcardData =
        response?.data ||
        response?.flashcards ||
        response ||
        [];

      setFlashcards(flashcardData);

    } catch (error) {

      console.log(
        "FLASHCARD FETCH ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchFlashcards();

  }, []);

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Delete this flashcard set?"
      );

    if (!confirmed) return;

    try {

      await flashcardService.deleteFlashcardSet(
        id
      );

      setFlashcards((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to delete flashcards"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="flex items-center justify-center h-[70vh]">

        <p className="text-lg text-slate-500">
          Loading flashcards...
        </p>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="w-full">

      {/* HEADER */}

      <div className="mb-10">

        <h1
          className="
          text-5xl
          font-bold
          text-slate-900
          mb-3
          "
        >
          Flashcards
        </h1>

        <p className="text-slate-500 text-lg">
          Review and track your learning progress
        </p>

      </div>

      {/* EMPTY STATE */}

      {
        !flashcards ||
        flashcards.length === 0 ? (

          <div
            className="
            h-[350px]
            border-2
            border-dashed
            border-slate-300
            rounded-[2rem]
            bg-white
            flex
            items-center
            justify-center
            "
          >

            <h2
              className="
              text-4xl
              font-bold
              text-slate-700
              "
            >
              No Flashcards Yet
            </h2>

          </div>

        ) : (

          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
            "
          >

            {flashcards.map((set) => {

              const cards =
                set.cards || [];

              const totalCards =
                cards.length;

              const reviewedCards =
                cards.filter(
                  (card) =>
                    card.reviewCount > 0
                ).length;

              const progress =
                totalCards > 0
                  ? Math.round(
                      (
                        reviewedCards /
                        totalCards
                      ) * 100
                    )
                  : 0;

              return (

                <div
                  key={set._id}
                  className="
                  bg-white
                  rounded-[2rem]
                  border
                  border-emerald-100
                  p-6
                  shadow-sm
                  hover:shadow-xl
                  transition-all
                  duration-300
                  "
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between mb-5">

                    {/* ICON */}

                    <div
                      className="
                      w-12
                      h-12
                      rounded-xl
                      bg-emerald-100
                      flex
                      items-center
                      justify-center
                      "
                    >

                      <BookOpen
                        className="text-emerald-600"
                        size={22}
                      />

                    </div>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        handleDelete(set._id)
                      }
                      className="
                      w-10
                      h-10
                      rounded-xl
                      bg-red-50
                      hover:bg-red-100
                      flex
                      items-center
                      justify-center
                      transition
                      "
                    >

                      <Trash2
                        size={17}
                        className="text-red-500"
                      />

                    </button>

                  </div>

                  {/* TITLE */}

                  <h2
                    className="
                    text-xl
                    font-bold
                    text-slate-800
                    mb-1
                    line-clamp-2
                    "
                  >

                    {
                      set?.documentId?.title ||
                      set?.title ||
                      "Untitled Flashcards"
                    }

                  </h2>

                  {/* CREATED */}

                  <p
                    className="
                    text-xs
                    uppercase
                    tracking-wide
                    text-slate-400
                    mb-5
                    "
                  >

                    Created Recently

                  </p>

                  {/* CARDS + PERCENT */}

                  <div className="flex items-center justify-between mb-4">

                    {/* CARDS */}

                    <div
                      className="
                      px-4
                      py-2
                      rounded-xl
                      bg-slate-100
                      text-slate-700
                      text-sm
                      font-semibold
                      "
                    >
                      {totalCards} Cards
                    </div>

                    {/* PERCENT */}

                    <div
                      className="
                      px-4
                      py-2
                      rounded-xl
                      bg-emerald-100
                      text-emerald-700
                      text-sm
                      font-bold
                      "
                    >
                      {progress}%
                    </div>

                  </div>

                  {/* PROGRESS */}

                  <div className="flex justify-between text-xs text-slate-500 mb-2">

                    <span>
                      Progress
                    </span>

                    <span>
                      {reviewedCards}/
                      {totalCards} reviewed
                    </span>

                  </div>

                  {/* BAR */}

                  <div
                    className="
                    w-full
                    h-2.5
                    rounded-full
                    bg-slate-100
                    overflow-hidden
                    mb-6
                    "
                  >

                    <div
                      style={{
                        width: `${progress}%`,
                      }}
                      className="
                      h-full
                      bg-gradient-to-r
                      from-emerald-400
                      to-emerald-500
                      rounded-full
                      "
                    />

                  </div>

                  {/* BUTTON */}

                  <button
                    onClick={() =>
                      navigate(
                        `/flashcards/${set._id}`
                      )
                    }
                    className="
                    w-full
                    py-3.5
                    rounded-2xl
                    bg-emerald-100
                    hover:bg-emerald-200
                    text-emerald-700
                    font-semibold
                    transition-all
                    duration-300
                    "
                  >

                    Study Now

                  </button>

                </div>
              );
            })}

          </div>
        )
      }

    </div>
  );
};

export default FlashcardListPage;