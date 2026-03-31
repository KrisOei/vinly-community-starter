import { mockPosts } from "@/preview/mocks/data";

export function PostFeed() {
  return (
    <div className="space-y-4">
      {mockPosts.map((post) => (
        <article
          key={post.id}
          className="p-5 rounded-card border border-border bg-surface"
        >
          {/* Post header */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
              style={{ backgroundColor: stringToColor(post.author.name) }}
            >
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-on-surface text-sm">
                  {post.author.name}
                </span>
                <span className="text-xs text-on-surface-muted">
                  {post.author.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface-muted">
                <span>in #{post.channel}</span>
                <span>·</span>
                <span>{formatDate(post.createdAt)}</span>
                {post.isPinned && (
                  <>
                    <span>·</span>
                    <span className="text-primary font-medium">Pinned</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Post content */}
          <p className="text-on-surface leading-relaxed">{post.content}</p>

          {/* Post actions */}
          <div className="flex items-center gap-6 mt-4 pt-3 border-t border-border">
            <button className="flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-primary transition-colors">
              <HeartIcon />
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-primary transition-colors">
              <CommentIcon />
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-primary transition-colors">
              <ShareIcon />
              <span>Share</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 55%, 50%)`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
