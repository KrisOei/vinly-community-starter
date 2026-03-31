import type { Channel } from "@/schema";

export function ChannelList({ channels }: { channels: Channel[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {channels.map((channel) => (
        <div
          key={channel.name}
          className="group p-5 rounded-card border border-border bg-surface hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{channel.emoji || "#"}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {channel.name}
                </h3>
                {channel.isPrivate && (
                  <span className="text-xs bg-surface-alt text-on-surface-muted px-2 py-0.5 rounded-full">
                    Private
                  </span>
                )}
                {channel.adminOnly && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              {channel.description && (
                <p className="text-sm text-on-surface-muted mt-1 line-clamp-2">
                  {channel.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
