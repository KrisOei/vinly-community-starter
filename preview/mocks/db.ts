/**
 * Mock Database
 *
 * In-memory fake data store that powers the local API.
 * All data is seeded on server start and resets on restart.
 * This simulates what a real Vinly community looks like from the API layer
 * without any real database, auth, or third-party services.
 *
 * SECURITY: This is fake data only. No real users, no real payments, no PII.
 */

import config from "@/preview/lib/config";

// ─── Helpers ────────────────────────────────────────────────────────────────

let idCounter = 1000;
function nextId(): string {
  return `mock_${(idCounter++).toString(36)}`;
}

function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString();
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Users ──────────────────────────────────────────────────────────────────

export interface MockUser {
  id: string;
  name: string;
  email: string;
  title: string;
  profilePictureUrl: string | null;
  location: string;
  building: string;
  role: "admin" | "member";
  status: "active" | "pending";
  joinedAt: string;
  lastLogin: string;
  onboardingComplete: boolean;
  plan: string;
}

const SEED_USERS: Omit<MockUser, "id" | "joinedAt" | "lastLogin">[] = [
  { name: "Sarah Chen", email: "sarah@example.com", title: "Founder @ InboxZero", profilePictureUrl: null, location: "San Francisco, CA", building: "An AI email productivity tool for teams", role: "admin", status: "active", onboardingComplete: true, plan: "builder" },
  { name: "Marcus Johnson", email: "marcus@example.com", title: "Solo Founder @ TrailMetrics", profilePictureUrl: null, location: "Austin, TX", building: "Analytics dashboard for outdoor recreation businesses", role: "admin", status: "active", onboardingComplete: true, plan: "founder_circle" },
  { name: "Priya Patel", email: "priya@example.com", title: "Co-Founder @ NomadDesk", profilePictureUrl: null, location: "London, UK", building: "Remote workspace booking for digital nomads", role: "member", status: "active", onboardingComplete: true, plan: "builder" },
  { name: "Alex Rivera", email: "alex@example.com", title: "Indie Hacker", profilePictureUrl: null, location: "Mexico City, MX", building: "A Notion-like tool for recipe creators", role: "member", status: "active", onboardingComplete: true, plan: "community" },
  { name: "Jordan Kim", email: "jordan@example.com", title: "Founder @ PetPulse", profilePictureUrl: null, location: "Seoul, KR", building: "Pet health monitoring with wearable sensors", role: "member", status: "active", onboardingComplete: true, plan: "builder" },
  { name: "Emma Larsson", email: "emma@example.com", title: "Bootstrapper", profilePictureUrl: null, location: "Stockholm, SE", building: "Sustainable fashion marketplace for indie brands", role: "member", status: "active", onboardingComplete: true, plan: "community" },
  { name: "David Okonkwo", email: "david@example.com", title: "Technical Founder", profilePictureUrl: null, location: "Lagos, NG", building: "Payment infrastructure for African SaaS companies", role: "member", status: "active", onboardingComplete: true, plan: "builder" },
  { name: "Mia Thompson", email: "mia@example.com", title: "Creator & Founder", profilePictureUrl: null, location: "Toronto, CA", building: "Community platform for local artists", role: "member", status: "active", onboardingComplete: false, plan: "community" },
  { name: "Liam Nakamura", email: "liam@example.com", title: "SaaS Builder", profilePictureUrl: null, location: "Tokyo, JP", building: "Developer tools for API monitoring", role: "member", status: "active", onboardingComplete: true, plan: "community" },
  { name: "Aisha Mensah", email: "aisha@example.com", title: "EdTech Founder", profilePictureUrl: null, location: "Accra, GH", building: "AI-powered tutoring for African students", role: "member", status: "pending", onboardingComplete: false, plan: "community" },
  { name: "Carlos Gutierrez", email: "carlos@example.com", title: "Startup Advisor", profilePictureUrl: null, location: "Buenos Aires, AR", building: "Mentorship marketplace for LATAM founders", role: "member", status: "active", onboardingComplete: true, plan: "founder_circle" },
  { name: "Sophie Dubois", email: "sophie@example.com", title: "No-Code Builder", profilePictureUrl: null, location: "Paris, FR", building: "Visual database builder for small businesses", role: "member", status: "active", onboardingComplete: true, plan: "builder" },
];

