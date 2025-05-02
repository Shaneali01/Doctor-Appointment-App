import React, { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";
import { Send, Stethoscope } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const ChatPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Welcome! I'm your medical AI assistant, ready to answer questions about health, symptoms, diseases, treatments, and more. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isFirstRender = useRef(true);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    isFirstRender.current = false;
  }, []);

  // Scroll to bottom on new messages (after first render)
  useEffect(() => {
    if (isFirstRender.current) return;
    if (messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }, 100);
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/chatbot/get-chat", { message: input });
      const aiMessage = {
        role: "ai",
        content: response.data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-aos="zoom-in"
      className="min-h-screen   mt-16 flex flex-col p-4 sm:p-6 lg:p-8"
    >
        
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3  backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-gray-200/50">
          <Stethoscope className="w-8 h-8 text-[#006D77] animate-pulse" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-teal-700">
            Medical AI Assistant
          </h2>
        </div>
        <p className="text-base sm:text-lg text-gray-700 mt-3 font-medium animate-fade-in tracking-wide">
          Your trusted guide for medical questions and advice
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 backdrop-blur-3xl rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-4 max-w-7xl mx-auto w-full border border-gray-200/30 transition-all duration-300 hover:shadow-3xl">
        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto max-h-[calc(100vh-18rem)] px-2 scrollbar-thin scrollbar-thumb-[#006D77] scrollbar-track-gray-50"
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-700 mt-12 animate-fade-in font-medium">
              Start a conversation with your medical AI assistant!
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } mb-4 animate-slide-in`}
              >
                <div
                  className={`flex items-start gap-3 max-w-[75%] p-4 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.03] ${
                    msg.role === "user"
                      ? "bg-teal-700 font-bold text-white"
                      : "bg-white/90 backdrop-blur-lg text-gray-700 border border-gray-200/40"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {msg.role === "user" ? (
                      <div className="w-9 h-9 rounded-full bg-amber-300 flex items-center justify-center text-white text-sm font-bold shadow-md">
                        U
                      </div>
                    ) : (
                      <Stethoscope className="w-9 h-9 text-[#006D77] animate-spin-slow" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm sm:text-base leading-relaxed font-medium">{msg.content}</p>
                    <p className="text-xs text-white mt-1 font-light">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start mb-4 animate-pulse">
              <div className="bg-white/90 backdrop-blur-lg text-gray-700 p-4 rounded-2xl shadow-lg flex items-center gap-3">
                <Stethoscope className="w-9 h-9 text-[#006D77] animate-bounce" />
                <span className="text-sm font-medium">Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="sticky bottom-0 flex items-center gap-3 bg-white/70 backdrop-blur-xl rounded-full p-2 shadow-xl border border-gray-200/50 transition-all duration-300 hover:shadow-2xl focus-within:ring-2 focus-within:ring-[#006D77]"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a medical question (e.g., 'What are symptoms of flu?')"
            className="flex-1 p-3 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-500 text-sm sm:text-base font-medium"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-3 bg-gradient-to-r from-[#006D77] to-gray-700 text-white rounded-full hover:from-[#005C66] hover:to-gray-800 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Disclaimer */}
      <p className="text-xs sm:text-sm text-gray-700 mt-4 text-center font-medium tracking-wide">
        Not a substitute for professional medical advice. Consult a doctor for accurate diagnosis and treatment.
      </p>
    </div>
  );
};

export default ChatPage;