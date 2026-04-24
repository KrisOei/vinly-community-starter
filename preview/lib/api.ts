/**
 * API Client
 *
 * Lightweight fetch wrapper for the mock and live Vinly API.
 *
 * When NEXT_PUBLIC_DEMO_MODE=true (default), all calls hit the local
 * mock API at /api/... — no internet required.
 *
 * When NEXT_PUBLIC_DEMO_MODE=false, calls go to NEXT_PUBLIC_API_URL
 * with the VINLY_API_KEY header.
 */

import { isDemoMode, apiBaseUrl } from "./env";

const BASE = isDemoMode ? "/api" : apiBaseUrl;

async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!isDemoMode && process.env.VINLY_API_KEY) {
    headers["Authorization"] = `Bearer ${process.env.VINLY_API_KEY}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    headers,
    ...init,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `API error: ${res.status}`);
  }

  return res.json();
}

// ─── Community ──────────────────────────────────────────────────────────────

export function getCommunity() {
  return fetcher<{
    name: string;
    abbreviation: string;
    description: string;
    tagline?: string;
    logoUrl: string | null;
    coverImageUrl: string | null;
    theme: Record<string, unknown>;
    private: boolean;
    stats: {
      totalMembers: number;
      totalChannels: number;
      totalPosts: number;
      upcomingEvents: number;
      weeklyActiveMembers: number;
    };
  }>("/community");
}

// ─── Members ────────────────────────────────────────────────────────────────

export interface MemberResponse {
  id: string;
  name: string;
  title: string;
  location: string;
  building: string;
  role: string;
  status: string;
  joinedAt: string;
  lastLogin: string;
  onboardingComplete: boolean;
}

export function getMembers(params?: { role?: string; status?: string; search?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.role) qs.set("role", params.role);
  if (params?.status) qs.set("status", params.status);
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", params.page.toString());
  if (params?.limit) qs.set("limit", params.limit.toString());
  const query = qs.toString();
  return fetcher<{
    members: MemberResponse[];
    pagination: { page: number; limit: number; total: number; totalPages: number; hasMore: boolean };
  }>(`/members${query ? `?${query}` : ""}`);
}

export function getMember(id: string) {
  return fetcher<{ member: MemberResponse }>(`/members/${id}`);
}

// ─── Channels ───────────────────────────────────────────────────────────────

export function getChannels() {
  return fetcher<{
    channels: {
      id: string;
      name: string;
      description: string | null;
      emoji: string | null;
      isPrivate: boolean;
      adminOnly: boolean;
      memberCount: number;
      postCount: number;
      lastActivityAt: string;
    }[];
    total: number;
  }>("/channels");
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export function getPosts(params?: { channel?: string; pinned?: boolean; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.channel) qs.set("channel", params.channel);
  if (params?.pinned) qs.set("pinned", "true");
  if (params?.page) qs.set("page", params.page.toString());
  if (params?.limit) qs.set("limit", params.limit.toString());
  const query = qs.toString();
  return fetcher<{
    posts: Array<{
      id: string;
      content: string;
      channelName: string;
      likes: number;
      commentCount: number;
      isPinned: boolean;
      createdAt: string;
      author: { id: string; name: string; title: string } | null;
      comments: Array<{ id: string; content: string; likes: number; author: { id: string; name: string } | null }>;
    }>;
    pagination: { page: number; limit: number; total: number; hasMore: boolean };
  }>(`/posts${query ? `?${query}` : ""}`);
}

export function createPost(channelId: string, content: string) {
  return fetcher<{ post: unknown }>("/posts", {
    method: "POST",
    body: JSON.stringify({ channelId, content }),
  });
}

export function getPostComments(postId: string) {
  return fetcher<{
    postId: string;
    comments: Array<{
      id: string;
      content: string;
      likes: number;
      createdAt: string;
      author: { id: string; name: string; title: string } | null;
    }>;
    total: number;
  }>(`/posts/${postId}/comments`);
}

// ─── Events ─────────────────────────────────────────────────────────────────

export function getEvents(params?: { status?: string; type?: string }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.type) qs.set("type", params.type);
  const query = qs.toString();
  return fetcher<{
    events: Array<{
      id: string;
      name: string;
      description: string;
      type: string;
      date: string;
      startTime: string;
      endTime: string;
      timezone: string;
      location: string | null;
      attendeeCount: number;
      maxAttendees: number | null;
      isFull: boolean;
      isRecurring: boolean;
      host: { id: string; name: string; title: string } | null;
    }>;
    total: number;
  }>(`/events${query ? `?${query}` : ""}`);
}

export function getEvent(id: string) {
  return fetcher<{ event: unknown }>(`/events/${id}`);
}

// ─── Onboarding ─────────────────────────────────────────────────────────────

export function getOnboarding() {
  return fetcher<{
    welcomeMessage: string | undefined;
    mandatoryOnboarding: boolean;
    questions: Array<{
      index: number;
      question: string;
      type: string;
      options: string[] | null;
      required: boolean;
      placeholder: string | null;
    }>;
  }>("/onboarding");
}

export function submitOnboarding(answers: Array<{ questionIndex: number; answer: string }>) {
  return fetcher<{ success: boolean; message: string; nextStep: string }>("/onboarding", {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}

// ─── Membership ─────────────────────────────────────────────────────────────

export function getMembership() {
  return fetcher<{
    tiers: Array<{
      id: string;
      name: string;
      description: string | null;
      price: number;
      interval: string;
      trialDays: number;
      features: string[];
      highlighted: boolean;
    }>;
    totalTiers: number;
    totalMRR: number;
  }>("/membership");
}

// ─── Assistant ──────────────────────────────────────────────────────────────

export function getAssistant() {
  return fetcher<{
    enabled: boolean;
    name?: string;
    greeting?: string;
    suggestedQuestions?: string[];
  }>("/assistant");
}

export function chatWithAssistant(message: string) {
  return fetcher<{
    id: string;
    role: "assistant";
    content: string;
    assistantName: string;
    timestamp: string;
  }>("/assistant", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

// ─── Notifications ─────────────────────────────────────────────────────────

export function getNotifications(params?: { type?: string; unread?: boolean; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.type) qs.set("type", params.type);
  if (params?.unread) qs.set("unread", "true");
  if (params?.page) qs.set("page", params.page.toString());
  if (params?.limit) qs.set("limit", params.limit.toString());
  const query = qs.toString();
  return fetcher<{
    notifications: Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      read: boolean;
      chatId: string | null;
      postId: string | null;
      eventId: string | null;
      createdAt: string;
    }>;
    unreadCount: number;
    pagination: { page: number; limit: number; total: number; totalPages: number; hasMore: boolean };
  }>(`/notifications${query ? `?${query}` : ""}`);
}

export function markNotificationsRead(notificationIds: string[]) {
  return fetcher<{ updated: number; message: string }>("/notifications", {
    method: "PATCH",
    body: JSON.stringify({ notificationIds }),
  });
}

export function markAllNotificationsRead() {
  return fetcher<{ updated: number; message: string }>("/notifications", {
    method: "PATCH",
    body: JSON.stringify({ markAllRead: true }),
  });
}

// ─── Chats ─────────────────────────────────────────────────────────────────

export function getChats() {
  return fetcher<{
    chats: Array<{
      id: string;
      name: string | null;
      groupChat: boolean;
      participants: Array<{
        userId: string;
        role: string;
        user: { id: string; name: string; title: string; profilePictureUrl: string | null } | null;
      }>;
      lastMessage: { content: string; createdAt: string; author: { id: string; name: string } | null } | null;
      unreadCount: number;
      updatedAt: string;
    }>;
    total: number;
  }>("/chats");
}

export function getChat(id: string) {
  return fetcher<{
    chat: {
      id: string;
      name: string | null;
      groupChat: boolean;
      participants: Array<{
        userId: string;
        role: string;
        user: { id: string; name: string; title: string; profilePictureUrl: string | null } | null;
      }>;
      messages: Array<{
        id: string;
        content: string;
        createdById: string;
        createdAt: string;
        author: { id: string; name: string; profilePictureUrl: string | null } | null;
      }>;
    };
  }>(`/chats?id=${id}`);
}

export function createChat(participantIds: string[], message: string, name?: string) {
  return fetcher<{ chat: unknown }>("/chats", {
    method: "POST",
    body: JSON.stringify({ participantIds, message, name }),
  });
}

// ─── Invites ───────────────────────────────────────────────────────────────

export function getInvites(params?: { status?: string; type?: string }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.type) qs.set("type", params.type);
  const query = qs.toString();
  return fetcher<{
    invites: Array<{
      id: string;
      email: string | null;
      phoneNumber: string | null;
      status: string;
      type: string;
      message: string | null;
      createdBy: { id: string; name: string; email: string } | null;
      createdAt: string;
      expiresAt: string;
    }>;
    total: number;
    stats: { pending: number; accepted: number; declined: number; expired: number };
  }>(`/invites${query ? `?${query}` : ""}`);
}

export function createInvite(params: { email?: string; phoneNumber?: string; message?: string; type?: string }) {
  return fetcher<{ invite: unknown }>("/invites", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

// ─── Search ────────────────────────────────────────────────────────────────

export function search(query: string, params?: { scope?: string[]; limit?: number }) {
  const qs = new URLSearchParams();
  qs.set("q", query);
  if (params?.scope) qs.set("scope", params.scope.join(","));
  if (params?.limit) qs.set("limit", params.limit.toString());
  return fetcher<{
    query: string;
    results: {
      members?: Array<{ id: string; name: string; title: string; location: string; building: string }>;
      posts?: Array<{ id: string; content: string; channelName: string; author: { id: string; name: string } | null; createdAt: string }>;
      channels?: Array<{ id: string; name: string; description: string | null; emoji: string | null; memberCount: number }>;
      events?: Array<{ id: string; name: string; description: string; type: string; date: string; status: string }>;
    };
    totalResults: number;
  }>(`/search?${qs.toString()}`);
}
