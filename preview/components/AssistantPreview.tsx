"use client";

import { useState } from "react";
import type { Assistant } from "@/schema";
import { chatWithAssistant } from "@/preview/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AssistantPreview({ assistant }: { assistant: Assistant }) {
  const name = assistant.name ?? "Assistant";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(text?: string) {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = { id: `u_${Date.now()}`, role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatWithAssistant(msg);
      const assistantMsg: Message = { id: res.id, role: "assistant", content: res.content };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `err_${Date.now()}`, role: "assistant", content: "Sorry, something went wrong. Try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-card border border-border bg-surface overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-bold">
            {name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-on-surface text-sm">{name}</h4>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Online
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {/* Greeting */}
          {assistant.greeting && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold flex-shrink-0">
                {name.charAt(0)}
              </div>
              <div className="bg-surface-alt rounded-card rounded-tl-sm px-4 py-3 max-w-[80%]">
                <p className="text-sm text-on-surface">{assistant.greeting}</p>
              </div>
            </div>
          )}

          {/* Suggested questions */}
          {assistant.suggestedQuestions &&
            assistant.suggestedQuestions.length > 0 &&
            messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pl-11">
                {assistant.suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/5 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

          {/* Conversation */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold flex-shrink-0">
                  {name.charAt(0)}
                </div>
              )}
              <div
                className={`rounded-card px-4 py-3 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-on-primary rounded-tr-sm"
                    : "bg-surface-alt text-on-surface rounded-tl-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold flex-shrink-0">
                {name.charAt(0)}
              </div>
              <div className="bg-surface-alt rounded-card rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-on-surface-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-on-surface-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-on-surface-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${name} anything...`}
              className="flex-1 px-4 py-2 rounded-button border border-border bg-surface text-on-surface text-sm placeholder:text-on-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary text-on-primary px-4 py-2 rounded-button hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>

      <p className="text-xs text-on-surface-muted text-center mt-4">
        Powered by the local mock API. In production, {name} uses Vinly&apos;s AI infrastructure with your personality prompt.
      </p>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
