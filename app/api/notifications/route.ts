import { NextRequest, NextResponse } from "next/server";
import { notifications } from "@/preview/mocks/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type");
  const unreadOnly = searchParams.get("unread") === "true";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  let filtered = [...notifications];

  if (type) {
    filtered = filtered.filter((n) => n.type === type);
  }
  if (unreadOnly) {
    filtered = filtered.filter((n) => !n.read);
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    notifications: paginated,
    unreadCount: notifications.filter((n) => !n.read).length,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      hasMore: start + limit < filtered.length,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { notificationIds, markAllRead } = body;

  if (markAllRead) {
    const count = notifications.filter((n) => !n.read).length;
    return NextResponse.json({ updated: count, message: `Marked ${count} notifications as read` });
  }

  if (notificationIds && Array.isArray(notificationIds)) {
    const updated = notificationIds.filter((id: string) =>
      notifications.some((n) => n.id === id)
    ).length;
    return NextResponse.json({ updated, message: `Marked ${updated} notifications as read` });
  }

  return NextResponse.json({ error: "Provide notificationIds or markAllRead" }, { status: 400 });
}
