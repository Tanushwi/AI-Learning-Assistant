import axios from "axios";

export const callAI = async (text) => {
  try {
    if (!text || text.trim().length === 0) {
      return "No text provided";
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: text,
        parameters: {
          max_length: 100,
          min_length: 30,
        },
        options: {
          wait_for_model: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ SAFE handling
    if (Array.isArray(response.data)) {
      return response.data[0]?.summary_text || "No summary";
    }

    // ⚠️ sometimes HF returns error object
    if (response.data?.error) {
      console.log("HF ERROR:", response.data.error);
      return generateFallback(text);
    }

    return generateFallback(text);

  } catch (err) {
    console.log("❌ AI ERROR FULL:", err.response?.data || err.message);
    return generateFallback(text);
  }
};

// 🔥 fallback (always works for demo)
const generateFallback = (text) => {
  return text.split(" ").slice(0, 20).join(" ") + "...";
};