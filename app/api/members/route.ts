/**
 * GET /api/members
 * GET /api/members?role=admin&status=active&search=sarah&page=1&limit=10
 *
 * Returns community members with optional filtering and pagination.
 * In production, this maps to OrganizationUser + User joined data.
 */

import { NextRequest, NextResponse } from "next/server";
import { users } from "@/preview/mocks/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.toLowerCase();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  let filtered = [...users];

  if (role) filtered = filtered.filter((u) => u.role === role);
  if (status) filtered = filtered.filter((u) => u.status === status);
  if (search) {
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.title.toLowerCase().includes(search) ||
        u.building.toLowerCase().includes(search) ||
        u.location.toLowerCase().includes(search)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // Strip email from public response
  const sanitized = paginated.map(({ email, ...rest }) => rest);

  return NextResponse.json({
    members: sanitized,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: start + limit < total,
    },
  });
}
