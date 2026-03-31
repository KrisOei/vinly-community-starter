import { mockUsers } from "@/preview/mocks/data";

export function MemberGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {mockUsers.map((user) => (
        <div
          key={user.id}
          className="p-4 rounded-card border border-border bg-surface hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
              style={{ backgroundColor: stringToColor(user.name) }}
            >
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-on-surface text-sm truncate">
                {user.name}
              </h3>
              <p className="text-xs text-on-surface-muted truncate">
                {user.title}
              </p>
            </div>
          </div>
          <p className="text-xs text-on-surface-muted line-clamp-2">
            {user.building}
          </p>
          <div className="flex items-center gap-1 mt-3 text-xs text-on-surface-muted">
            <LocationIcon />
            <span>{user.location}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 55%, 50%)`;
}

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
