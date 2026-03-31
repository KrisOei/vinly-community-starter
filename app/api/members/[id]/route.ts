/**
 * GET /api/members/:id
 *
 * Returns a single member's public profile.
 */

import { NextRequest, NextResponse } from "next/server";
import { users } from "@/preview/mocks/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = users.find((u) => u.id === id);

  if (!user) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  // Public profile — no email
  const { email, ...publicProfile } = user;
  return NextResponse.json({ member: publicProfile });
}
