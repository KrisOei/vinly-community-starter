/**
 * Example: Book Club Community
 * Copy this to community.config.ts and customize!
 */
import type { CommunityConfigInput } from "@/schema";

const config: CommunityConfigInput = {
  version: 1,
  name: "The Reading Room",
  abbreviation: "reading-room",
  description: "A cozy community for avid readers. Monthly book picks, lively discussions, and author Q&As.",
  tagline: "Read more. Think deeper. Connect.",

  theme: {
    primaryColor: "#92400E",
    secondaryColor: "#D97706",
    accentColor: "#059669",
    fontFamily: "Plus Jakarta Sans",
    bodyFontFamily: "Inter",
    borderRadius: "md",
    darkMode: false,
  },

  welcomeMessage: "Welcome to The Reading Room! We pick one book per month and dive deep. Check out #current-read to see what we're reading now.",
  mandatoryOnboarding: false,
  mandatoryIntroduction: true,
  locationMapQuestion: false,
  onboardingQuestions: [
    { question: "What genres do you enjoy most?", type: "multiselect", options: ["Fiction", "Non-fiction", "Sci-Fi", "Fantasy", "Mystery", "Biography", "Business", "Philosophy"], required: true },
    { question: "How many books do you read per year?", type: "select", options: ["1-5", "6-12", "13-24", "25+"], required: true },
  ],

  channels: [
    { name: "Current Read", description: "Discussion about this month's book pick", emoji: "📖" },
    { name: "General", description: "Off-topic chat and hanging out", emoji: "💬" },
    { name: "Recommendations", description: "Share and discover your next read", emoji: "⭐" },
    { name: "Author Spotlight", description: "Monthly author Q&As and features", emoji: "✍️", adminOnly: true },
    { name: "Book Reviews", description: "Post your reviews and ratings", emoji: "📝" },
  ],

  membershipTiers: [],
  private: false,
  joinScreeningQuestions: [],
};

export default config;
