"use client";

import { useState } from "react";
import type { CommunityConfig } from "@/schema";

export function OnboardingPreview({ config }: { config: CommunityConfig }) {
  const [step, setStep] = useState(0);
  const totalSteps = config.onboardingQuestions.length + 1; // +1 for welcome

  return (
    <div className="rounded-card border border-border bg-surface overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-surface-alt">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <div className="p-8">
        {step === 0 ? (
          /* Welcome step */
          <div className="text-center max-w-md mx-auto">
            <div
              className="w-16 h-16 rounded-card mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-on-primary"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              {config.name.charAt(0)}
            </div>
            <h3 className="text-2xl font-bold font-display text-on-surface">
              Welcome to {config.name}!
            </h3>
            {config.welcomeMessage && (
              <p className="text-on-surface-muted mt-4 leading-relaxed">
                {config.welcomeMessage}
              </p>
            )}
            <button
              onClick={() => setStep(1)}
              className="mt-8 bg-primary text-on-primary px-8 py-2.5 rounded-button font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
        ) : (
          /* Question steps */
          <div className="max-w-md mx-auto">
            <p className="text-xs text-on-surface-muted mb-2 uppercase tracking-wider">
              Question {step} of {config.onboardingQuestions.length}
            </p>
            <h3 className="text-lg font-semibold text-on-surface mb-4">
              {config.onboardingQuestions[step - 1].question}
            </h3>

            {config.onboardingQuestions[step - 1].type === "text" && (
              <input
                type="text"
                placeholder={
                  config.onboardingQuestions[step - 1].placeholder ||
                  "Type your answer..."
                }
                className="w-full px-4 py-2.5 rounded-button border border-border bg-surface text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                readOnly
              />
            )}

            {config.onboardingQuestions[step - 1].type === "textarea" && (
              <textarea
                placeholder={
                  config.onboardingQuestions[step - 1].placeholder ||
                  "Type your answer..."
                }
                rows={4}
                className="w-full px-4 py-2.5 rounded-button border border-border bg-surface text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                readOnly
              />
            )}

            {(config.onboardingQuestions[step - 1].type === "select" ||
              config.onboardingQuestions[step - 1].type === "multiselect") && (
              <div className="space-y-2">
                {config.onboardingQuestions[step - 1].options?.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-3 rounded-button border border-border hover:border-primary/30 cursor-pointer transition-colors"
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />
                    <span className="text-sm text-on-surface">{option}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                className="text-sm text-on-surface-muted hover:text-on-surface transition-colors"
              >
                Back
              </button>
              <button
                onClick={() =>
                  setStep(
                    Math.min(config.onboardingQuestions.length, step + 1)
                  )
                }
                className="bg-primary text-on-primary px-6 py-2 rounded-button font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {step === config.onboardingQuestions.length
                  ? "Finish"
                  : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
