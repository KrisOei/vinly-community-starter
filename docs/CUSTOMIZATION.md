# Customization Guide

How to customize the look, feel, and behavior of your Vinly community preview.

---

## Theme System

The theme engine (`preview/themes/engine.ts`) converts your `theme` config into CSS custom properties injected at runtime. Components never reference colors directly — they use semantic tokens.

### Color Tokens

| CSS Variable | Tailwind Class | Source |
|---|---|---|
| `--color-primary` | `bg-primary`, `text-primary`, `border-primary` | `theme.primaryColor` |
| `--color-primary-light` | `bg-primary-light` | Auto-generated (lightened primary) |
| `--color-secondary` | `bg-secondary`, `text-secondary` | `theme.secondaryColor` |
| `--color-accent` | `bg-accent` | `theme.accentColor` (falls back to secondary) |
| `--color-surface` | `bg-surface` | White (light) / `#111827` (dark) |
| `--color-surface-alt` | `bg-surface-alt` | `#F9FAFB` (light) / `#1F2937` (dark) |
| `--color-on-primary` | `text-on-primary` | Always white |
| `--color-on-surface` | `text-on-surface` | Dark text (light) / light text (dark) |
| `--color-on-surface-muted` | `text-on-surface-muted` | Muted text color |
| `--color-border` | `border-border` | Border color |

### Font Tokens

| CSS Variable | Tailwind Class | Source |
|---|---|---|
| `--font-display` | `font-display` | `theme.fontFamily` — used on headings |
| `--font-body` | `font-body` | `theme.bodyFontFamily` — used on body text |

Available fonts: `Inter`, `DM Sans`, `Plus Jakarta Sans`, `Outfit`, `Space Grotesk`, `System`.

### Border Radius Tokens

| CSS Variable | Tailwind Class | Options |
|---|---|---|
| `--radius-card` | `rounded-card` | `none` (0) / `sm` (4px) / `md` (8px) / `lg` (16px) / `full` (24px) |
| `--radius-button` | `rounded-button` | Scales with card radius |

### Dark Mode

Set `theme.darkMode: true` in your config. The theme engine swaps surface and text colors automatically. The `dark` class is added to `<html>` via `app/layout.tsx`.

---

## Modifying Components

All preview components live in `preview/components/`. They're standard React components that use Tailwind classes mapped to theme tokens.

### Component Architecture

| Component | File | Data Source | Interactive? |
|---|---|---|---|
| `HeroSection` | `HeroSection.tsx` | Config + mock users | No |
| `ChannelList` | `ChannelList.tsx` | Config channels | No |
| `PostFeed` | `PostFeed.tsx` | Mock posts | No |
| `EventList` | `EventList.tsx` | Mock events | No |
| `MemberGrid` | `MemberGrid.tsx` | Mock users | No |
| `MembershipTiers` | `MembershipTiers.tsx` | Config tiers | No |
| `OnboardingPreview` | `OnboardingPreview.tsx` | Config questions | Yes (step navigation) |
| `AssistantPreview` | `AssistantPreview.tsx` | Config + API | Yes (chat interface) |
| `PreviewNav` | `PreviewNav.tsx` | Config | Yes (anchor navigation) |
| `ThemeProvider` | `ThemeProvider.tsx` | Config theme | N/A (provider) |

### Adding a Component

1. Create your component in `preview/components/`
2. Use theme tokens: `bg-primary`, `text-on-surface`, `rounded-card`, etc.
3. Import mock data from `@/preview/mocks/data` or `@/preview/mocks/db`
4. Add it to `app/page.tsx` inside a `<section>` block

Example:

```tsx
import { mockUsers } from "@/preview/mocks/data";

export function MemberMap() {
  const locations = mockUsers.map((u) => u.location);
  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h3 className="text-lg font-semibold font-display text-on-surface mb-4">
        Where our members are
      </h3>
      <ul className="space-y-2">
        {locations.map((loc) => (
          <li key={loc} className="text-sm text-on-surface-muted">{loc}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Mock Data

### Static Fixtures (`preview/mocks/data.ts`)

Lightweight display data used by server components. Contains `mockUsers`, `mockPosts`, `mockEvents`, and `mockAssistantConversation`.

### Mock Database (`preview/mocks/db.ts`)

Full mock data store used by API routes. Seeded from your config (channels, tiers) and hardcoded fixtures (users, posts). Includes:

- `users` — 12 members with varied roles, statuses, and plans
- `channels` — Generated from your config channels
- `posts` — 15 posts across multiple channels with comments
- `events` — 5 events (virtual, in-person, recurring)
- `notifications` — 10 notifications of various types
- `chats` — 3 conversations (DMs and group chats)
- `invites` — 5 invites in different statuses
- `membershipStats` — Generated from your config tiers

### Customizing Mock Data

To change mock data, edit `preview/mocks/db.ts`. The `SEED_USERS` array controls member profiles. The `POST_CONTENT` array controls feed content. Add entries to match your community's domain.

For example, if you're building a book club community, replace the startup-themed posts with book discussion posts:

```typescript
const POST_CONTENT = [
  { channel: "Current Read", content: "Just finished chapter 12 — the plot twist was incredible..." },
  { channel: "Recommendations", content: "If you liked Dune, you'll love this..." },
];
```

---

## Adding API Routes

Mock API routes live in `app/api/`. Each route reads from `preview/mocks/db.ts` and returns JSON that matches the shape of the real Vinly API.

### Route Pattern

```typescript
import { NextRequest, NextResponse } from "next/server";
import { someData } from "@/preview/mocks/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  // Read query params, filter data, return JSON
  return NextResponse.json({ data: someData });
}
```

### Using the API Client

The typed API client (`preview/lib/api.ts`) wraps `fetch` calls with type annotations. Add new functions to match any routes you create:

```typescript
export function getNotifications(params?: { type?: string; unread?: boolean }) {
  const qs = new URLSearchParams();
  if (params?.type) qs.set("type", params.type);
  if (params?.unread) qs.set("unread", "true");
  const query = qs.toString();
  return fetcher<{ notifications: Notification[]; unreadCount: number }>(
    `/notifications${query ? `?${query}` : ""}`
  );
}
```

---

## Extending the Schema

The Zod schema (`schema/index.ts`) defines what's valid in `community.config.ts`. To add a new config field:

1. Add the field to the appropriate sub-schema in `schema/index.ts`
2. Export the inferred type
3. Use it in your components or API routes via `@/preview/lib/config`

The schema includes sanitization helpers (`safeText`, `hexColor`, `httpsUrl`) to prevent XSS and validate inputs.

---

## Production Differences

| Feature | Sandbox | Production |
|---|---|---|
| Data source | Mock fixtures | PostgreSQL + Prisma |
| Auth | None | Clerk |
| AI assistant | Keyword matching | Anthropic / OpenAI / Groq |
| Payments | Static tiers | Stripe |
| Email | None | SendGrid |
| File storage | None | Supabase Storage |
| Real-time | None | Polling / WebSocket |
| Search | In-memory filter | Full-text + vector search |

The API response shapes are the same in both environments. Components built for the sandbox work in production with minimal changes — swap `@/preview/lib/api` imports for the production API client.