export const users: MockUser[] = SEED_USERS.map((u, i) => ({
  id: `user_${(i + 1).toString().padStart(3, "0")}`,
  ...u,
  joinedAt: randomDate(120 - i * 10),
  lastLogin: randomDate(i < 6 ? 2 : 14),
}));

// ─── Channels ───────────────────────────────────────────────────────────────

export interface MockChannel {
  id: string;
  name: string;
  description: string | null;
  emoji: string | null;
  isPrivate: boolean;
  adminOnly: boolean;
  approvalRequired: boolean;
  memberCount: number;
  postCount: number;
  lastActivityAt: string;
  createdAt: string;
}

export const channels: MockChannel[] = config.channels.map((ch, i) => ({
  id: `channel_${(i + 1).toString().padStart(3, "0")}`,
  name: ch.name,
  description: ch.description ?? null,
  emoji: ch.emoji ?? null,
  isPrivate: ch.isPrivate,
  adminOnly: ch.adminOnly,
  approvalRequired: ch.approvalRequired,
  memberCount: Math.floor(Math.random() * 8) + 4,
  postCount: Math.floor(Math.random() * 50) + 5,
  lastActivityAt: randomDate(3),
  createdAt: randomDate(90),
}));

// ─── Posts ───────────────────────────────────────────────────────────────────

export interface MockPost {
  id: string;
  authorId: string;
  channelId: string;
  channelName: string;
  content: string;
  likes: number;
  commentCount: number;
  isPinned: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

const POST_CONTENT = [
  { channel: "Wins", content: "Just crossed $10K MRR! 🎉 Took 14 months of grinding but we're finally here. The pivot to team plans in October was the game changer. Thanks to everyone who gave feedback on the pricing page last month." },
  { channel: "Feedback", content: "Redesigned our landing page this weekend. Would love brutally honest feedback — especially on the value prop above the fold. Link in replies." },
  { channel: "General", content: "Hot take: the best marketing channel for bootstrapped SaaS in 2026 is still cold email. SEO takes too long, paid is too expensive, and social is too noisy. Fight me." },
  { channel: "Resources", content: "Sharing the exact Notion template I use to track my startup metrics weekly. Includes MRR, churn, CAC, and LTV calculations. Took me months to get this right — hope it saves someone else the time." },
  { channel: "Introductions", content: "Hey everyone! I'm David from Lagos. Building payment infrastructure for African SaaS companies. Previously worked at Stripe for 4 years. Excited to connect with other founders who are building fintech outside of the US." },
  { channel: "Accountability", content: "Week 12 check-in: Shipped the booking confirmation flow. Onboarded 3 new coworking spaces in London. Next week: tackle the mobile responsive issues and start outreach to spaces in Lisbon." },
  { channel: "General", content: "Anyone else feel like the hardest part of bootstrapping isn't the code or the marketing — it's the loneliness? Genuinely grateful for this community." },
  { channel: "Wins", content: "First paying customer! It's only $29/mo but it literally made my week. Going to frame the Stripe notification." },
  { channel: "Feedback", content: "Launched our pricing page with 3 tiers. Getting tons of clicks on the middle tier but zero conversions. Anyone see obvious issues? Sharing a Loom walkthrough in the thread." },
  { channel: "Resources", content: "Just published a blog post breaking down exactly how I got our first 100 users. No paid ads, no Product Hunt — just manual outreach and a really good onboarding email sequence. Link in comments." },
  { channel: "Hiring", content: "Looking for a part-time designer who understands SaaS. Budget is $3K-5K/month. Must be okay with async work and love clean, minimal UI. DM me if interested!" },
  { channel: "General", content: "Shower thought: we spend weeks building features that 3% of users will use, and ignore the onboarding flow that 100% of users experience. I'm fixing this today." },
  { channel: "Accountability", content: "Week 8 update: Launched the beta to our waitlist (430 signups). Got 67 active users in the first 48 hours. NPS is at 42 which I'm told is decent for beta. Main complaint: mobile experience." },
  { channel: "Wins", content: "Our blog post hit #1 on Hacker News today! 🔥 Traffic is insane — went from 200 to 15,000 visits in 4 hours. Now trying to figure out how to convert these visitors." },
  { channel: "Feedback", content: "Working on our AI assistant. Right now it answers questions about our product docs, but thinking of adding personalized recommendations. Too much scope creep or actually useful? Would love opinions." },
];

export const posts: MockPost[] = POST_CONTENT.map((p, i) => {
  const matchedChannel = channels.find((c) => c.name === p.channel) || channels[0];
  return {
    id: `post_${(i + 1).toString().padStart(3, "0")}`,
    authorId: users[i % users.length].id,
    channelId: matchedChannel.id,
    channelName: matchedChannel.name,
    content: p.content,
    likes: Math.floor(Math.random() * 60) + 5,
    commentCount: Math.floor(Math.random() * 30) + 1,
    isPinned: i === 3,
    isApproved: true,
    createdAt: randomDate(30 - i * 2),
    updatedAt: randomDate(15 - i),
  };
});

// ─── Comments ───────────────────────────────────────────────────────────────

export interface MockComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  likes: number;
  createdAt: string;
}

