// =====================================================
// LOCAL AI RESPONSE GENERATOR
// =====================================================

export const generateAIResponse =
  async (prompt) => {

    try {

      if (!prompt) {

        return null;
      }

      // =====================================================
      // CLEAN TEXT
      // =====================================================

      let cleanText =
        prompt
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim();

      // =====================================================
      // REMOVE EXTRA AI PROMPT WORDS
      // =====================================================

      cleanText =
        cleanText

          // summary lines
          .replace(
            /generate a clean short summary of this document:/gi,
            ""
          )

          .replace(
            /generate summary of this document:/gi,
            ""
          )

          // flashcard lines
          .replace(
            /create flashcards from this document:/gi,
            ""
          )

          // quiz lines
          .replace(
            /create quiz from this document:/gi,
            ""
          )

          // question lines
          .replace(
            /answer this question based on the document:/gi,
            ""
          )

          // remove titles
          .replace(
            /cloud computing notes/gi,
            ""
          )

          .replace(
            /java complete notes/gi,
            ""
          )

          .replace(
            /java notes/gi,
            ""
          )

          .trim();

      // =====================================================
      // SUMMARY
      // =====================================================

      if (
        prompt
          .toLowerCase()
          .includes("summary")
      ) {

        return cleanText
          .split(" ")
          .slice(0, 90)
          .join(" ");
      }

      // =====================================================
      // CHAT
      // =====================================================

      if (
        prompt
          .toLowerCase()
          .includes("question")
      ) {

        return cleanText
          .split(" ")
          .slice(0, 70)
          .join(" ");
      }

      // =====================================================
      // DEFAULT
      // =====================================================

      return cleanText;

    } catch (error) {

      console.log(
        "LOCAL AI ERROR:",
        error
      );

      return null;
    }
  };