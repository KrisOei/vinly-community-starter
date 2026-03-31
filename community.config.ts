/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  VINLY COMMUNITY CONFIG                                         ║
 * ║                                                                  ║
 * ║  This is your community's single source of truth.                ║
 * ║  Edit the values below, save, and watch your preview update.     ║
 * ║                                                                  ║
 * ║  Run `npm run dev` to preview  |  `npm run validate` to check    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import type { CommunityConfigInput } from "@/schema";

const config: CommunityConfigInput = {
  version: 1,

  // ── Branding ────────────────────────────────────────────────────────────────
  name: "Indie Founders Collective",
  abbreviation: "indie-founders",
  description:
    "A private community for bootstrapped founders building profitable businesses without venture capital. Share wins, get feedback, and find your people.",
  tagline: "Build profitable. Build together.",
  logoUrl: undefined,
  coverImageUrl: undefined,

  theme: {
    primaryColor: "#6D28D9",
    secondaryColor: "#F59E0B",
    accentColor: "#10B981",
    fontFamily: "DM Sans",
    bodyFontFamily: "Inter",
    borderRadius: "lg",
    darkMode: false,
  },

  // ── Onboarding ──────────────────────────────────────────────────────────────
  welcomeMessage:
    "Welcome to the Indie Founders Collective! We're glad you're here. Take a moment to introduce yourself and tell us what you're building.",
  mandatoryOnboarding: true,
  mandatoryIntroduction: true,
  locationMapQuestion: true,

  onboardingQuestions: [
    {
      question: "What are you currently building?",
      type: "textarea",
      required: true,
      placeholder: "Tell us about your project or business...",
    },
    {
      question: "What stage is your business at?",
      type: "select",
      options: [
        "Idea stage",
        "Building MVP",
        "Launched, finding PMF",
        "Growing (revenue)",
        "Scaled / profitable",
      ],
      required: true,
    },
    {
      question: "What's your biggest challenge right now?",
      type: "select",
      options: [
        "Finding customers",
        "Building the product",
        "Pricing strategy",
        "Hiring / delegation",
        "Staying motivated",
        "Other",
      ],
      required: true,
    },
    {
      question: "How did you hear about us?",
      type: "text",
      required: false,
      placeholder: "Twitter, friend referral, blog post...",
    },
  ],

  // ── Channels ────────────────────────────────────────────────────────────────
  channels: [
    {
      name: "General",
      description: "The town square — anything goes",
      emoji: "💬",
    },
    {
      name: "Introductions",
      description: "Say hi and tell us what you're building",
      emoji: "👋",
    },
    {
      name: "Wins",
      description: "Celebrate your milestones — big or small",
      emoji: "🎉",
    },
    {
      name: "Feedback",
      description: "Get honest feedback on your product, landing page, or idea",
      emoji: "🔍",
    },
    {
      name: "Resources",
      description: "Share tools, articles, and templates",
      emoji: "📚",
    },
    {
      name: "Accountability",
      description: "Weekly check-ins and goal tracking",
      emoji: "🎯",
    },
    {
      name: "Hiring",
      description: "Post jobs or find collaborators",
      emoji: "🤝",
      adminOnly: false,
    },
    {
      name: "Announcements",
      description: "Community updates from the admin team",
      emoji: "📢",
      adminOnly: true,
    },
  ],

  // ── Membership Tiers ────────────────────────────────────────────────────────
  membershipTiers: [
    {
      name: "Community",
      description: "Full access to all channels and events",
      price: 0,
      interval: "monthly",
      features: [
        "Access to all public channels",
        "Community events",
        "Member directory",
        "Weekly digest email",
      ],
    },
    {
      name: "Builder",
      description: "Everything in Community plus premium perks",
      price: 29,
      interval: "monthly",
      trialDays: 14,
      highlighted: true,
      features: [
        "Everything in Community",
        "Private mastermind channel",
        "Monthly 1-on-1 with a mentor",
        "Priority feedback queue",
        "AI-powered business insights",
      ],
    },
    {
      name: "Founder Circle",
      description: "For serious founders who want the full experience",
      price: 249,
      interval: "yearly",
      trialDays: 7,
      features: [
        "Everything in Builder",
        "Annual founder retreat invite",
        "Investor introductions",
        "Featured founder spotlight",
        "Custom community badge",
      ],
    },
  ],

  // ── AI Assistant ────────────────────────────────────────────────────────────
  assistant: {
    enabled: true,
    name: "Scout",
    greeting:
      "Hey! I'm Scout, your community assistant. I can help you find members, navigate channels, or answer questions about the community.",
    personality:
      "You are Scout, the AI assistant for the Indie Founders Collective. You're friendly, concise, and encouraging. You speak like a fellow founder — direct but supportive. When members ask for advice, you draw on common bootstrapping wisdom. You never give financial or legal advice. Keep responses short and actionable.",
    suggestedQuestions: [
      "Who else is building in my space?",
      "What events are coming up?",
      "How do I get feedback on my landing page?",
      "What are the most active channels?",
    ],
  },

  // ── Events ──────────────────────────────────────────────────────────────────
  eventTemplates: [
    {
      name: "Weekly Standup",
      description:
        "15-minute lightning round: what you shipped this week, what's next, where you're stuck.",
      type: "virtual",
      recurring: true,
    },
    {
      name: "Monthly Demo Day",
      description:
        "5 founders get 5 minutes each to demo their latest feature or product to the community.",
      type: "virtual",
      recurring: true,
    },
    {
      name: "Quarterly Retreat",
      description:
        "In-person gathering for deep work, workshops, and relationship building.",
      type: "in-person",
      recurring: true,
    },
  ],

  // ── Policies & Access ──────────────────────────────────────────────────────
  private: true,
  joinScreeningQuestions: [
    "What are you currently building or working on?",
    "Why do you want to join the Indie Founders Collective?",
  ],
  termsOfService: undefined,
  privacyPolicy: undefined,
};

export default config;
