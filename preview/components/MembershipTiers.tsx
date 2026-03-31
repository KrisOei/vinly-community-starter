import type { MembershipTier } from "@/schema";

export function MembershipTiers({ tiers }: { tiers: MembershipTier[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={`relative p-6 rounded-card border bg-surface flex flex-col ${
            tier.highlighted
              ? "border-primary shadow-lg ring-2 ring-primary/20"
              : "border-border"
          }`}
        >
          {tier.highlighted && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-xs font-semibold px-3 py-1 rounded-full">
              Most Popular
            </div>
          )}

          <h3 className="text-xl font-bold font-display text-on-surface">
            {tier.name}
          </h3>
          {tier.description && (
            <p className="text-sm text-on-surface-muted mt-1">
              {tier.description}
            </p>
          )}

          <div className="mt-5">
            <span className="text-4xl font-bold font-display text-on-surface">
              {tier.price === 0 ? "Free" : `$${tier.price}`}
            </span>
            {tier.price > 0 && (
              <span className="text-on-surface-muted text-sm ml-1">
                /{tier.interval === "monthly" ? "mo" : "yr"}
              </span>
            )}
          </div>

          {(tier.trialDays ?? 0) > 0 && (
            <p className="text-sm text-primary mt-1 font-medium">
              {tier.trialDays}-day free trial
            </p>
          )}

          <ul className="mt-6 space-y-3 flex-1">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <CheckIcon />
                <span className="text-on-surface">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            className={`mt-6 w-full py-2.5 rounded-button font-semibold text-sm transition-opacity hover:opacity-90 ${
              tier.highlighted
                ? "bg-primary text-on-primary"
                : "border-2 border-border text-on-surface hover:bg-surface-alt"
            }`}
          >
            {tier.price === 0 ? "Get Started" : "Start Free Trial"}
          </button>
        </div>
      ))}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
