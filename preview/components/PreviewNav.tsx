"use client";

import config from "@/preview/lib/config";

const navItems = [
  { label: "Landing", href: "#landing" },
  { label: "Channels", href: "#channels" },
  { label: "Feed", href: "#feed" },
  { label: "Events", href: "#events" },
  { label: "Members", href: "#members" },
  ...(config.membershipTiers.length > 0
    ? [{ label: "Pricing", href: "#pricing" }]
    : []),
  { label: "Onboarding", href: "#onboarding" },
  ...(config.assistant?.enabled
    ? [{ label: "Assistant", href: "#assistant" }]
    : []),
];

export function PreviewNav() {
  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-card bg-primary flex items-center justify-center text-on-primary text-sm font-bold">
            {config.name.charAt(0)}
          </div>
          <span className="font-display font-semibold text-on-surface text-sm">
            {config.name}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-sm text-on-surface-muted hover:text-on-surface hover:bg-surface-alt rounded-button transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
        <button className="bg-primary text-on-primary px-4 py-1.5 rounded-button text-sm font-medium hover:opacity-90 transition-opacity">
          Join Community
        </button>
      </div>
    </nav>
  );
}
