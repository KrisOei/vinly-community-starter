/**
 * GET /api/events
 * GET /api/events?status=upcoming&type=virtual
 *
 * POST /api/events/[id]/register
 *
 * Returns community events with host info and attendee counts.
 * In production, this maps to Events + EventsUser + User models.
 */

import { NextRequest, NextResponse } from "next/server";
import { events, users } from "@/preview/mocks/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  let filtered = [...events];

  if (status) filtered = filtered.filter((e) => e.status === status);
  if (type) filtered = filtered.filter((e) => e.type === type);

  const hydrated = filtered.map((event) => {
    const host = users.find((u) => u.id === event.hostId);
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      type: event.type,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      timezone: event.timezone,
      location: event.location,
      meetingUrl: event.meetingUrl,
      isRecurring: event.isRecurring,
      status: event.status,
      attendeeCount: event.attendeeIds.length,
      maxAttendees: event.maxAttendees,
      isFull: event.maxAttendees ? event.attendeeIds.length >= event.maxAttendees : false,
      host: host ? { id: host.id, name: host.name, title: host.title } : null,
      createdAt: event.createdAt,
    };
  });

  return NextResponse.json({
    events: hydrated,
    total: hydrated.length,
  });
}
