import express from "express";
import * as geminiService from "../utils/geminiService.js";

const router = express.Router();

// ✅ TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "Summary route working ✅" });
});

// ✅ SUMMARY ROUTE (FIXED)
router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    console.log("🔥 GEMINI SUMMARY ROUTE HIT");

    const summary = await geminiService.generateSummary(text);

    res.json({
      success: true,
      summary, // ✅ clean response
    });

  } catch (error) {
    console.log("❌ Summary Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Error generating summary",
    });
  }
});

export default router;