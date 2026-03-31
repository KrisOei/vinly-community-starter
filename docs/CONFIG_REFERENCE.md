# Config Reference

Complete reference for every field in `community.config.ts`.

## Schema Version

```typescript
version: 1  // Required. Always set to 1.
```

---

## Branding

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string (max 100) | Yes | Your community's display name |
| `abbreviation` | string (2-30) | Yes | URL slug — lowercase, numbers, hyphens only |
| `description` | string (max 1000) | Yes | Short community description |
| `tagline` | string (max 200) | No | One-liner shown on the hero section |
| `logoUrl` | https URL | No | Community logo (square, min 200x200px) |
| `coverImageUrl` | https URL | No | Hero banner image (min 1200x400px) |

---

## Theme

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `primaryColor` | hex color | — | Main brand color (e.g., `#6D28D9`) |
| `secondaryColor` | hex color | — | Secondary accent color |
| `accentColor` | hex color | secondaryColor | Optional tertiary accent |
| `fontFamily` | enum | `"Inter"` | Display font. Options: `Inter`, `DM Sans`, `Plus Jakarta Sans`, `Outfit`, `Space Grotesk`, `System` |
| `bodyFontFamily` | enum | `"Inter"` | Body text font (same options) |
| `borderRadius` | enum | `"md"` | Corner style. Options: `none`, `sm`, `md`, `lg`, `full` |
| `darkMode` | boolean | `false` | Enable dark mode by default |

---

## Onboarding

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `welcomeMessage` | string (max 2000) | — | Shown when a new member joins |
| `mandatoryOnboarding` | boolean | `false` | Must complete onboarding to access |
| `mandatoryIntroduction` | boolean | `false` | Must post an introduction |
| `locationMapQuestion` | boolean | `false` | Ask for location on a map |

### Onboarding Questions

Array of up to 10 questions:

```typescript
{
  question: "What are you building?",   // max 500 chars
  type: "text" | "select" | "multiselect" | "textarea",
  options: ["Option 1", "Option 2"],    // required for select/multiselect
  required: true,                        // default: true
  placeholder: "Tell us..."             // optional hint text
}
```

---

## Channels

Array of 1-25 channels:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | string (max 100) | — | Channel name |
| `description` | string (max 500) | — | What this channel is about |
| `emoji` | string (max 10) | — | Emoji icon |
| `isPrivate` | boolean | `false` | Only visible to approved members |
| `adminOnly` | boolean | `false` | Only admins can post |
| `approvalRequired` | boolean | `false` | Posts need admin approval |

---

## Membership Tiers

Array of up to 5 tiers (leave empty for free-only):

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | string (max 100) | — | Tier name |
| `description` | string (max 500) | — | Brief description |
| `price` | number (0-10000) | — | Monthly/yearly price in USD |
| `interval` | `"monthly"` or `"yearly"` | — | Billing interval |
| `trialDays` | number (0-365) | `0` | Free trial length |
| `features` | string[] (min 1) | — | Feature list |
| `highlighted` | boolean | `false` | Visual emphasis (most popular) |

---

## AI Assistant

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `false` | Turn on the AI assistant |
| `name` | string (max 50) | `"Community Assistant"` | Assistant's display name |
| `greeting` | string (max 500) | — | First message shown to users |
| `personality` | string (max 2000) | — | Prompt defining tone & behavior |
| `suggestedQuestions` | string[] (max 5) | — | Quick-action buttons |

---

## Event Templates

Array of up to 10 recurring event templates:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | string (max 200) | — | Event name |
| `description` | string (max 1000) | — | Event description |
| `type` | `"in-person"`, `"virtual"`, `"hybrid"` | `"virtual"` | Event format |
| `recurring` | boolean | `false` | Repeating event |

---

## Policies & Access

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `private` | boolean | `false` | Invite-only (members must be approved) |
| `termsOfService` | string (max 10000) | — | Custom ToS (markdown) |
| `privacyPolicy` | string (max 10000) | — | Custom privacy policy (markdown) |
| `joinScreeningQuestions` | string[] (max 5) | `[]` | Questions for join requests |
