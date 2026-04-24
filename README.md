# Vinly Community Starter

A self-contained sandbox for designing and previewing your Vinly community. Configure your space — branding, channels, membership tiers, onboarding, events, and AI assistant — then preview it locally with realistic mock data.

**Runs fully offline.** No backend, no database, no API keys, no internet connection required.

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/vinly-co/vinly-community-starter.git
cd vinly-community-starter

# 2. Install dependencies
npm install

# 3. Set up environment (enables demo mode with mock data)
cp .env.example .env.local

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your community preview.

That's it. The app runs entirely on mock data — no internet connection needed.

---

## Environment Setup

The `.env.example` file ships with the project. Copy it to `.env.local` to get started:

```bash
cp .env.example .env.local
```

### Demo Mode (default — fully offline)

```env
NEXT_PUBLIC_DEMO_MODE=true
```

When demo mode is enabled:
- All API routes serve mock data from `preview/mocks/db.ts`
- Google Fonts are skipped — system fonts are used instead
- A "Demo Mode — Offline" badge appears on the page
- No internet connection is required at any point

### Live Mode (connect to Vinly API)

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_URL=https://api.vinly.co/v1
VINLY_API_KEY=your_api_key_here
NEXT_PUBLIC_ORG_ID=your_organization_id
```

When demo mode is disabled:
- The API client sends requests to `NEXT_PUBLIC_API_URL` with your API key
- Local mock API routes return `503` with a helpful message
- Google Fonts load from the network for custom typography
- Your community config is still read from `community.config.ts`

Get your API credentials from your Vinly dashboard at Settings > Developer.

---

## How It Works

```
community.config.ts  →  Zod schema  →  Parsed config
                                            ↓
                                    Mock database (db.ts)
                                            ↓
                                    API routes (/api/*)
                                            ↓
                                    API client (api.ts)
                                            ↓
                                    React components
                                            ↓
                                    Theme engine → CSS vars
                                            ↓
                                    Preview page
```

1. **Edit `community.config.ts`** — Define your community's branding, theme, channels, membership tiers, onboarding flow, events, and AI assistant.
2. **Preview locally** — `npm run dev` renders a full preview using mock data that matches your config.
3. **Validate** — `npm run validate` checks your config against the schema and scans for accidentally included secrets.
4. **Submit** — `npm run submit` packages your config into a clean JSON payload for the Vinly intake API or a PR submission.

---

## Project Structure

```
vinly-community-starter/
├── .env.example                 # Environment template (copy to .env.local)
├── community.config.ts          # Your community configuration (start here)
├── middleware.ts                # Demo mode guard for API routes
├── schema/
│   └── index.ts                 # Zod schema — validation, types, defaults
├── app/
│   ├── page.tsx                 # Preview page with all sections
│   ├── layout.tsx               # Root layout with theme injection
│   ├── globals.css              # CSS variables + Tailwind
│   └── api/                     # Mock API routes (demo mode only)
│       ├── community/route.ts   # Community profile + stats
│       ├── members/route.ts     # Member listing with search/filter
│       ├── channels/route.ts    # Channel listing
│       ├── posts/route.ts       # Post feed with comments
│       ├── events/route.ts      # Events with RSVP
│       ├── membership/route.ts  # Membership tiers + stats
│       ├── onboarding/route.ts  # Onboarding flow
│       ├── assistant/route.ts   # AI assistant chat
│       ├── notifications/route.ts # Member notifications
│       ├── chats/route.ts       # Direct messages & group chats
│       ├── invites/route.ts     # Invite management
│       └── search/route.ts      # Cross-entity search
├── preview/
│   ├── components/              # React components for each section
│   ├── mocks/
│   │   ├── data.ts              # Static display fixtures
│   │   └── db.ts                # In-memory mock database (fake data)
│   ├── lib/
│   │   ├── api.ts               # Typed API client (demo/live switching)
│   │   ├── config.ts            # Parsed config re-export
│   │   └── env.ts               # Environment helpers
│   └── themes/
│       └── engine.ts            # Theme → CSS variable generator
├── docs/
│   ├── API_REFERENCE.md         # All mock API endpoints
│   ├── CONFIG_REFERENCE.md      # Every config field explained
│   └── CUSTOMIZATION.md         # Theming, components, and extending
├── examples/
│   ├── book-club.config.ts      # Book club community
│   └── vc-network.config.ts     # VC/investor network
└── scripts/
    ├── validate.ts              # Config validation + secret scanning
    └── submit.ts                # Packaging for submission
```

---

## Configuration

All configuration lives in `community.config.ts`. The file exports a single object with these sections:

| Section | What it controls |
|---------|-----------------|
| **Branding** | Name, abbreviation (URL slug), description, tagline, logo, cover image |
| **Theme** | Colors, fonts, border radius, dark mode |
| **Onboarding** | Welcome message, questions, mandatory flags |
| **Channels** | Up to 25 channels with privacy and moderation settings |
| **Membership Tiers** | Up to 5 tiers with pricing, features, and trial periods |
| **AI Assistant** | Name, personality prompt, greeting, suggested questions |
| **Event Templates** | Recurring event definitions |
| **Policies** | Private/public, join screening questions, terms of service |

See [docs/CONFIG_REFERENCE.md](docs/CONFIG_REFERENCE.md) for every field with types and defaults.

### Try a different community style

```bash
# Book club community
cp examples/book-club.config.ts community.config.ts

# VC/investor network
cp examples/vc-network.config.ts community.config.ts
```

---

## Mock Data

In demo mode, the app is populated with realistic fake data:

| Entity | Count | Details |
|--------|-------|---------|
| **Members** | 12 | Mix of admins and members, various locations and roles |
| **Channels** | From config | Generated from your `channels` array |
| **Posts** | 15 | Across multiple channels, with comments and likes |
| **Comments** | ~60 | Distributed across posts |
| **Events** | 5 | Virtual, in-person, and recurring |
| **Notifications** | 10 | Chat, mention, event, like, comment, invite, system types |
| **Chats** | 3 | DMs and group chats with message history |
| **Invites** | 5 | Pending, accepted, declined statuses |
| **Membership Stats** | From config | Generated from your `membershipTiers` array |

All mock data lives in `preview/mocks/db.ts`. Edit the `SEED_USERS`, `POST_CONTENT`, and other arrays to match your community's domain.

---

## Mock API

The sandbox includes 12 API routes that mirror the real Vinly API shape. All data comes from your config + mock fixtures.

```bash
# Community profile and stats
GET /api/community

# Members with search, filter, and pagination
GET /api/members?role=admin&status=active&search=fintech&page=1&limit=10

# Channels
GET /api/channels

# Posts with channel filter and pagination
GET /api/posts?channel=channel_001&page=1&limit=10
POST /api/posts

# Events with status/type filter
GET /api/events?status=upcoming&type=virtual

# Membership tiers
GET /api/membership

# Onboarding config and submission
GET /api/onboarding
POST /api/onboarding

# AI assistant
GET /api/assistant
POST /api/assistant

# Notifications with type/unread filter
GET /api/notifications?type=chat&unread=true
PATCH /api/notifications  (mark read)

# Direct messages and group chats
GET /api/chats
GET /api/chats?id=chat_001
POST /api/chats

# Invites with status/type filter
GET /api/invites?status=pending
POST /api/invites

# Cross-entity search
GET /api/search?q=fintech&scope=members,posts,channels
```

Import the typed client in your components:

```typescript
import { getMembers, getPosts, chatWithAssistant } from "@/preview/lib/api";

const { members } = await getMembers({ search: "fintech" });
const { chats } = await getChats();
const { results } = await search("fintech", { scope: ["members", "posts"] });
```

See [docs/API_REFERENCE.md](docs/API_REFERENCE.md) for full request/response shapes.

---

## Theming

The theme engine converts your config into CSS custom properties. Components use semantic tokens — never hardcoded colors.

| Token | Tailwind Class | Source |
|-------|---------------|--------|
| `--color-primary` | `bg-primary`, `text-primary` | `theme.primaryColor` |
| `--color-secondary` | `bg-secondary` | `theme.secondaryColor` |
| `--color-accent` | `bg-accent` | `theme.accentColor` |
| `--color-surface` | `bg-surface` | White / dark background |
| `--color-surface-alt` | `bg-surface-alt` | Alternating sections |
| `--color-on-surface` | `text-on-surface` | Primary text |
| `--color-on-surface-muted` | `text-on-surface-muted` | Secondary text |
| `--color-border` | `border-border` | Borders |
| `--font-display` | `font-display` | Heading font |
| `--font-body` | `font-body` | Body font |
| `--radius-card` | `rounded-card` | Card corners |
| `--radius-button` | `rounded-button` | Button corners |

In demo mode, fonts fall back to system UI fonts for offline use.

See [docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md) for component customization and extending the theme.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the preview server at localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run validate` | Validate config schema + scan for secrets |
| `npm run submit` | Package config for submission to Vinly |

---

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS 3** with CSS custom properties
- **Zod** for schema validation
- **TypeScript** throughout

---

## Scoping

This starter is scoped to a **single organization/space**. The config, mock data, and preview all represent one community. In the full Vinly platform, a user can belong to multiple spaces — this sandbox focuses on designing and previewing one at a time.

---

## Security

- `.gitignore` aggressively blocks `.env` files, credential files, and private keys
- `npm run validate` scans all project files for leaked secrets (AWS keys, Stripe keys, JWTs, database URLs, etc.)
- Mock data is entirely fictional — no real users, no real payments, no PII
- The submit script strips non-serializable values and re-validates before packaging
- API key (`VINLY_API_KEY`) is server-side only — never exposed to the browser

---

## Troubleshooting

**"Mock API is disabled" error when hitting /api routes**
You have `NEXT_PUBLIC_DEMO_MODE=false` in your `.env.local`. Either set it to `true` for mock data, or configure `NEXT_PUBLIC_API_URL` and `VINLY_API_KEY` for live mode.

**Fonts look different from the config**
In demo mode, Google Fonts are skipped for offline use. System fonts are used instead. Set `NEXT_PUBLIC_DEMO_MODE=false` and connect to the internet to load custom fonts.

**Config validation fails**
Run `npm run validate` for detailed error messages. Common issues: missing required fields, invalid hex colors, abbreviation with spaces.

**Port 3000 is in use**
Run `npm run dev -- -p 3001` to use a different port.
