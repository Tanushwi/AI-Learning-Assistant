import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Zap } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRenderer";

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setInitialLoading(false);
    setHistory([]);
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userMsg = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      console.log("🚀 Sending:", message);

      const response = await axios.post(
        "http://localhost:8000/api/ai/chat",
        {
          documentId,
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
      console.error("❌ FULL ERROR:", error);

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
          {isUser ? (
            <p>{msg.content}</p>
          ) : (
            <MarkdownRenderer content={msg.content} />
          )}
        </div>

        {isUser && (
          <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

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
          <div className="flex gap-2">
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
            className="flex-1 p-3 border rounded-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 text-white px-4 rounded-xl"
          >
            <Send />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;