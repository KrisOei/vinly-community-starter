/**
 * GET /api/channels
 *
 * Returns all community channels with metadata.
 * In production, this maps to the Channel model.
 */

import { NextResponse } from "next/server";
import { channels } from "@/preview/mocks/db";

export async function GET() {
  return NextResponse.json({
    channels: channels.map((ch) => ({
      id: ch.id,
      name: ch.name,
      description: ch.description,
      emoji: ch.emoji,
      isPrivate: ch.isPrivate,
      adminOnly: ch.adminOnly,
      memberCount: ch.memberCount,
      postCount: ch.postCount,
      lastActivityAt: ch.lastActivityAt,
    })),
    total: channels.length,
  });
}
