import mongoose from "mongoose";

const flashcardSchema =
  new mongoose.Schema(

    {

      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      documentId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Document",

        required: true,
      },

      cards: [

        {

          question: {
            type: String,
            required: true,
          },

          answer: {
            type: String,
            required: true,
          },

          isStarred: {
            type: Boolean,
            default: false,
          },

          reviewCount: {
            type: Number,
            default: 0,
          },

          lastReviewed: {
            type: Date,
          },

        },

      ],

      lastAccessed: {
        type: Date,
        default: Date.now,
      },

    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Flashcard",
  flashcardSchema
);