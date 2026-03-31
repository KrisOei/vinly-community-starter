/**
 * GET /api/assistant
 * Returns the assistant config (name, greeting, personality, suggested questions).
 *
 * POST /api/assistant/chat
 * Body: { message, conversationHistory?: [] }
 * Simulates a chat message with the AI assistant.
 * Returns a mock response — in production this uses Vinly's LLM infrastructure.
 *
 * In production, this maps to OrganizationAgent + Anthropic/OpenAI APIs.
 */

import { NextRequest, NextResponse } from "next/server";
import config from "@/preview/lib/config";
import { users, events, channels } from "@/preview/mocks/db";

export async function GET() {
  if (!config.assistant?.enabled) {
    return NextResponse.json({ enabled: false });
  }

  return NextResponse.json({
    enabled: true,
    name: config.assistant.name,
    greeting: config.assistant.greeting ?? null,
    personality: config.assistant.personality,
    suggestedQuestions: config.assistant.suggestedQuestions ?? [],
  });
}

export async function POST(request: NextRequest) {
  if (!config.assistant?.enabled) {
    return NextResponse.json({ error: "Assistant is not enabled" }, { status: 404 });
  }

  const body = await request.json();
  const { message } = body;

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "message string is required" }, { status: 400 });
  }

  // Simple keyword-based mock responses
  const lower = message.toLowerCase();
  let reply: string;

  if (lower.includes("member") || lower.includes("who") || lower.includes("connect")) {
    const sample = users.slice(0, 3);
    reply = `Here are some members you might want to connect with:\n\n${sample.map((u) => `• **${u.name}** — ${u.title}. Building: ${u.building}`).join("\n")}\n\nWould you like me to introduce you to any of them?`;
  } else if (lower.includes("event") || lower.includes("happening") || lower.includes("calendar")) {
    const upcoming = events.filter((e) => e.status === "upcoming").slice(0, 3);
    reply = `Here's what's coming up:\n\n${upcoming.map((e) => `• **${e.name}** — ${e.date}, ${e.startTime} ${e.timezone} (${e.type})`).join("\n")}\n\nWant me to RSVP you to any of these?`;
  } else if (lower.includes("channel") || lower.includes("where") || lower.includes("post")) {
    const top = channels.slice(0, 4);
    reply = `Here are the most active channels:\n\n${top.map((c) => `• ${c.emoji ?? "#"} **${c.name}** — ${c.description ?? ""}  (${c.postCount} posts)`).join("\n")}\n\nWhich one interests you?`;
  } else if (lower.includes("help") || lower.includes("what can")) {
    reply = `I can help you with:\n\n• Finding members with specific skills or interests\n• Discovering upcoming events\n• Navigating channels\n• Getting community stats\n• Answering questions about how things work here\n\nJust ask!`;
  } else {
    reply = `Great question! In the live version of ${config.name}, I'd have access to the full community knowledge base to give you a detailed answer. For now, try asking me about:\n\n• Members and connections\n• Upcoming events\n• Active channels\n• How to get help`;
  }

  // Simulate a slight delay feel
  return NextResponse.json({
    id: `msg_${Date.now().toString(36)}`,
    role: "assistant",
    content: reply,
    assistantName: config.assistant.name,
    timestamp: new Date().toISOString(),
  });
}
