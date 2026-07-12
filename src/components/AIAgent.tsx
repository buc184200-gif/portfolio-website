import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, Sparkles, Brain, CheckCircle2 } from "lucide-react";
import { getWhatsAppLink } from "../data/siteConfig";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
}

export const AIAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [thinking, setThinking] = useState(false); // Deep thinking mode toggle
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hi there! I am your AI Website Consultant for **Crestiva Web Studio**. I can help you choose the right package, estimate budgets, and plan features for your business. Ask me anything, or try one of the suggestions below!",
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  // Suggested Prompts
  const suggestions = [
    "What is the price of a basic website?",
    "Which package is best for my coaching institute?",
    "Can you make an e-commerce website?",
    "How long does a website take to build?",
    "Do you connect WhatsApp and Google Maps?"
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsGenerating(true);

    // Prepare history payload for server-side router
    const historyPayload = [...messages, userMsg].map((m) => ({
      role: m.role,
      text: m.text,
    }));

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyPayload,
          thinking: thinking, // Send deep thinking preference
        }),
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: data.text || "I apologize, I received an incomplete response.",
        },
      ]);
    } catch (err) {
      console.error("AI Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: "I am having trouble connecting to my brain right now. Please message us directly on WhatsApp (+91 93540 12056) for instant, human help!",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend(input);
    }
  };

  // Prepares pre-filled WhatsApp link with inquiry details
  const getAgentWhatsAppCTA = () => {
    const text = "Hi Khsuwant! I am chatting with your AI Website Consultant and wanted to discuss a new website plan for my business.";
    return getWhatsAppLink(text);
  };

  return (
    <>
      {/* Floating Glowing Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 shadow-[0_4px_30px_rgba(59,130,246,0.5)] border border-white/20 hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all duration-300"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <div className="relative">
                <Bot className="w-6 h-6 text-white" />
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-400 border border-slate-950 animate-pulse" />
              </div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Expanded Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-24 right-6 w-[92%] sm:w-[400px] h-[550px] z-50 rounded-2xl border border-white/10 bg-slate-950/85 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-950 to-indigo-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <Bot className="w-5 h-5 text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                    AI Website Consultant
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">By Crestiva Web Studio</p>
                </div>
              </div>

              {/* Deep Thinking Mode Toggle */}
              <button
                onClick={() => setThinking(!thinking)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono tracking-wider transition-all duration-300 ${
                  thinking
                    ? "border-purple-500 bg-purple-500/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                    : "border-white/15 bg-white/5 text-slate-400 hover:text-white"
                }`}
                title={thinking ? "Gemini 3.1 Pro (Deep reasoning active)" : "Gemini 3.5 Flash (Standard speed active)"}
              >
                <Brain className={`w-3 h-3 ${thinking ? "animate-pulse" : ""}`} />
                {thinking ? "THINKING: HIGH" : "FAST"}
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-900 border border-white/5 text-slate-300 rounded-bl-none"
                    }`}
                  >
                    {m.role === "model" ? (
                      // Render structured replies beautifully
                      <div className="space-y-1">
                        {m.text.split("\n\n").map((para, i) => (
                          <p key={i}>
                            {para.split("**").map((chunk, idx) =>
                              idx % 2 === 1 ? (
                                <strong key={idx} className="text-white font-semibold">
                                  {chunk}
                                </strong>
                              ) : (
                                chunk
                              )
                            )}
                          </p>
                        ))}
                      </div>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                    {thinking && <span className="text-[10px] text-purple-400 font-mono ml-2 animate-pulse">Deep thinking in progress...</span>}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Box */}
            {messages.length < 3 && (
              <div className="px-4 py-2 border-t border-white/5 bg-slate-950">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Suggestions</p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s)}
                      className="text-[11px] px-2.5 py-1 rounded-md border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-blue-500/30 transition-all duration-200"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sticky Action Footer inside Chat */}
            <div className="p-2 border-t border-white/5 bg-blue-950/20 text-center flex items-center justify-between px-4">
              <span className="text-[10px] text-slate-400">Ready to build? Discuss on WhatsApp:</span>
              <a
                href={getAgentWhatsAppCTA()}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 hover:underline"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Start Chat
              </a>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask pricing, package advise, timeline..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isGenerating}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
