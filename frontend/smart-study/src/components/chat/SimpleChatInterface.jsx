import React,
{
  useState,
  useEffect,
  useRef
} from "react";

import {
  Send,
  MessageSquare,
  Zap
} from "lucide-react";

import axios from "axios";

const SimpleChatInterface = ({
  documentId,
  document,
}) => {

  const [history, setHistory] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const messagesEndRef =
    useRef(null);

  // ==========================================
  // AUTO SCROLL
  // ==========================================

  const scrollToBottom = () => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  useEffect(() => {

    scrollToBottom();

  }, [history]);

  // ==========================================
  // LOAD CHAT HISTORY
  // ==========================================

  useEffect(() => {

    const savedChats =
      localStorage.getItem(
        `chat-${documentId}`
      );

    if (savedChats) {

      setHistory(
        JSON.parse(savedChats)
      );

    } else {

      setHistory([]);
    }

  }, [documentId]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const handleSendMessage =
    async (e) => {

      e.preventDefault();

      if (
        !message.trim()
      ) return;

      // ==========================================
      // USER MESSAGE
      // ==========================================

      const userMessage = {

        role: "user",

        content: message,
      };

      const updatedUserHistory = [
        ...history,
        userMessage,
      ];

      setHistory(
        updatedUserHistory
      );

      localStorage.setItem(
        `chat-${documentId}`,
        JSON.stringify(
          updatedUserHistory
        )
      );

      const currentMessage =
        message;

      setMessage("");

      setLoading(true);

      try {

        // ==========================================
        // TOKEN
        // ==========================================

        const token =
          localStorage.getItem(
            "token"
          );

        // ==========================================
        // DOCUMENT CONTENT
        // ==========================================

        const documentContent =

          document?.content ||

          document?.text ||

          document?.parsedText ||

          document?.extractedText ||

          document?.documentText ||

          document?.data?.content ||

          document?.data?.text ||

          document?.data?.parsedText ||

          document?.data?.extractedText ||

          document?.data?.documentText ||

          "";

        // ==========================================
        // API CALL
        // ==========================================

        const response =
          await axios.post(
            "http://localhost:8000/api/ai/chat",
            {

              documentId,

              message:
                currentMessage,

              documentContent,

            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        // ==========================================
        // AI RESPONSE
        // ==========================================

        const aiReply = {

          role: "assistant",

          content:

            response?.data
              ?.response ||

            response?.data
              ?.answer ||

            response?.data
              ?.message ||

            "Relevant answer was not found in the uploaded document.",
        };

        const updatedAIHistory = [
          ...updatedUserHistory,
          aiReply,
        ];

        setHistory(
          updatedAIHistory
        );

        localStorage.setItem(
          `chat-${documentId}`,
          JSON.stringify(
            updatedAIHistory
          )
        );

      } catch (error) {

        console.log(
          "CHAT ERROR:",
          error
        );

        const errorMessage = {

          role: "assistant",

          content:

            error?.response
              ?.data
              ?.message ||

            "Failed to get response from AI",
        };

        const updatedErrorHistory = [
          ...updatedUserHistory,
          errorMessage,
        ];

        setHistory(
          updatedErrorHistory
        );

        localStorage.setItem(
          `chat-${documentId}`,
          JSON.stringify(
            updatedErrorHistory
          )
        );

      } finally {

        setLoading(false);
      }
    };

  // ==========================================
  // CLEAR CHAT
  // ==========================================

  const handleClearChat = () => {

    localStorage.removeItem(
      `chat-${documentId}`
    );

    setHistory([]);

  };

  // ==========================================
  // UI
  // ==========================================

  return (

    <div
      className="
      flex
      flex-col
      h-[75vh]
      bg-white
      rounded-3xl
      border
      shadow-sm
      overflow-hidden
      "
    >

      {/* HEADER */}

      <div
        className="
        px-6
        py-5
        border-b
        flex
        items-center
        justify-between
        "
      >

        <div
          className="
          flex
          items-center
          gap-3
          "
        >

          <div
            className="
            w-12
            h-12
            rounded-2xl
            bg-emerald-100
            flex
            items-center
            justify-center
            "
          >

            <MessageSquare
              className="
              text-emerald-600
              w-6
              h-6
              "
            />

          </div>

          <div>

            <h2
              className="
              text-xl
              font-bold
              "
            >
              AI Chat Assistant
            </h2>

            <p
              className="
              text-sm
              text-gray-500
              "
            >
              Ask questions from{" "}
              <span className="font-medium text-emerald-600">
                {
                  document?.title ||
                  "your document"
                }
              </span>
            </p>

          </div>

        </div>

        {
          history.length > 0 && (

            <button
              onClick={
                handleClearChat
              }
              className="
              text-sm
              px-4
              py-2
              rounded-xl
              border
              hover:bg-red-50
              hover:text-red-500
              transition
              "
            >
              Clear Chat
            </button>
          )
        }

      </div>

      {/* CHAT AREA */}

      <div
        className="
        flex-1
        overflow-y-auto
        p-6
        space-y-5
        bg-gray-50
        "
      >

        {
          history.map(
            (msg, index) => {

              const isUser =
                msg.role === "user";

              return (

                <div
                  key={index}
                  className={`
                  flex
                  ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }
                  `}
                >

                  <div
                    className={`
                    max-w-[75%]
                    px-5
                    py-4
                    rounded-3xl
                    text-[15px]
                    leading-7
                    shadow-sm
                    whitespace-pre-wrap
                    ${
                      isUser
                        ? "bg-emerald-500 text-white"
                        : "bg-white border"
                    }
                    `}
                  >

                    {msg.content}

                  </div>

                </div>
              );
            }
          )
        }

        {
          loading && (

            <div
              className="
              bg-white
              border
              rounded-3xl
              px-5
              py-4
              w-fit
              shadow-sm
              "
            >
              Thinking...
            </div>
          )
        }

        <div ref={messagesEndRef} />

      </div>

      {/* INPUT */}

      <form
        onSubmit={
          handleSendMessage
        }
        className="
        p-5
        border-t
        bg-white
        flex
        gap-4
        "
      >

        <input
          type="text"
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          placeholder={`Ask about ${
            document?.title ||
            "your document"
          }`}
          className="
          flex-1
          border
          rounded-2xl
          px-5
          py-4
          outline-none
          focus:ring-2
          focus:ring-emerald-500
          "
        />

        <button
          type="submit"
          disabled={loading}
          className="
          w-14
          h-14
          rounded-2xl
          bg-emerald-500
          text-white
          flex
          items-center
          justify-center
          hover:bg-emerald-600
          transition
          "
        >

          <Send className="w-5 h-5" />

        </button>

      </form>

    </div>
  );
};

export default SimpleChatInterface;