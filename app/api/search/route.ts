import { NextRequest, NextResponse } from "next/server";
import { users, posts, channels, events } from "@/preview/mocks/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("q")?.toLowerCase();
  const scope = searchParams.get("scope")?.split(",") || ["members", "posts", "channels", "events"];
  const limit = parseInt(searchParams.get("limit") || "5");

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
  }

  const results: Record<string, unknown[]> = {};

  if (scope.includes("members")) {
    results.members = users
      .filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.title.toLowerCase().includes(query) ||
          u.location.toLowerCase().includes(query) ||
          u.building.toLowerCase().includes(query)
      )
      .slice(0, limit)
      .map((u) => ({
        id: u.id,
        name: u.name,
        title: u.title,
        location: u.location,
        building: u.building,
      }));
  }

  if (scope.includes("posts")) {
    results.posts = posts
      .filter((p) => p.content.toLowerCase().includes(query))
      .slice(0, limit)
      .map((p) => {
        const author = users.find((u) => u.id === p.authorId);
        return {
          id: p.id,
          content: p.content.length > 200 ? p.content.slice(0, 200) + "..." : p.content,
          channelName: p.channelName,
          author: author ? { id: author.id, name: author.name } : null,
          createdAt: p.createdAt,
        };
      });
  }

  if (scope.includes("channels")) {
    results.channels = channels
      .filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          (c.description && c.description.toLowerCase().includes(query))
      )
      .slice(0, limit)
      .map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        emoji: c.emoji,
        memberCount: c.memberCount,
      }));
  }

  if (scope.includes("events")) {
    results.events = events
      .filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query)
      )
      .slice(0, limit)
      .map((e) => ({
        id: e.id,
        name: e.name,
        description: e.description.length > 150 ? e.description.slice(0, 150) + "..." : e.description,
        type: e.type,
        date: e.date,
        status: e.status,
      }));
  }

  const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

  return NextResponse.json({
    query,
    results,
    totalResults,
  });
}
