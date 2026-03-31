/**
 * GET /api/events/:id
 *
 * Returns a single event with full details and attendee list.
 */

import { NextRequest, NextResponse } from "next/server";
import { events, users } from "@/preview/mocks/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = events.find((e) => e.id === id);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const host = users.find((u) => u.id === event.hostId);
  const attendees = event.attendeeIds
    .map((aid) => users.find((u) => u.id === aid))
    .filter(Boolean)
    .map((u) => ({ id: u!.id, name: u!.name, title: u!.title }));

  return NextResponse.json({
    event: {
      ...event,
      host: host ? { id: host.id, name: host.name, title: host.title } : null,
      attendees,
      attendeeCount: attendees.length,
    },
  });
}
