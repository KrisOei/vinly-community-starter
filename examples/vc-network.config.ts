/**
 * Example: VC / Investor Network
 * Copy this to community.config.ts and customize!
 */
import type { CommunityConfigInput } from "@/schema";

const config: CommunityConfigInput = {
  version: 1,
  name: "Seed & Series",
  abbreviation: "seed-series",
  description: "An exclusive network for early-stage investors. Share deal flow, co-invest, and build your thesis together.",
  tagline: "Where investors build conviction.",

  theme: {
    primaryColor: "#1E3A5F",
    secondaryColor: "#0EA5E9",
    fontFamily: "Space Grotesk",
    bodyFontFamily: "Inter",
    borderRadius: "sm",
    darkMode: true,
  },

  welcomeMessage: "Welcome to Seed & Series. This is a trusted space for investors to share deal flow, debate theses, and co-invest. Please introduce yourself in #introductions.",
  mandatoryOnboarding: true,
  mandatoryIntroduction: true,
  locationMapQuestion: true,
  onboardingQuestions: [
    { question: "What firm or fund are you with?", type: "text", required: true, placeholder: "e.g., Sequoia, solo GP, angel..." },
    { question: "What stage do you typically invest at?", type: "multiselect", options: ["Pre-seed", "Seed", "Series A", "Series B+", "Growth"], required: true },
    { question: "What sectors are you focused on?", type: "multiselect", options: ["SaaS", "Fintech", "Healthcare", "AI/ML", "Consumer", "Climate", "Crypto", "Other"], required: true },
    { question: "Check size range?", type: "select", options: ["$10K-$50K", "$50K-$250K", "$250K-$1M", "$1M-$5M", "$5M+"], required: true },
  ],

  channels: [
    { name: "Deal Flow", description: "Share deals and get quick feedback", emoji: "🎯" },
    { name: "Due Diligence", description: "Deep dives on specific companies", emoji: "🔍", isPrivate: true },
    { name: "Thesis Lab", description: "Debate investment theses and market trends", emoji: "🧪" },
    { name: "Co-Invest", description: "Find co-investors for specific deals", emoji: "🤝", isPrivate: true },
    { name: "Portfolio Support", description: "Help each other's portfolio companies", emoji: "🚀" },
    { name: "Introductions", description: "Welcome new members", emoji: "👋" },
    { name: "Off-Topic", description: "Life beyond the term sheet", emoji: "🍷" },
  ],

  membershipTiers: [
    {
      name: "Observer",
      description: "Read-only access to public channels",
      price: 0,
      interval: "monthly",
      features: ["Access to public channels", "Event invites", "Weekly digest"],
    },
    {
      name: "Member",
      description: "Full access to all channels and deal flow",
      price: 99,
      interval: "monthly",
      trialDays: 30,
      highlighted: true,
      features: ["Everything in Observer", "Deal Flow & Due Diligence channels", "Co-invest opportunities", "Priority event access", "Member directory"],
    },
    {
      name: "Inner Circle",
      description: "For active investors who want maximum access",
      price: 999,
      interval: "yearly",
      features: ["Everything in Member", "Private dinner invites", "LP intro network", "Annual summit ticket", "Direct line to GPs"],
    },
  ],

  assistant: {
    enabled: true,
    name: "Analyst",
    greeting: "I can help you find deals, investors, or portfolio companies in the network. What are you looking for?",
    personality: "You are Analyst, the AI assistant for Seed & Series. You speak like a sharp, well-read investor — concise, data-aware, and direct. You help members navigate deal flow, find co-investors, and surface relevant discussions. Never give specific investment advice or make return predictions.",
    suggestedQuestions: ["Who invests in climate tech?", "Any recent fintech deals shared?", "What events are coming up?"],
  },

  eventTemplates: [
    { name: "Weekly Deal Review", description: "Members present 2-3 interesting deals for group feedback.", type: "virtual", recurring: true },
    { name: "Quarterly LP Dinner", description: "In-person dinner for Inner Circle members.", type: "in-person", recurring: true },
  ],

  private: true,
  joinScreeningQuestions: [
    "What firm or fund are you investing from?",
    "How many investments have you made in the last 12 months?",
    "Who in the network can vouch for you?",
  ],
};

export default config;
