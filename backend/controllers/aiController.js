import Document from "../models/Document.js";
import ChatHistory from "../models/ChatHistory.js";
import * as geminiService from "../utils/geminiService.js";
import { chunkText, findRelevantChunks } from "../utils/textChunker.js";


// ================= CHAT =================
export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    console.log("🔍 Chat request:", { documentId, question });

    // ✅ Validation
    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        error: "Please provide documentId and question",
      });
    }

    // ✅ Fetch document
    const document = await Document.findById(documentId);

    // 🔥 FIX: Removed strict status check (main issue)
    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    console.log("📄 Document found:", {
      id: document._id,
      status: document.status,
      hasText: !!document.extractedText,
    });

    // ================= SAFE FALLBACK =================
    // 👉 If no extracted text → still return response (no crash)
    if (!document.extractedText) {
      return res.status(200).json({
        success: true,
        data: {
          answer: "Document text not available yet.",
        },
      });
    }

    let chunks = document.chunks || [];

    // ================= CHUNK GENERATION =================
    if (!chunks || chunks.length === 0) {
      console.log("🔄 Generating chunks...");

      chunks = chunkText(document.extractedText, 500, 50);

      await Document.findByIdAndUpdate(document._id, { chunks });

      console.log("✅ Chunks generated:", chunks.length);
    }

    // ================= FIND RELEVANT =================
    const relevantChunks = findRelevantChunks(chunks, question, 3);

    console.log("🎯 Relevant chunks:", relevantChunks.length);

    if (!relevantChunks || relevantChunks.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          answer: "Answer not found in the document.",
        },
      });
    }

    // ================= CONTEXT =================
    const context = relevantChunks.map(c => c.content).join("\n\n");

    const prompt = `
Answer ONLY using this document:

${context}

Question: ${question}
`;

    // ================= AI CALL =================
    let answer = "";

    try {
      answer = await geminiService.chatWithContext(prompt, chunks);
    } catch (aiError) {
      console.error("❌ Gemini Error:", aiError);

      // 🔥 Fallback if AI fails
      answer = "AI service temporarily unavailable. Please try again.";
    }

    // ================= SAVE CHAT =================
    let chatHistory = await ChatHistory.findOne({
      documentId: document._id,
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: document.userId || "demo_user",
        documentId: document._id,
        messages: [],
      });
    }

    chatHistory.messages.push(
      { role: "user", content: question },
      { role: "assistant", content: answer }
    );

    await chatHistory.save();

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      data: { answer },
    });

  } catch (error) {
    console.error("❌ Chat error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};


// ================= EXPLAIN =================
export const explainConcept = async (req, res, next) => {
  try {
    const { concept } = req.body;

    if (!concept) {
      return res.status(400).json({
        success: false,
        error: "Concept is required",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        explanation: `Explanation for "${concept}" will be added.`,
      },
    });

  } catch (error) {
    next(error);
  }
};


// ================= CHAT HISTORY =================
export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const history = await ChatHistory.findOne({ documentId });

    return res.status(200).json({
      success: true,
      data: history?.messages || [],
    });

  } catch (error) {
    next(error);
  }
};


// ================= DUMMY =================
export const generateFlashcards = async (req, res) => {
  return res.json({ success: true, data: [] });
};

export const generateQuiz = async (req, res) => {
  return res.json({ success: true, data: [] });
};


// ================= SUMMARY =================
export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Please provide documentId",
      });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    let chunks = document.chunks || [];

    if (!chunks || chunks.length === 0) {
      if (!document.extractedText) {
        return res.status(400).json({
          success: false,
          error: "No extracted text available",
        });
      }

      chunks = chunkText(document.extractedText, 500, 50);
      await Document.findByIdAndUpdate(document._id, { chunks });
    }

    const context = chunks.map(c => c.content).join("\n\n");

    let summary = "";

    try {
      summary = await geminiService.generateSummary(context);
    } catch (err) {
      console.error("❌ Summary AI Error:", err);
      summary = "Summary generation failed. Try again.";
    }

    res.json({
      success: true,
      data: summary,
    });

  } catch (error) {
    console.error("❌ Generate summary error:", error);
    next(error);
  }
};