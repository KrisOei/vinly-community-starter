/**
 * GET /api/posts
 * GET /api/posts?channel=channel_001&pinned=true&page=1&limit=10
 *
 * POST /api/posts
 * Body: { channelId, content }
 *
 * Returns posts with author info, supports filtering and pagination.
 * In production, this maps to the Post + User + Channel models.
 */

import { NextRequest, NextResponse } from "next/server";
import { posts, users, comments } from "@/preview/mocks/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channel");
  const pinned = searchParams.get("pinned");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  let filtered = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (channelId) filtered = filtered.filter((p) => p.channelId === channelId);
  if (pinned === "true") filtered = filtered.filter((p) => p.isPinned);

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // Hydrate with author info and comments
  const hydrated = paginated.map((post) => {
    const author = users.find((u) => u.id === post.authorId);
    const postComments = comments
      .filter((c) => c.postId === post.id)
      .map((c) => ({
        ...c,
        author: (() => {
          const a = users.find((u) => u.id === c.authorId);
          return a ? { id: a.id, name: a.name, title: a.title } : null;
        })(),
      }));

    return {
      ...post,
      author: author
        ? { id: author.id, name: author.name, title: author.title, profilePictureUrl: author.profilePictureUrl }
        : null,
      comments: postComments,
    };
  });

  return NextResponse.json({
    posts: hydrated,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: start + limit < total },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { channelId, content } = body;

  if (!channelId || !content) {
    return NextResponse.json({ error: "channelId and content are required" }, { status: 400 });
  }

  if (content.length > 5000) {
    return NextResponse.json({ error: "Content exceeds 5000 character limit" }, { status: 400 });
  }

  // Simulate creating a post (mock user = first user)
  const newPost = {
    id: `post_${Date.now().toString(36)}`,
    authorId: users[0].id,
    channelId,
    channelName: "General",
    content,
    likes: 0,
    commentCount: 0,
    isPinned: false,
    isApproved: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: { id: users[0].id, name: users[0].name, title: users[0].title, profilePictureUrl: null },
    comments: [],
  };

  return NextResponse.json({ post: newPost }, { status: 201 });
}
