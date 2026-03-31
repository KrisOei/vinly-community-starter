import config from "@/preview/lib/config";
import { HeroSection } from "@/preview/components/HeroSection";
import { ChannelList } from "@/preview/components/ChannelList";
import { PostFeed } from "@/preview/components/PostFeed";
import { MembershipTiers } from "@/preview/components/MembershipTiers";
import { EventList } from "@/preview/components/EventList";
import { MemberGrid } from "@/preview/components/MemberGrid";
import { AssistantPreview } from "@/preview/components/AssistantPreview";
import { OnboardingPreview } from "@/preview/components/OnboardingPreview";
import { PreviewNav } from "@/preview/components/PreviewNav";

export default function PreviewPage() {
  return (
    <div className="min-h-screen">
      <PreviewNav />

      <main>
        {/* Hero / Landing */}
        <section id="landing">
          <HeroSection config={config} />
        </section>

        {/* Channels */}
        <section id="channels" className="max-w-6xl mx-auto px-6 py-16">
          <SectionHeader
            title="Channels"
            subtitle="Spaces for every conversation"
          />
          <ChannelList channels={config.channels} />
        </section>

        {/* Post Feed Sample */}
        <section id="feed" className="bg-surface-alt py-16">
          <div className="max-w-4xl mx-auto px-6">
            <SectionHeader
              title="Community Feed"
              subtitle="A taste of what members are sharing"
            />
            <PostFeed />
          </div>
        </section>

        {/* Events */}
        <section id="events" className="max-w-6xl mx-auto px-6 py-16">
          <SectionHeader
            title="Events"
            subtitle="What's happening in the community"
          />
          <EventList />
        </section>

        {/* Members */}
        <section id="members" className="bg-surface-alt py-16">
          <div className="max-w-6xl mx-auto px-6">
            <SectionHeader
              title="Members"
              subtitle={`${8} founders building together`}
            />
            <MemberGrid />
          </div>
        </section>

        {/* Membership Tiers */}
        {config.membershipTiers.length > 0 && (
          <section id="pricing" className="max-w-6xl mx-auto px-6 py-16">
            <SectionHeader
              title="Membership"
              subtitle="Choose the plan that fits your journey"
            />
            <MembershipTiers tiers={config.membershipTiers} />
          </section>
        )}

        {/* Onboarding Preview */}
        <section id="onboarding" className="bg-surface-alt py-16">
          <div className="max-w-2xl mx-auto px-6">
            <SectionHeader
              title="Onboarding Flow"
              subtitle="What new members see when they join"
            />
            <OnboardingPreview config={config} />
          </div>
        </section>

        {/* AI Assistant */}
        {config.assistant?.enabled && (
          <section id="assistant" className="max-w-4xl mx-auto px-6 py-16">
            <SectionHeader
              title={`Meet ${config.assistant.name}`}
              subtitle="Your AI-powered community assistant"
            />
            <AssistantPreview assistant={config.assistant} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-on-surface-muted text-sm">
          <p>
            This is a preview of <strong>{config.name}</strong> powered by{" "}
            <a
              href="https://vinly.co"
              className="underline hover:text-primary"
              target="_blank"
              rel="noopener"
            >
              Vinly
            </a>
            . Edit <code className="bg-surface-alt px-1.5 py-0.5 rounded text-xs">community.config.ts</code> to customize.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold font-display text-on-surface">{title}</h2>
      <p className="text-on-surface-muted mt-2">{subtitle}</p>
    </div>
  );
}
