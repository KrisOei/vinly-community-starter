/**
 * GET /api/membership
 * Returns membership tier definitions and stats.
 *
 * POST /api/membership/subscribe
 * Body: { tierId }
 * Simulates subscribing to a membership tier.
 *
 * In production, this maps to OrganizationMembershipTier + Stripe Connect.
 */

import { NextRequest, NextResponse } from "next/server";
import config from "@/preview/lib/config";
import { membershipStats } from "@/preview/mocks/db";

export async function GET() {
  const tiers = config.membershipTiers.map((tier, i) => ({
    id: `tier_${(i + 1).toString().padStart(3, "0")}`,
    name: tier.name,
    description: tier.description ?? null,
    price: tier.price,
    interval: tier.interval,
    trialDays: tier.trialDays,
    features: tier.features,
    highlighted: tier.highlighted,
    stats: membershipStats[i] ?? null,
  }));

  return NextResponse.json({
    tiers,
    totalTiers: tiers.length,
    totalMRR: membershipStats.reduce((sum, s) => sum + s.mrr, 0),
  });
}
