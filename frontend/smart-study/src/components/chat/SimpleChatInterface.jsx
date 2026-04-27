import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Zap } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SimpleChatInterface = () => {
  const { id: documentId } = useParams();

  console.log("🔍 SimpleChatInterface - documentId:", documentId);
  console.log("🔍 useParams result:", useParams());

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setHistory([]);
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Fallback if documentId is undefined
    const fallbackDocId = documentId || "69c6bcf39a1e4119cc92dd34";
    console.log("🚀 Using documentId:", fallbackDocId);

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      console.log("🚀 Sending:", message);

      const response = await axios.post(
        "http://localhost:8000/api/ai/chat",
        {
          documentId: fallbackDocId,
          question: message,
        }
      );

      console.log("✅ Response:", response.data);

      const answer =
        response.data?.data?.answer ||
        "Answer not found in document.";

      const assistantMessage = {
        role: "assistant",
        content: answer,
        timestamp: new Date(),
      };

      setHistory((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("❌ ERROR:", error);

      // Always show a string error message
      let errorText = "Server not responding. Check backend.";
      if (error.response?.data?.error) {
        errorText = error.response.data.error;
      } else if (typeof error.response?.data === "string") {
        errorText = error.response.data;
      } else if (typeof error.message === "string") {
        errorText = error.message;
      }

      const errorMessage = {
        role: "assistant",
        content: errorText,
        timestamp: new Date(),
      };

      setHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={index}
        className={`flex items-start gap-3 my-4 ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        {!isUser && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
        )}

        <div
          className={`max-w-lg p-4 rounded-2xl ${
            isUser
              ? "bg-emerald-500 text-white"
              : "bg-white border text-slate-800"
          }`}
        >
          <p className="whitespace-pre-wrap">{msg.content}</p>
        </div>

        {isUser && (
          <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center">
            <span className="text-sm font-semibold">U</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-2xl shadow-xl">
      
      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {history.length === 0 ? (
          <div className="text-center">
            <MessageSquare className="mx-auto mb-4 text-emerald-500" />
            <p>Ask anything about document</p>
          </div>
        ) : (
          history.map(renderMessage)
        )}

        <div ref={messagesEndRef} />

        {loading && (
          <div className="flex gap-2 justify-center">
            <span className="animate-bounce">•</span>
            <span className="animate-bounce">•</span>
            <span className="animate-bounce">•</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 text-white px-4 rounded-xl hover:bg-emerald-600 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SimpleChatInterface;
