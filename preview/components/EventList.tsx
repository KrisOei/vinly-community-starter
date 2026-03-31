import { mockEvents } from "@/preview/mocks/data";

export function EventList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mockEvents.map((event) => (
        <div
          key={event.id}
          className="p-5 rounded-card border border-border bg-surface hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TypeBadge type={event.type} />
                {event.maxAttendees && event.attendees >= event.maxAttendees && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                    Full
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-on-surface">{event.name}</h3>
              <p className="text-sm text-on-surface-muted mt-1 line-clamp-2">
                {event.description}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-on-surface-muted">
                <span className="flex items-center gap-1">
                  <CalendarIcon />
                  {event.date}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon />
                  {event.time}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white"
                  style={{ backgroundColor: stringToColor(event.host.name) }}
                >
                  {event.host.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="text-xs text-on-surface-muted">
                  Hosted by {event.host.name}
                </span>
                <span className="text-xs text-on-surface-muted ml-auto">
                  {event.attendees}
                  {event.maxAttendees ? `/${event.maxAttendees}` : ""} attending
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    virtual: "bg-blue-100 text-blue-700",
    "in-person": "bg-green-100 text-green-700",
    hybrid: "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${styles[type] || ""}`}
    >
      {type}
    </span>
  );
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 55%, 50%)`;
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
