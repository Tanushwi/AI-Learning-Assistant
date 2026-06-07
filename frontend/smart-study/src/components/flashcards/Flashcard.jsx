import { useState } from "react";

import {
  RotateCcw,
  Star,
  CheckCircle2,
} from "lucide-react";

const Flashcard = ({
  flashcard,
  currentIndex,
  totalCards,
  onNext,
  onPrev,
  onStar,
  reviewed,
}) => {
  const [isFlipped, setIsFlipped] =
    useState(false);

  return (
    <div
      className="
      w-full
      max-w-4xl
      mx-auto
      "
    >
      {/* CARD */}

      <div
        className="
        relative
        h-[500px]
        cursor-pointer
        "
        style={{
          perspective: "1200px",
        }}
        onClick={() =>
          setIsFlipped(
            !isFlipped
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
              isFlipped
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
            rounded-[35px]
            bg-white
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
            {/* TOP */}

            <div
              className="
              flex
              items-center
              justify-between
              "
            >
              <div
                className="
                flex
                items-center
                gap-3
                "
              >
                <span
                  className="
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-semibold
                  bg-emerald-100
                  text-emerald-700
                  "
                >
                  QUESTION
                </span>

                {reviewed && (
                  <div
                    className="
                    flex
                    items-center
                    gap-1
                    px-3
                    py-2
                    rounded-xl
                    bg-green-100
                    text-green-700
                    text-sm
                    font-semibold
                    "
                  >
                    <CheckCircle2
                      className="
                      w-4
                      h-4
                      "
                    />

                    Reviewed
                  </div>
                )}
              </div>

              {/* STAR */}

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  onStar(
                    flashcard._id
                  );
                }}
                className="
                w-12
                h-12
                rounded-full
                bg-slate-100
                hover:bg-slate-200
                flex
                items-center
                justify-center
                transition
                "
              >
                <Star
                  className={`
                  w-6
                  h-6
                  transition
                  ${
                    flashcard.isStarred
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }
                  `}
                />
              </button>
            </div>

            {/* QUESTION */}

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
                text-slate-800
                leading-relaxed
                "
              >
                {
                  flashcard.question
                }
              </h2>
            </div>

            {/* FOOTER */}

            <div
              className="
              text-center
              text-emerald-500
              flex
              items-center
              justify-center
              gap-2
              font-semibold
              "
            >
              <RotateCcw
                className="
                w-5
                h-5
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
            bg-gradient-to-br
            from-emerald-500
            via-emerald-600
            to-teal-600
            text-white
            shadow-2xl
            p-12
            flex
            flex-col
            justify-between
            "
            style={{
              backfaceVisibility:
                "hidden",

              transform:
                "rotateY(180deg)",
            }}
          >
            {/* TOP */}

            <div
              className="
              flex
              items-center
              justify-between
              "
            >
              <span
                className="
                px-4
                py-2
                rounded-xl
                bg-white/20
                text-white
                text-sm
                font-semibold
                "
              >
                ANSWER
              </span>

              <Star
                className={`
                w-6
                h-6
                ${
                  flashcard.isStarred
                    ? "fill-yellow-300 text-yellow-300"
                    : "text-white"
                }
                `}
              />
            </div>

            {/* ANSWER */}

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
                  flashcard.answer
                }
              </h2>
            </div>

            {/* FOOTER */}

            <div
              className="
              text-center
              text-white/80
              flex
              items-center
              justify-center
              gap-2
              "
            >
              <RotateCcw
                className="
                w-5
                h-5
                "
              />

              Click to see question
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}

      <div
        className="
        mt-10
        flex
        items-center
        justify-center
        gap-5
        "
      >
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="
          px-7
          py-4
          rounded-2xl
          bg-white
          border
          shadow-sm
          font-semibold
          hover:shadow-lg
          transition
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
          shadow-sm
          text-lg
          font-bold
          "
        >
          {currentIndex + 1}
          {" / "}
          {totalCards}
        </div>

        <button
          onClick={onNext}
          disabled={
            currentIndex ===
            totalCards - 1
          }
          className="
          px-7
          py-4
          rounded-2xl
          bg-gradient-to-r
          from-emerald-500
          to-teal-500
          text-white
          font-semibold
          shadow-lg
          hover:scale-105
          transition-all
          disabled:opacity-40
          "
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Flashcard;