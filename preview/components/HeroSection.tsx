import type { CommunityConfig } from "@/schema";
import { mockUsers } from "@/preview/mocks/data";

export function HeroSection({ config }: { config: CommunityConfig }) {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${config.theme.primaryColor} 0%, ${config.theme.secondaryColor} 100%)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          {/* Community logo placeholder */}
          <div
            className="w-20 h-20 rounded-card mb-8 flex items-center justify-center text-3xl font-bold text-on-primary"
            style={{ backgroundColor: config.theme.primaryColor }}
          >
            {config.name.charAt(0)}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-on-surface leading-tight">
            {config.name}
          </h1>

          {config.tagline && (
            <p
              className="text-xl md:text-2xl font-display mt-4"
              style={{ color: config.theme.primaryColor }}
            >
              {config.tagline}
            </p>
          )}

          <p className="text-lg text-on-surface-muted mt-6 leading-relaxed max-w-2xl">
            {config.description}
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-8">
            <Stat value={mockUsers.length.toString()} label="Members" />
            <Stat value={config.channels.length.toString()} label="Channels" />
            <Stat
              value={config.eventTemplates?.length?.toString() || "0"}
              label="Recurring Events"
            />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mt-10">
            <button
              className="px-8 py-3 rounded-button text-on-primary font-semibold text-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              {config.private ? "Request to Join" : "Join Community"}
            </button>
            <button className="px-8 py-3 rounded-button border-2 border-border text-on-surface font-semibold text-lg hover:bg-surface-alt transition-colors">
              Learn More
            </button>
          </div>

          {/* Member avatars */}
          <div className="flex items-center mt-10 gap-3">
            <div className="flex -space-x-2">
              {mockUsers.slice(0, 5).map((user, i) => (
                <div
                  key={user.id}
                  className="w-9 h-9 rounded-full border-2 border-surface flex items-center justify-center text-xs font-semibold text-on-primary"
                  style={{
                    backgroundColor: [
                      config.theme.primaryColor,
                      config.theme.secondaryColor,
                      config.theme.accentColor || "#10B981",
                      "#8B5CF6",
                      "#EC4899",
                    ][i],
                  }}
                >
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              ))}
            </div>
            <span className="text-sm text-on-surface-muted">
              Join {mockUsers[0].name.split(" ")[0]},{" "}
              {mockUsers[1].name.split(" ")[0]}, and others
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold font-display text-on-surface">
        {value}
      </div>
      <div className="text-sm text-on-surface-muted">{label}</div>
    </div>
  );
}
