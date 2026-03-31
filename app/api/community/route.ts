/**
 * GET /api/community
 *
 * Returns the community profile and stats.
 * In production, this maps to the Organization model.
 */

import { NextResponse } from "next/server";
import config from "@/preview/lib/config";
import { getCommunityStats } from "@/preview/mocks/db";

export async function GET() {
  const stats = getCommunityStats();

  return NextResponse.json({
    name: config.name,
    abbreviation: config.abbreviation,
    description: config.description,
    tagline: config.tagline,
    logoUrl: config.logoUrl ?? null,
    coverImageUrl: config.coverImageUrl ?? null,
    theme: config.theme,
    private: config.private,
    assistant: config.assistant
      ? {
          enabled: config.assistant.enabled,
          name: config.assistant.name,
        }
      : null,
    stats,
  });
}
