import * as geminiService from "../utils/geminiService.js";

export const generateSummary = async (req, res, next) => {
  try {
    const { text } = req.body;

    console.log("🔥 GEMINI SUMMARY CALLED");

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Text is required",
      });
    }

    const summary = await geminiService.generateSummary(text);

    return res.json({
      success: true,
      summary,
    });

  } catch (error) {
    console.error("❌ Summary Error:", error);
    next(error);
  }
};