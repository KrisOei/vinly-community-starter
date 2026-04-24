import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/api") &&
    process.env.NEXT_PUBLIC_DEMO_MODE === "false"
  ) {
    return NextResponse.json(
      {
        error: "Mock API is disabled",
        message:
          "NEXT_PUBLIC_DEMO_MODE is false. These mock routes only serve data in demo mode. " +
          "Set NEXT_PUBLIC_DEMO_MODE=true in .env.local, or point your API client to NEXT_PUBLIC_API_URL instead.",
      },
      { status: 503 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
