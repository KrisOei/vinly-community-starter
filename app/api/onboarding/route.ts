/**
 * GET /api/onboarding
 * Returns the onboarding config (welcome message + questions).
 *
 * POST /api/onboarding
 * Body: { answers: [{ questionIndex, answer }] }
 * Simulates submitting onboarding answers.
 *
 * In production, this maps to Organization onboarding fields + Onboarding model.
 */

import { NextRequest, NextResponse } from "next/server";
import config from "@/preview/lib/config";

export async function GET() {
  return NextResponse.json({
    welcomeMessage: config.welcomeMessage,
    mandatoryOnboarding: config.mandatoryOnboarding,
    mandatoryIntroduction: config.mandatoryIntroduction,
    locationMapQuestion: config.locationMapQuestion,
    questions: config.onboardingQuestions.map((q, i) => ({
      index: i,
      question: q.question,
      type: q.type,
      options: q.options ?? null,
      required: q.required,
      placeholder: q.placeholder ?? null,
    })),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { answers } = body;

  if (!answers || !Array.isArray(answers)) {
    return NextResponse.json({ error: "answers array is required" }, { status: 400 });
  }

  // Validate required questions are answered
  const requiredIndices = config.onboardingQuestions
    .map((q, i) => (q.required ? i : -1))
    .filter((i) => i >= 0);

  const answeredIndices = answers.map((a: { questionIndex: number }) => a.questionIndex);
  const missing = requiredIndices.filter((i) => !answeredIndices.includes(i));

  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: "Missing required answers",
        missingQuestions: missing.map((i) => ({
          index: i,
          question: config.onboardingQuestions[i].question,
        })),
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Onboarding complete! Welcome to the community.",
    nextStep: config.mandatoryIntroduction ? "post_introduction" : "browse_channels",
  });
}
