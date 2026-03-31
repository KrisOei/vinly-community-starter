/**
 * Mock data for the preview app.
 * This replaces a real database — everything here is fictional.
 */

export interface MockUser {
  id: string;
  name: string;
  title: string;
  avatar: string;
  location: string;
  joinedAt: string;
  building: string;
}

export interface MockPost {
  id: string;
  author: MockUser;
  channel: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  isPinned?: boolean;
}

export interface MockEvent {
  id: string;
  name: string;
  description: string;
  type: "in-person" | "virtual" | "hybrid";
  date: string;
  time: string;
  attendees: number;
  maxAttendees?: number;
  host: MockUser;
}

export interface MockMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ── Mock Users ──────────────────────────────────────────────────────────────

export const mockUsers: MockUser[] = [
  {
    id: "u1",
    name: "Sarah Chen",
    title: "Founder @ InboxZero",
    avatar: "",
    location: "San Francisco, CA",
    joinedAt: "2025-11-15",
    building: "An AI email productivity tool for teams",
  },
  {
    id: "u2",
    name: "Marcus Johnson",
    title: "Solo Founder @ TrailMetrics",
    avatar: "",
    location: "Austin, TX",
    joinedAt: "2025-12-01",
    building: "Analytics dashboard for outdoor recreation businesses",
  },
  {
    id: "u3",
    name: "Priya Patel",
    title: "Co-Founder @ NomadDesk",
    avatar: "",
    location: "London, UK",
    joinedAt: "2026-01-10",
    building: "Remote workspace booking for digital nomads",
  },
  {
    id: "u4",
    name: "Alex Rivera",
    title: "Indie Hacker",
    avatar: "",
    location: "Mexico City, MX",
    joinedAt: "2026-01-22",
    building: "A Notion-like tool for recipe creators",
  },
  {
    id: "u5",
    name: "Jordan Kim",
    title: "Founder @ PetPulse",
    avatar: "",
    location: "Seoul, KR",
    joinedAt: "2026-02-05",
    building: "Pet health monitoring with wearable sensors",
  },
  {
    id: "u6",
    name: "Emma Larsson",
    title: "Bootstrapper",
    avatar: "",
    location: "Stockholm, SE",
    joinedAt: "2026-02-18",
    building: "Sustainable fashion marketplace for indie brands",
  },
  {
    id: "u7",
    name: "David Okonkwo",
    title: "Technical Founder",
    avatar: "",
    location: "Lagos, NG",
    joinedAt: "2026-03-01",
    building: "Payment infrastructure for African SaaS companies",
  },
  {
    id: "u8",
    name: "Mia Thompson",
    title: "Creator & Founder",
    avatar: "",
    location: "Toronto, CA",
    joinedAt: "2026-03-10",
    building: "Community platform for local artists",
  },
];

// ── Mock Posts ───────────────────────────────────────────────────────────────

export const mockPosts: MockPost[] = [
  {
    id: "p1",
    author: mockUsers[0],
    channel: "Wins",
    content:
      "Just crossed $10K MRR! 🎉 Took 14 months of grinding but we're finally here. The pivot to team plans in October was the game changer. Thanks to everyone who gave feedback on the pricing page last month.",
    likes: 42,
    comments: 18,
    createdAt: "2026-03-28",
  },
  {
    id: "p2",
    author: mockUsers[1],
    channel: "Feedback",
    content:
      "Redesigned our landing page this weekend. Would love brutally honest feedback — especially on the value prop above the fold. Link in replies.",
    likes: 15,
    comments: 23,
    createdAt: "2026-03-27",
  },
  {
    id: "p3",
    author: mockUsers[3],
    channel: "General",
    content:
      "Hot take: the best marketing channel for bootstrapped SaaS in 2026 is still cold email. SEO takes too long, paid is too expensive, and social is too noisy. Fight me.",
    likes: 31,
    comments: 47,
    createdAt: "2026-03-26",
  },
  {
    id: "p4",
    author: mockUsers[4],
    channel: "Resources",
    content:
      "Sharing the exact Notion template I use to track my startup metrics weekly. Includes MRR, churn, CAC, and LTV calculations. Took me months to get this right — hope it saves someone else the time.",
    likes: 56,
    comments: 12,
    createdAt: "2026-03-25",
    isPinned: true,
  },
  {
    id: "p5",
    author: mockUsers[6],
    channel: "Introductions",
    content:
      "Hey everyone! I'm David from Lagos. Building payment infrastructure for African SaaS companies. Previously worked at Stripe for 4 years. Excited to connect with other founders who are building fintech outside of the US.",
    likes: 28,
    comments: 9,
    createdAt: "2026-03-24",
  },
  {
    id: "p6",
    author: mockUsers[2],
    channel: "Accountability",
    content:
      "Week 12 check-in: Shipped the booking confirmation flow. Onboarded 3 new coworking spaces in London. Next week: tackle the mobile responsive issues and start outreach to spaces in Lisbon. On track for 50 listed spaces by end of month.",
    likes: 19,
    comments: 6,
    createdAt: "2026-03-23",
  },
];

// ── Mock Events ─────────────────────────────────────────────────────────────

export const mockEvents: MockEvent[] = [
  {
    id: "e1",
    name: "Weekly Standup",
    description:
      "15-minute lightning round: what you shipped this week, what's next, where you're stuck.",
    type: "virtual",
    date: "Every Thursday",
    time: "9:00 AM PST",
    attendees: 24,
    host: mockUsers[0],
  },
  {
    id: "e2",
    name: "April Demo Day",
    description:
      "5 founders get 5 minutes each to demo their latest feature to the community. Sign up to present in #general.",
    type: "virtual",
    date: "April 15, 2026",
    time: "12:00 PM PST",
    attendees: 48,
    maxAttendees: 100,
    host: mockUsers[1],
  },
  {
    id: "e3",
    name: "Q2 Founder Retreat — Austin",
    description:
      "3-day in-person gathering. Deep work sessions, workshops on pricing strategy, and plenty of BBQ. Founder Circle members only.",
    type: "in-person",
    date: "May 16-18, 2026",
    time: "All Day",
    attendees: 12,
    maxAttendees: 30,
    host: mockUsers[1],
  },
  {
    id: "e4",
    name: "AMA: From $0 to $50K MRR Solo",
    description:
      "Sarah shares her journey building InboxZero as a solo founder, from first commit to profitability. Bring your questions!",
    type: "virtual",
    date: "April 8, 2026",
    time: "11:00 AM PST",
    attendees: 67,
    host: mockUsers[0],
  },
];

// ── Mock Assistant Conversation ─────────────────────────────────────────────

export const mockAssistantConversation: MockMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "Who else is building in fintech?",
  },
  {
    id: "m2",
    role: "assistant",
    content:
      'Great question! I found 2 members in fintech:\n\n• **David Okonkwo** — Building payment infrastructure for African SaaS companies. He previously worked at Stripe.\n• **Sarah Chen** — While InboxZero is primarily productivity, she\'s integrated payment tracking features.\n\nWant me to introduce you to either of them?',
  },
  {
    id: "m3",
    role: "user",
    content: "What events are coming up this month?",
  },
  {
    id: "m4",
    role: "assistant",
    content:
      "Here's what's on the calendar:\n\n1. **Weekly Standup** — Every Thursday, 9 AM PST (next one is in 3 days)\n2. **AMA: From $0 to $50K MRR Solo** — April 8, with Sarah Chen\n3. **April Demo Day** — April 15, sign up in #general to present\n\nThe Q2 Founder Retreat in Austin is also coming up in May if you're a Founder Circle member!",
  },
];