const COMMENT_TEXTS = [
  "Congrats! This is awesome 🎉",
  "Love this approach. We did something similar and saw a 20% lift.",
  "Great share — bookmarking this for later.",
  "Can you share more details on how you structured the pricing?",
  "This resonates so much. Thanks for being vulnerable about it.",
  "+1 to this. Cold email still works if you do it right.",
  "Would love to connect — working on something similar!",
  "Saved this. Exactly what I needed this week.",
  "Have you tried A/B testing the headline? That alone doubled our conversion.",
  "Welcome to the community! Excited to have you here.",
  "Solid metrics. What's your activation rate looking like?",
  "This is the kind of content that makes this community worth it.",
];

export const comments: MockComment[] = [];
posts.forEach((post) => {
  const numComments = Math.min(post.commentCount, 4);
  for (let i = 0; i < numComments; i++) {
    comments.push({
      id: nextId(),
      postId: post.id,
      authorId: users[(parseInt(post.id.split("_")[1]) + i + 1) % users.length].id,
      content: COMMENT_TEXTS[(parseInt(post.id.split("_")[1]) + i) % COMMENT_TEXTS.length],
      likes: Math.floor(Math.random() * 15),
      createdAt: randomDate(10),
    });
  }
});

// ─── Events ─────────────────────────────────────────────────────────────────

export interface MockEvent {
  id: string;
  name: string;
  description: string;
  type: "in-person" | "virtual" | "hybrid";
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location: string | null;
  meetingUrl: string | null;
  hostId: string;
  attendeeIds: string[];
  maxAttendees: number | null;
  isRecurring: boolean;
  status: "upcoming" | "live" | "past";
  createdAt: string;
}

const futureDate = (daysAhead: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
};

