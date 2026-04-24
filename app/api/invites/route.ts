import { NextRequest, NextResponse } from "next/server";
import { invites, users } from "@/preview/mocks/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  let filtered = [...invites];

  if (status) {
    filtered = filtered.filter((inv) => inv.status === status);
  }
  if (type) {
    filtered = filtered.filter((inv) => inv.type === type);
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const enriched = filtered.map((inv) => {
    const creator = users.find((u) => u.id === inv.createdById);
    return {
      ...inv,
      createdBy: creator ? { id: creator.id, name: creator.name, email: creator.email } : null,
    };
  });

  return NextResponse.json({
    invites: enriched,
    total: enriched.length,
    stats: {
      pending: invites.filter((i) => i.status === "pending").length,
      accepted: invites.filter((i) => i.status === "accepted").length,
      declined: invites.filter((i) => i.status === "declined").length,
      expired: invites.filter((i) => i.status === "expired").length,
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, phoneNumber, message, type } = body;

  if (!email && !phoneNumber) {
    return NextResponse.json({ error: "email or phoneNumber is required" }, { status: 400 });
  }

  const mockInvite = {
    id: `invite_${Date.now().toString(36)}`,
    createdById: users[0].id,
    email: email || null,
    phoneNumber: phoneNumber || null,
    status: "pending",
    type: type || "community",
    message: message || null,
    chatId: null,
    eventId: null,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return NextResponse.json({ invite: mockInvite }, { status: 201 });
}
