export const isDemoMode =
  process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "/api";

export const orgId =
  process.env.NEXT_PUBLIC_ORG_ID || "demo";