export const events: MockEvent[] = [
  {
    id: "event_001",
    name: "Weekly Standup",
    description: "15-minute lightning round: what you shipped this week, what's next, where you're stuck.",
    type: "virtual",
    date: futureDate(3),
    startTime: "09:00",
    endTime: "09:15",
    timezone: "America/Los_Angeles",
    location: null,
    meetingUrl: "https://meet.example.com/standup",
    hostId: users[0].id,
    attendeeIds: users.slice(0, 8).map((u) => u.id),
    maxAttendees: null,
    isRecurring: true,
    status: "upcoming",
    createdAt: randomDate(60),
  },
  {
    id: "event_002",
    name: "April Demo Day",
    description: "5 founders get 5 minutes each to demo their latest feature to the community. Sign up to present in #general.",
    type: "virtual",
    date: futureDate(15),
    startTime: "12:00",
    endTime: "13:00",
    timezone: "America/Los_Angeles",
    location: null,
    meetingUrl: "https://meet.example.com/demoday",
    hostId: users[1].id,
    attendeeIds: users.slice(0, 10).map((u) => u.id),
    maxAttendees: 100,
    isRecurring: true,
    status: "upcoming",
    createdAt: randomDate(30),
  },
  {
    id: "event_003",
    name: "Q2 Founder Retreat — Austin",
    description: "3-day in-person gathering. Deep work sessions, workshops on pricing strategy, and plenty of BBQ. Founder Circle members only.",
    type: "in-person",
    date: futureDate(45),
    startTime: "10:00",
    endTime: "18:00",
    timezone: "America/Chicago",
    location: "Austin, TX",
    meetingUrl: null,
    hostId: users[1].id,
    attendeeIds: users.slice(0, 5).map((u) => u.id),
    maxAttendees: 30,
    isRecurring: false,
    status: "upcoming",
    createdAt: randomDate(20),
  },
  {
    id: "event_004",
    name: "AMA: From $0 to $50K MRR Solo",
    description: "Sarah shares her journey building InboxZero as a solo founder, from first commit to profitability. Bring your questions!",
    type: "virtual",
    date: futureDate(8),
    startTime: "11:00",
    endTime: "12:00",
    timezone: "America/Los_Angeles",
    location: null,
    meetingUrl: "https://meet.example.com/ama-sarah",
    hostId: users[0].id,
    attendeeIds: users.map((u) => u.id),
    maxAttendees: null,
    isRecurring: false,
    status: "upcoming",
    createdAt: randomDate(10),
  },
  {
    id: "event_005",
    name: "Pricing Strategy Workshop",
    description: "Interactive workshop on pricing your SaaS. Bring your current pricing page and we'll workshop it live. Led by Carlos Gutierrez.",
    type: "virtual",
    date: futureDate(22),
    startTime: "10:00",
    endTime: "11:30",
    timezone: "America/Los_Angeles",
    location: null,
    meetingUrl: "https://meet.example.com/pricing-workshop",
    hostId: users[10].id,
    attendeeIds: users.slice(2, 9).map((u) => u.id),
    maxAttendees: 20,
    isRecurring: false,
    status: "upcoming",
    createdAt: randomDate(5),
  },
];

// ─── Membership Stats ───────────────────────────────────────────────────────

export interface MockMembershipStats {
  tierName: string;
  subscriberCount: number;
  mrr: number;
  churnRate: number;
}

export const membershipStats: MockMembershipStats[] = config.membershipTiers.map((tier) => ({
  tierName: tier.name,
  subscriberCount: tier.price === 0 ? users.length : Math.floor(Math.random() * 5) + 1,
  mrr: tier.price === 0 ? 0 : tier.price * (Math.floor(Math.random() * 5) + 1),
  churnRate: tier.price === 0 ? 0 : Math.round(Math.random() * 5 * 10) / 10,
}));

// ─── Community Stats ────────────────────────────────────────────────────────

export function getCommunityStats() {
  return {
    totalMembers: users.filter((u) => u.status === "active").length,
    pendingMembers: users.filter((u) => u.status === "pending").length,
    totalChannels: channels.length,
    totalPosts: posts.length,
    totalComments: comments.length,
    totalEvents: events.length,
    upcomingEvents: events.filter((e) => e.status === "upcoming").length,
    weeklyActiveMembers: Math.floor(users.length * 0.7),
    monthlyActiveMembers: Math.floor(users.length * 0.9),
    topChannels: channels
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 3)
      .map((c) => ({ name: c.name, posts: c.postCount })),
  };
}
