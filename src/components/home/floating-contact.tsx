"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Mail, X, Send, Phone, Bot, User } from "lucide-react";

// Custom SVG Icons for WhatsApp & Facebook
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.573-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 2C6.477 2 2 6.477 2 12c0 2.137.672 4.116 1.82 5.74L2 22l4.393-1.763A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.802 0-3.486-.5-4.927-1.373l-.353-.215-2.617 1.05.885-2.553-.236-.375A7.954 7.954 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hello! How can we help you with RealBiz today?",
      time: "Just now",
    },
  ]);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Auto-scroll to latest message when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  // 2. Auto-focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isChatOpen]);

  // 3. Close chat on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsChatOpen(false);
      }
    }

    if (isChatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    // Keep focus on input after sending
    inputRef.current?.focus();

    // Fake Bot Response
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Thanks for reaching out! Our team will get back to you shortly.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div
      ref={chatRef}
      className="fixed bottom-12 right-8 z-50 flex flex-col items-end"
    >
      {/* 1. Chat Popup Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-4 w-80 sm:w-96 rounded-2xl border border-border bg-card p-4 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-display text-sm font-semibold text-foreground">
                    RealBiz Support
                  </h4>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="my-3 max-h-64 min-h-[16rem] overflow-y-auto space-y-3 p-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-xs"
                        : "bg-muted text-foreground rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="mt-1 text-[10px] text-muted-foreground">
                    {msg.time}
                  </span>
                </div>
              ))}
              {/* Invisible anchor div for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="flex gap-2 border-t border-border pt-3"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Speed Dial Contact Actions */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-3 flex flex-col items-end gap-3"
          >
            {/* WhatsApp Button */}
            <motion.a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground shadow-md transition-colors hover:bg-emerald-500 hover:text-white"
            >
              <span>WhatsApp</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
                <WhatsAppIcon className="h-4 w-4" />
              </span>
            </motion.a>

            {/* Facebook Button */}
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground shadow-md transition-colors hover:bg-sky-600 hover:text-white"
            >
              <span>Facebook</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-600 text-white">
                <FacebookIcon className="h-4 w-4" />
              </span>
            </motion.a>

            {/* Email Button */}
            <motion.a
              href="mailto:support@realbiz.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground shadow-md transition-colors hover:bg-orange-500 hover:text-white"
            >
              <span>Email</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white">
                <Mail className="h-4 w-4" />
              </span>
            </motion.a>

            {/* Direct Live Message Button */}
            <motion.button
              onClick={() => {
                setIsChatOpen((prev) => !prev);
                setIsOpen(false);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground shadow-md transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span>Live Chat</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <MessageCircle className="h-4 w-4" />
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Floating Trigger Toggle Button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-xl ring-2 ring-accent/20 transition-all hover:shadow-2xl"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
