/**
 * Vinly Community Config Schema
 *
 * This Zod schema defines every customizable property for a Vinly community.
 * It is validated locally (npm run validate), in CI, and server-side on submission.
 *
 * SECURITY: This schema only accepts declarative data — no functions, no code,
 * no imports. All string fields are sanitized against script injection.
 */

import { z } from "zod";

// ─── Sanitization helpers ──────────────────────────────────────────────────────

/** Safe string with a max length — rejects script injection, JS URIs, and event handlers */
const safeText = (max: number) =>
  z
    .string()
    .max(max)
    .refine(
      (val) =>
        !/<script/i.test(val) &&
        !/javascript:/i.test(val) &&
        !/on\w+\s*=/i.test(val) &&
        !/data:\s*text\/html/i.test(val),
      { message: "String contains potentially unsafe content" }
    );

/** Hex color: #RGB or #RRGGBB */
const hexColor = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
  message: "Must be a hex color (e.g. #1A73E8)",
});

/** URL that must be https */
const httpsUrl = z
  .string()
  .url()
  .refine((val) => val.startsWith("https://"), {
    message: "URLs must use https://",
  })
  .optional();

// ─── Sub-schemas ───────────────────────────────────────────────────────────────

export const ThemeSchema = z.object({
  primaryColor: hexColor.describe("Main brand color"),
  secondaryColor: hexColor.describe("Secondary accent color"),
  accentColor: hexColor.optional().describe("Optional tertiary accent"),
  fontFamily: z
    .enum([
      "Inter",
      "DM Sans",
      "Plus Jakarta Sans",
      "Outfit",
      "Space Grotesk",
      "System",
    ])
    .default("Inter")
    .describe("Display font family"),
  bodyFontFamily: z
    .enum([
      "Inter",
      "DM Sans",
      "Plus Jakarta Sans",
      "Outfit",
      "Space Grotesk",
      "System",
    ])
    .default("Inter")
    .describe("Body text font family"),
  borderRadius: z
    .enum(["none", "sm", "md", "lg", "full"])
    .default("md")
    .describe("Corner rounding style"),
  darkMode: z.boolean().default(false).describe("Enable dark mode by default"),
});

export const OnboardingQuestionSchema = z.object({
  question: safeText(500),
  type: z.enum(["text", "select", "multiselect", "textarea"]),
  options: z.array(safeText(200)).optional(),
  required: z.boolean().default(true),
  placeholder: safeText(200).optional(),
});

export const ChannelSchema = z.object({
  name: safeText(100),
  description: safeText(500).optional(),
  emoji: safeText(10).optional(),
  isPrivate: z.boolean().default(false),
  adminOnly: z.boolean().default(false),
  approvalRequired: z.boolean().default(false),
});

export const MembershipTierSchema = z.object({
  name: safeText(100),
  description: safeText(500).optional(),
  price: z.number().min(0).max(10000),
  interval: z.enum(["monthly", "yearly"]),
  trialDays: z.number().int().min(0).max(365).default(0),
  features: z.array(safeText(200)).min(1),
  highlighted: z.boolean().default(false),
});

export const AssistantSchema = z.object({
  enabled: z.boolean().default(false),
  name: safeText(50).default("Community Assistant"),
  greeting: safeText(500).optional(),
  personality: safeText(2000).describe(
    "Prompt template that defines the assistant's tone and behavior"
  ),
  suggestedQuestions: z.array(safeText(200)).max(5).optional(),
});

export const EventSchema = z.object({
  name: safeText(200),
  description: safeText(1000).optional(),
  type: z.enum(["in-person", "virtual", "hybrid"]).default("virtual"),
  recurring: z.boolean().default(false),
});

// ─── Main Config Schema ────────────────────────────────────────────────────────

export const CommunityConfigSchema = z.object({
  /** Schema version for future migrations */
  version: z.literal(1),

  // ── Branding ──────────────────────────────────────────────────────────────
  name: safeText(100).describe("Your community's display name"),
  abbreviation: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[a-z0-9-]+$/, {
      message: "URL slug: lowercase letters, numbers, and hyphens only",
    })
    .describe("URL slug (e.g. 'my-community' → vinly.co/o/my-community)"),
  description: safeText(1000).describe("Short community description"),
  tagline: safeText(200).optional().describe("One-liner shown on the hero"),
  logoUrl: httpsUrl.describe("Community logo (square, min 200x200)"),
  coverImageUrl: httpsUrl.describe("Hero banner image (min 1200x400)"),
  theme: ThemeSchema,

  // ── Onboarding ────────────────────────────────────────────────────────────
  welcomeMessage: safeText(2000)
    .optional()
    .describe("Message shown when a new member joins"),
  onboardingQuestions: z
    .array(OnboardingQuestionSchema)
    .max(10)
    .default([])
    .describe("Questions asked during member onboarding"),
  mandatoryOnboarding: z
    .boolean()
    .default(false)
    .describe("Require onboarding completion before access"),
  mandatoryIntroduction: z
    .boolean()
    .default(false)
    .describe("Require members to post an introduction"),
  locationMapQuestion: z
    .boolean()
    .default(false)
    .describe("Ask members for their location on a map"),

  // ── Channels ──────────────────────────────────────────────────────────────
  channels: z
    .array(ChannelSchema)
    .min(1)
    .max(25)
    .describe("Community channels (discussion spaces)"),

  // ── Membership Tiers ──────────────────────────────────────────────────────
  membershipTiers: z
    .array(MembershipTierSchema)
    .max(5)
    .default([])
    .describe("Paid membership tiers (leave empty for free-only)"),

  // ── AI Assistant ──────────────────────────────────────────────────────────
  assistant: AssistantSchema.optional().describe(
    "AI-powered community assistant configuration"
  ),

  // ── Events (templates) ────────────────────────────────────────────────────
  eventTemplates: z
    .array(EventSchema)
    .max(10)
    .default([])
    .describe("Recurring event templates to pre-create"),

  // ── Policies & Access ─────────────────────────────────────────────────────
  private: z
    .boolean()
    .default(false)
    .describe("Invite-only community (members must be approved)"),
  termsOfService: safeText(10000).optional(),
  privacyPolicy: safeText(10000).optional(),
  joinScreeningQuestions: z
    .array(safeText(500))
    .max(5)
    .default([])
    .describe("Questions shown when someone requests to join"),
});

// ─── Derived Types ─────────────────────────────────────────────────────────────

/** Output type — fully resolved with all defaults applied (used internally) */
export type CommunityConfig = z.infer<typeof CommunityConfigSchema>;

/** Input type — defaults are optional (use this when writing community.config.ts) */
export type CommunityConfigInput = z.input<typeof CommunityConfigSchema>;

export type Theme = z.infer<typeof ThemeSchema>;
export type ThemeInput = z.input<typeof ThemeSchema>;
export type OnboardingQuestion = z.infer<typeof OnboardingQuestionSchema>;
export type Channel = z.input<typeof ChannelSchema>;
export type MembershipTier = z.input<typeof MembershipTierSchema>;
export type Assistant = z.input<typeof AssistantSchema>;
export type EventTemplate = z.input<typeof EventSchema>;
