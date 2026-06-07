import Flashcard from "../models/Flashcard.js";

import Quiz from "../models/Quiz.js";

import Document from "../models/Document.js";
import Activity from "../models/Activity.js";

// =====================================================
// HELPERS
// =====================================================

const cleanTextContent = (text) => {

  return text
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const splitIntoParagraphs = (text) => {

  return text
    .split(/(?<=[.?!])\s+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40);
};

const stopWords = [

  "what",
  "is",
  "define",
  "explain",
  "tell",
  "me",
  "about",
  "the",
  "a",
  "an",
  "of",
  "for",
  "to",
  "in",
  "and",
  "are",
  "does",
  "mean",
  "how",
  "why",
  "when",
  "where",
  "which",
  "who",

];

const extractKeywords = (query) => {

  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(" ")
    .filter(
      (word) =>
        word.length > 2 &&
        !stopWords.includes(word)
    );
};

// =====================================================
// GENERATE QUESTIONS
// =====================================================

const generateMeaningfulQuestion = (
  sentence
) => {

  const cleanSentence =
    sentence
      .replace(/^answer[:\-]?\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();

  const lower =
    cleanSentence.toLowerCase();

  const words =
    cleanSentence.split(" ");

  // =====================================================
  // TOPIC
  // =====================================================

  const topic =
    words
      .slice(0, 4)
      .join(" ");

  // =====================================================
  // DEFINITIONS
  // =====================================================

  if (
    lower.includes(" is ") ||
    lower.includes(" are ")
  ) {

    return `What is ${topic}?`;
  }

  // =====================================================
  // USAGE
  // =====================================================

  if (
    lower.includes(" used ") ||
    lower.includes(" uses ")
  ) {

    return `How is ${topic} used?`;
  }

  // =====================================================
  // ADVANTAGES
  // =====================================================

  if (
    lower.includes(" advantages ") ||
    lower.includes(" benefits ")
  ) {

    return `What are the advantages of ${topic}?`;
  }

  // =====================================================
  // IMPORTANCE
  // =====================================================

  if (
    lower.includes(" important ") ||
    lower.includes(" purpose ")
  ) {

    return `Why is ${topic} important?`;
  }

  // =====================================================
  // DEFAULT
  // =====================================================

  return `${topic}?`;
};

// =====================================================
// CHAT
// =====================================================

export const chat =
  async (req, res) => {

    try {

      const {
        message,
        documentContent,
      } = req.body;

      if (
        !message ||
        !documentContent
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Message and document required",

        });
      }

      // =====================================================
      // CLEAN QUESTION
      // =====================================================

      const cleanQuestion =
        message.toLowerCase();

      const keywords =
        extractKeywords(
          cleanQuestion
        );

      // =====================================================
      // CLEAN DOCUMENT
      // =====================================================

      const cleanDoc =
        cleanTextContent(
          documentContent
        );

      const paragraphs =
        splitIntoParagraphs(
          cleanDoc
        );

      // =====================================================
      // SCORE PARAGRAPHS
      // =====================================================

      let bestMatch = "";

      let bestScore = 0;

      paragraphs.forEach(
        (paragraph) => {

          const lowerParagraph =
            paragraph.toLowerCase();

          let score = 0;

          // =====================================================
          // FULL QUESTION MATCH
          // =====================================================

          if (
            lowerParagraph.includes(
              cleanQuestion
            )
          ) {

            score += 1000;
          }

          // =====================================================
          // KEYWORD MATCH
          // =====================================================

          let matchedKeywords = 0;

          keywords.forEach(
            (keyword) => {

              const regex =
                new RegExp(
                  `\\b${keyword}\\b`,
                  "i"
                );

              if (
                regex.test(
                  lowerParagraph
                )
              ) {

                matchedKeywords++;

                score += 200;
              }
            }
          );

          // =====================================================
          // BONUS SCORE
          // =====================================================

          if (
            matchedKeywords ===
            keywords.length
          ) {

            score += 500;
          }

          if (
            paragraph.length <
            250
          ) {

            score += 50;
          }

          if (
            paragraph.includes(":")
          ) {

            score += 40;
          }

          // =====================================================
          // BEST MATCH
          // =====================================================

          if (
            score > bestScore
          ) {

            bestScore =
              score;

            bestMatch =
              paragraph;
          }
        }
      );

      // =====================================================
      // NO ANSWER FOUND
      // =====================================================

      if (
        !bestMatch ||
        bestScore < 400
      ) {

        return res.status(200).json({

          success: true,

          response:
            "This information was not found in the uploaded document.",

        });
      }

      // =====================================================
      // SUCCESS RESPONSE
      // =====================================================

      return res.status(200).json({

        success: true,

        response:
          bestMatch.trim(),

      });

    } catch (error) {

      console.log(
        "CHAT ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to process chat",

      });
    }
  };

// =====================================================
// SUMMARY
// =====================================================

export const generateSummary =
  async (req, res) => {

    try {

      const { text } =
        req.body;

      if (!text) {

        return res.status(400).json({

          success: false,

          message:
            "Document text is required",

        });
      }

      const cleanText =
        cleanTextContent(text);

      const sentences =
        splitIntoParagraphs(
          cleanText
        );

      const summary =
        sentences
          .slice(0, 5)
          .join(" ");

      res.status(200).json({

        success: true,

        summary,

      });

    } catch (error) {

      console.log(
        "SUMMARY ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to generate summary",

      });
    }
  };

