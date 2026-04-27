import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// ================= API KEY =================
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ GEMINI_API_KEY NOT SET");
}

// ================= INIT =================
let ai = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (err) {
  console.error("❌ Gemini init error:", err);
}


// ================= CHAT =================
export const chatWithContext = async (prompt, chunks) => {
  try {
    console.log("🚀 chatWithContext called");

    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
      return "No document content available.";
    }

    const questionMatch = prompt.match(/Question:\s*(.+)$/m);
    const question = questionMatch ? questionMatch[1].trim() : "";

    const context = chunks
      .map((c, i) => `[Chunk ${i + 1}]\n${c.content}`)
      .join("\n\n");

    const finalPrompt = `
You are an AI that answers ONLY from the document.

Rules:
- No external knowledge
- Answer strictly from document
- If not found → say "Answer not found in the document"

DOCUMENT:
${context}

QUESTION:
${question}
`;

    // ✅ FALLBACK
    if (!ai) {
      return context.substring(0, 300) + "...";
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: finalPrompt,
    });

    return response?.text || "No response generated.";

  } catch (error) {
    console.error("❌ Chat error:", error);
    return "AI service temporarily unavailable.";
  }
};


// ================= 🔥 IMPROVED SUMMARY =================
export const generateSummary = async (text) => {
  try {
    if (!text) return "No content available.";

    const prompt = `
Create a structured summary of the document.

Rules:
- Use clear headings
- Cover ALL important sections
- Keep it concise but informative
- Use bullet points where needed
- Do NOT write long paragraphs

Format EXACTLY like this:

Introduction:
...

Key Features:
- ...
- ...

Architecture / Working:
...

Core Concepts:
- ...
- ...

Applications:
- ...

Conclusion:
...

DOCUMENT:
${text.substring(0, 20000)}
`;

    // ✅ FALLBACK (structured)
    if (!ai) {
      return `
Introduction:
This document explains key concepts related to the topic.

Key Features:
- Important properties discussed
- Core characteristics explained

Architecture:
Basic working and structure described

Core Concepts:
- Main ideas included
- Fundamental terms explained

Applications:
Used in real-world scenarios

Conclusion:
Overall summary of document
`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    return response?.text || "Summary not generated.";

  } catch (error) {
    console.error("❌ Summary error:", error);
    return "Summary generation failed.";
  }
};


// ================= FLASHCARDS =================
export const generateFlashcards = async (text, count = 10) => {
  try {
    if (!ai) return [];

    const prompt = `
Generate ${count} flashcards from the text.

Format:
Q: ...
A: ...

TEXT:
${text.substring(0, 15000)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    return response?.text;

  } catch (error) {
    console.error("❌ Flashcard error:", error);
    return [];
  }
};


// ================= QUIZ =================
export const generateQuiz = async (text, num = 5) => {
  try {
    if (!ai) return [];

    const prompt = `
Generate ${num} MCQs.

Format:
Q:
O1:
O2:
O3:
O4:
Answer:

TEXT:
${text.substring(0, 15000)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    return response?.text;

  } catch (error) {
    console.error("❌ Quiz error:", error);
    return [];
  }
};


// ================= EXPLAIN =================
export const explainConcept = async (concept, context) => {
  try {
    if (!ai) {
      return `Explanation of ${concept}: ${context.substring(0, 200)}`;
    }

    const prompt = `
Explain "${concept}" clearly using the document.

Keep it simple and structured.

Context:
${context.substring(0, 10000)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    return response?.text;

  } catch (error) {
    console.error("❌ Explain error:", error);
    return "Explanation failed.";
  }
};