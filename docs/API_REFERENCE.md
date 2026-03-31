# Mock API Reference

The sandbox includes a full set of API routes that simulate the real Vinly API. All data is generated from your `community.config.ts` and mock fixtures — no database, no auth, no external services.

Start the server with `npm run dev` and hit `http://localhost:3000/api/...`.

---

## Community

### `GET /api/community`

Returns the community profile, theme, and aggregate stats.

**Response:**
```json
{
  "name": "Indie Founders Collective",
  "abbreviation": "indie-founders",
  "description": "A private community for...",
  "tagline": "Build profitable. Build together.",
  "logoUrl": null,
  "coverImageUrl": null,
  "theme": {
    "primaryColor": "#6D28D9",
    "secondaryColor": "#F59E0B",
    "fontFamily": "DM Sans",
    "borderRadius": "lg",
    "darkMode": false
  },
  "private": true,
  "assistant": { "enabled": true, "name": "Scout" },
  "stats": {
    "totalMembers": 11,
    "pendingMembers": 1,
    "totalChannels": 8,
    "totalPosts": 15,
    "totalComments": 48,
    "totalEvents": 5,
    "upcomingEvents": 5,
    "weeklyActiveMembers": 8,
    "monthlyActiveMembers": 10,
    "topChannels": [
      { "name": "General", "posts": 42 }
    ]
  }
}
```

---

## Members

### `GET /api/members`

Returns paginated community members. Supports filtering and search.

**Query params:**

| Param | Type | Description |
|-------|------|-------------|
| `role` | `admin` or `member` | Filter by role |
| `status` | `active` or `pending` | Filter by status |
| `search` | string | Fuzzy search name, title, location, building |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

**Example:** `GET /api/members?role=admin&status=active`

**Response:**
```json
{
  "members": [
    {
      "id": "user_001",
      "name": "Sarah Chen",
      "title": "Founder @ InboxZero",
      "location": "San Francisco, CA",
      "building": "An AI email productivity tool for teams",
      "role": "admin",
      "status": "active",
      "joinedAt": "2025-11-15T...",
      "lastLogin": "2026-03-30T...",
      "onboardingComplete": true,
      "plan": "builder"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "totalPages": 2,
    "hasMore": true
  }
}
```

### `GET /api/members/:id`

Returns a single member's public profile.

---

## Channels

### `GET /api/channels`

Returns all channels with metadata.

**Response:**
```json
{
  "channels": [
    {
      "id": "channel_001",
      "name": "General",
      "description": "The town square — anything goes",
      "emoji": "💬",
      "isPrivate": false,
      "adminOnly": false,
      "memberCount": 10,
      "postCount": 32,
      "lastActivityAt": "2026-03-30T..."
    }
  ],
  "total": 8
}
```

---

## Posts

### `GET /api/posts`

Returns paginated posts with author info and comments.

**Query params:**

| Param | Type | Description |
|-------|------|-------------|
| `channel` | string | Filter by channel ID |
| `pinned` | `true` | Show only pinned posts |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

**Example:** `GET /api/posts?channel=channel_001&page=1&limit=5`

### `POST /api/posts`

Create a new post (simulated).

**Body:**
```json
{
  "channelId": "channel_001",
  "content": "Hello world!"
}
```

### `GET /api/posts/:id/comments`

Returns comments for a specific post with author info.

---

## Events

### `GET /api/events`

Returns community events with host info.

**Query params:**

| Param | Type | Description |
|-------|------|-------------|
| `status` | `upcoming`, `live`, `past` | Filter by status |
| `type` | `virtual`, `in-person`, `hybrid` | Filter by type |

### `GET /api/events/:id`

Returns a single event with full attendee list.

---

## Onboarding

### `GET /api/onboarding`

Returns the onboarding configuration (welcome message, questions).

### `POST /api/onboarding`

Submit onboarding answers.

**Body:**
```json
{
  "answers": [
    { "questionIndex": 0, "answer": "Building a SaaS tool" },
    { "questionIndex": 1, "answer": "Launched, finding PMF" }
  ]
}
```

**Response (success):**
```json
{
  "success": true,
  "message": "Onboarding complete! Welcome to the community.",
  "nextStep": "post_introduction"
}
```

**Response (missing required):**
```json
{
  "error": "Missing required answers",
  "missingQuestions": [
    { "index": 2, "question": "What's your biggest challenge?" }
  ]
}
```

---

## Membership

### `GET /api/membership`

Returns membership tier definitions with mock subscriber stats.

**Response:**
```json
{
  "tiers": [
    {
      "id": "tier_001",
      "name": "Community",
      "price": 0,
      "interval": "monthly",
      "features": ["Access to all public channels", "..."],
      "highlighted": false,
      "stats": {
        "subscriberCount": 12,
        "mrr": 0,
        "churnRate": 0
      }
    }
  ],
  "totalTiers": 3,
  "totalMRR": 145
}
```

---

## AI Assistant

### `GET /api/assistant`

Returns the assistant config.

### `POST /api/assistant`

Chat with the mock AI assistant.

**Body:**
```json
{
  "message": "Who else is building in fintech?"
}
```

**Response:**
```json
{
  "id": "msg_abc123",
  "role": "assistant",
  "content": "Here are some members you might want to connect with...",
  "assistantName": "Scout",
  "timestamp": "2026-03-31T..."
}
```

The mock assistant responds based on keywords (members, events, channels, help). In production, it uses your `personality` prompt with Vinly's LLM infrastructure.

---

## Using the API Client

Import the typed client in your components:

```typescript
import { getMembers, getPosts, chatWithAssistant } from "@/preview/lib/api";

// Fetch members with search
const { members, pagination } = await getMembers({ search: "fintech", page: 1 });

// Create a post
const { post } = await createPost("channel_001", "Hello from the API!");

// Chat with the assistant
const reply = await chatWithAssistant("What events are coming up?");
```

See [`preview/lib/api.ts`](../preview/lib/api.ts) for the full typed client.
