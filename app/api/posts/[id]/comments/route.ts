/**
 * GET /api/posts/:id/comments
 *
 * Returns comments for a specific post.
 */

import { NextRequest, NextResponse } from "next/server";
import { posts, comments, users } from "@/preview/mocks/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const postComments = comments
    .filter((c) => c.postId === id)
    .map((c) => {
      const author = users.find((u) => u.id === c.authorId);
      return {
        ...c,
        author: author ? { id: author.id, name: author.name, title: author.title } : null,
      };
    });

  return NextResponse.json({
    postId: id,
    comments: postComments,
    total: postComments.length,
  });
}
