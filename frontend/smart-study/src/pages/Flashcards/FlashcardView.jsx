import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  RotateCcw,
  Star,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";

const FlashcardView = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [flashcardSet, setFlashcardSet] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [showAnswer, setShowAnswer] =
    useState(false);

  // =====================================================
  // FETCH
  // =====================================================

  const fetchFlashcards = async () => {

    try {

      setLoading(true);

      const response =
        await flashcardService.getFlashcardSetById(
          id
        );

      setFlashcardSet(response);

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to load flashcards"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchFlashcards();

  }, [id]);

  // =====================================================
  // REVIEW
  // =====================================================

  const handleReview = async (
    cardId
  ) => {

    try {

      await flashcardService.reviewFlashcard(
        cardId
      );

      setFlashcardSet((prev) => {

        const updatedCards =
          prev.cards.map((card) =>
            card._id === cardId
              ? {
                  ...card,
                  reviewCount:
                    (card.reviewCount || 0) + 1,
                }
              : card
          );

        return {
          ...prev,
          cards: updatedCards,
        };
      });

    } catch (error) {

      console.log(error);
    }
  };

  // =====================================================
  // STAR
  // =====================================================

  const handleStar = async (
    cardId
  ) => {

    try {

      await flashcardService.toggleStar(
        cardId
      );

      setFlashcardSet((prev) => ({
        ...prev,

        cards: prev.cards.map(
          (card) =>
            card._id === cardId
              ? {
                  ...card,
                  isStarred:
                    !card.isStarred,
                }
              : card
        ),
      }));

    } catch (error) {

      console.log(error);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async () => {

    const confirmed =
      window.confirm(
        "Delete this flashcard set?"
      );

    if (!confirmed) return;

    try {

      await flashcardService.deleteFlashcardSet(
        flashcardSet._id
      );

      toast.success(
        "Flashcard set deleted!"
      );

      navigate("/flashcards");

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to delete flashcards"
      );
    }
  };

  // =====================================================
  // NEXT
  // =====================================================

  const handleNext = async () => {

    const currentCard =
      flashcardSet.cards[currentIndex];

    await handleReview(
      currentCard._id
    );

    setShowAnswer(false);

    // LAST CARD

    if (
      currentIndex ===
      flashcardSet.cards.length - 1
    ) {

      toast.success(
        "Flashcards completed!"
      );

      setTimeout(() => {

        navigate("/flashcards");

      }, 1200);

      return;
    }

    // NORMAL NEXT

    setCurrentIndex(
      currentIndex + 1
    );
  };

  // =====================================================
  // PREV
  // =====================================================

  const handlePrev = () => {

    setShowAnswer(false);

    if (currentIndex > 0) {

      setCurrentIndex(
        currentIndex - 1
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="p-10">
        Loading Flashcards...
      </div>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================

  if (
    !flashcardSet ||
    !flashcardSet.cards ||
    flashcardSet.cards.length === 0
  ) {

    return (

      <div className="p-10">
        No Flashcards Found
      </div>
    );
  }

  const cards =
    flashcardSet.cards;

  const currentCard =
    cards[currentIndex];

  return (

    <div className="max-w-6xl mx-auto">

      {/* HEADER */}

      <div
        className="
        flex
        items-center
        justify-between
        mb-10
        flex-wrap
        gap-6
        "
      >

        {/* LEFT */}

        <div>

          <button
            onClick={() =>
              navigate(-1)
            }
            className="
            mb-5
            flex
            items-center
            gap-2
            text-gray-500
            hover:text-black
            transition
            "
          >

            <ArrowLeft className="w-5 h-5" />

            Back

          </button>

          <h1
            className="
            text-5xl
            font-bold
            text-slate-800
            "
          >

            {
              flashcardSet?.documentId
                ?.title ||
              "Flashcards"
            }

          </h1>

          <p
            className="
            text-gray-500
            mt-3
            text-lg
            "
          >

            {cards.length}
            {" "}
            flashcards available

          </p>

        </div>

        {/* DELETE BUTTON */}

        <button
          onClick={handleDelete}
          className="
          w-16
          h-16
          rounded-2xl
          bg-red-50
          hover:bg-red-100
          flex
          items-center
          justify-center
          transition-all
          duration-300
          shadow-sm
          "
        >

          <Trash2
            className="
            text-red-500
            "
            size={28}
          />

        </button>

      </div>

      {/* CARD */}

      <div
        className="
        w-full
        h-[500px]
        cursor-pointer
        "
        style={{
          perspective: "1200px",
        }}
        onClick={() =>
          setShowAnswer(
            !showAnswer
          )
        }
      >

        <div
          className="
          relative
          w-full
          h-full
          duration-700
          "
          style={{
            transformStyle:
              "preserve-3d",

            transform:
              showAnswer
                ? "rotateY(180deg)"
                : "rotateY(0deg)",
          }}
        >

          {/* FRONT */}

          <div
            className="
            absolute
            w-full
            h-full
            bg-white
            rounded-[35px]
            border
            shadow-2xl
            p-12
            flex
            flex-col
            justify-between
            "
            style={{
              backfaceVisibility:
                "hidden",
            }}
          >

            <div className="flex justify-between items-center">

              <div
                className="
                px-4
                py-2
                rounded-xl
                bg-emerald-100
                text-emerald-700
                font-semibold
                text-sm
                "
              >

                QUESTION

              </div>

              <button
                onClick={(e) => {

                  e.stopPropagation();

                  handleStar(
                    currentCard._id
                  );
                }}
                className="
                w-12
                h-12
                rounded-full
                bg-slate-100
                flex
                items-center
                justify-center
                "
              >

                <Star
                  className={`
                  w-6
                  h-6
                  ${
                    currentCard.isStarred
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }
                  `}
                />

              </button>

            </div>

            <div
              className="
              flex-1
              flex
              items-center
              justify-center
              text-center
              "
            >

              <h2
                className="
                text-4xl
                font-bold
                leading-relaxed
                text-slate-800
                "
              >

                {
                  currentCard.question
                }

              </h2>

            </div>

            <div
              className="
              text-center
              text-emerald-500
              font-semibold
              "
            >

              <RotateCcw
                className="
                inline
                w-5
                h-5
                mr-2
                "
              />

              Click to reveal answer

            </div>

          </div>

          {/* BACK */}

          <div
            className="
            absolute
            w-full
            h-full
            rounded-[35px]
            shadow-2xl
            p-12
            flex
            flex-col
            justify-between
            bg-gradient-to-br
            from-emerald-500
            to-teal-600
            text-white
            "
            style={{
              backfaceVisibility:
                "hidden",

              transform:
                "rotateY(180deg)",
            }}
          >

            <div
              className="
              px-4
              py-2
              rounded-xl
              bg-white/20
              text-white
              font-semibold
              text-sm
              w-fit
              "
            >

              ANSWER

            </div>

            <div
              className="
              flex-1
              flex
              items-center
              justify-center
              text-center
              "
            >

              <h2
                className="
                text-3xl
                font-semibold
                leading-relaxed
                "
              >

                {
                  currentCard.answer
                }

              </h2>

            </div>

            <div
              className="
              text-center
              text-white/80
              "
            >

              Click to flip back

            </div>

          </div>

        </div>

      </div>

      {/* CONTROLS */}

      <div
        className="
        flex
        items-center
        justify-center
        gap-6
        mt-10
        "
      >

        <button
          disabled={
            currentIndex === 0
          }
          onClick={handlePrev}
          className="
          px-8
          py-4
          rounded-2xl
          bg-white
          border
          disabled:opacity-40
          "
        >

          Previous

        </button>

        <div
          className="
          px-6
          py-4
          rounded-2xl
          bg-white
          border
          font-bold
          "
        >

          {currentIndex + 1}
          {" / "}
          {cards.length}

        </div>

        <button
          onClick={handleNext}
          className="
          px-8
          py-4
          rounded-2xl
          bg-emerald-500
          text-white
          "
        >

          {
            currentIndex ===
            cards.length - 1
              ? "Finish"
              : "Next"
          }

        </button>

      </div>

    </div>
  );
};

export default FlashcardView;