// =====================================================
// GENERATE FLASHCARDS
// =====================================================

export const generateFlashcards =
  async (req, res) => {

    try {

      if (
        !req.user ||
        !req.user._id
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Unauthorized user",

        });
      }

      const {
        text,
        documentId,
        count = 10,
      } = req.body;

      if (
        !text ||
        !documentId
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Text and documentId required",

        });
      }

      const existingDocument =
        await Document.findOne({

          _id: documentId,

          userId: req.user._id,

        });

      if (!existingDocument) {

        return res.status(404).json({

          success: false,

          message:
            "Document not found",

        });
      }

      // =====================================================
      // CLEAN TEXT
      // =====================================================

      const cleanText =
        cleanTextContent(text);

      const sentences =
        splitIntoParagraphs(
          cleanText
        );

      const shuffled =
        [...sentences].sort(
          () => Math.random() - 0.5
        );

      const cards = [];

      shuffled.forEach(
        (sentence) => {

          if (
            cards.length >= count
          ) {
            return;
          }

          if (
            sentence.length < 50
          ) {
            return;
          }

          const cleanedSentence =
            sentence
              .replace(/^answer[:\-]?\s*/i, "")
              .trim();

          const question =
            generateMeaningfulQuestion(
              cleanedSentence
            );

          cards.push({

            question,

            answer:
              cleanedSentence,

            reviewCount: 0,

            isStarred: false,

          });
        }
      );

      // =====================================================
      // CREATE NEW FLASHCARD SET
      // =====================================================

      const flashcardSet =
        await Flashcard.create({

          userId: req.user._id,

          documentId,

          cards,

          lastAccessed:
            new Date(),

        });
      await Activity.create({
        userId:req.user._id,
        type: "flashcard",
        message:`Generated ${cards.length} flashcards`,
      });

      res.status(201).json({

        success: true,

        data: flashcardSet,

        message:
          "Flashcards generated successfully",

      });

    } catch (error) {

      console.log(
        "FLASHCARD ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to generate flashcards",

      });
    }
  };

// =====================================================
// GENERATE QUIZ
// =====================================================

export const generateQuiz =
  async (req, res) => {

    try {

      const {
        documentId,
        count = 10,
      } = req.body;

      if (!documentId) {

        return res.status(400).json({

          success: false,

          message:
            "Document ID required",
        });
      }

      const document =
        await Document.findById(
          documentId
        );

      if (!document) {

        return res.status(404).json({

          success: false,

          message:
            "Document not found",
        });
      }

      const text =
        document.extractedText;

      const cleanText =
        cleanTextContent(text);

      const sentences =
        splitIntoParagraphs(
          cleanText
        );

      const shuffled =
        [...sentences].sort(
          () => Math.random() - 0.5
        );

      const questions = [];

      shuffled.forEach(
        (sentence) => {

          if (
            questions.length >= count
          ) {
            return;
          }

          if (
            sentence.length < 50
          ) {
            return;
          }

          const cleanedSentence =
            sentence
              .replace(/^answer[:\-]?\s*/i, "")
              .trim();

          const question =
            generateMeaningfulQuestion(
              cleanedSentence
            );

          // =====================================================
          // CORRECT ANSWER
          // =====================================================

          const correctAnswer =
            cleanedSentence
              .split(".")[0]
              .trim();

          // =====================================================
          // DISTRACTORS
          // =====================================================

          const distractors =
            shuffled
              .filter(
                (s) =>
                  s !== sentence &&
                  s.length > 25
              )
              .map((s) =>
                s
                  .replace(/^answer[:\-]?\s*/i, "")
                  .split(".")[0]
                  .trim()
              )
              .filter(
                (s) =>
                  s !== correctAnswer
              )
              .slice(0, 3);

          const options = [

            correctAnswer,

            ...distractors,

          ].sort(
            () => Math.random() - 0.5
          );

          questions.push({

            question,

            options,

            correctAnswer,

            explanation:
              cleanedSentence,

            difficulty:
              "medium",
          });
        }
      );

      const quiz =
        await Quiz.create({

          userId:
            req.user._id,

          documentId,

          title:
            `${document.title} Quiz`,

          questions,

          totalQuestions:
            questions.length,
        });
        await Activity.create({
          userId:req.user._id,
          type: "quiz",
          message:`Generated quiz with ${questions.length} questions`,
        });

      res.status(201).json({

        success: true,

        data: quiz,

      });

    } catch (error) {

      console.log(
        "QUIZ ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to generate quiz",
      });
    }
  };

// =====================================================
// EXPLAIN CONCEPT
// =====================================================

export const explainConcept =
  async (req, res) => {

    try {

      const {
        topic,
        documentContent,
      } = req.body;

      if (
        !topic ||
        !documentContent
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Topic and document content required",

        });
      }

      req.body.message =
        topic;

      return await chat(
        req,
        res
      );

    } catch (error) {

      console.log(
        "EXPLAIN ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to explain concept",
      });
    }
  };

// =====================================================
// CHAT HISTORY
// =====================================================

export const getChatHistory =
  async (req, res) => {

    try {

      res.status(200).json({

        success: true,

        data: [],

      });

    } catch (error) {

      console.log(
        "CHAT HISTORY ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch chat history",
      });
    }
  };