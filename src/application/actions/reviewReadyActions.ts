/**
 * ============================================================
 * File: reviewReadyActions.ts
 * Purpose: Application actions for the Review Ready feature.
 * Calls the Claude API to generate the three outputs:
 * 1. Translated narrative (business value language)
 * 2. Level signal (the aha moment)
 * 3. Conversation opener (the first sentence they say)
 * ============================================================
 */

import type { ReviewReadyInput, ReviewReadyOutput } from "../../domain/reviewReady.types";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

function buildPrompt(input: ReviewReadyInput): string {
  return `You are a career development specialist with deep expertise in finance and professional services organizations. You help professionals articulate the value of their work in language that lands with decision makers.

A professional has answered five questions to build their performance review and promotion case. Your job is to generate three specific outputs that will help them walk into their review with a stronger case than their manager expects.

THEIR INPUTS:
Current title: ${input.currentTitle}
Target title: ${input.targetTitle}

Most significant contribution this year:
"${input.contribution1}"

Who benefited and what changed:
"${input.beneficiaryAndOutcome}"

What would have broken without their contribution:
"${input.counterfactual}"

Work done above their current scope:
"${input.aboveScopeWork}"

Additional context:
"${input.additionalContext ?? "None provided"}"

GENERATE THREE OUTPUTS:

OUTPUT 1 — TRANSLATED NARRATIVE
Rewrite their contribution story in business value language that a senior leader or compensation committee would immediately understand. Do not change the facts. Change the register. Replace functional language with outcome language. Replace task descriptions with value descriptions. The narrative should be 3-5 paragraphs. It should sound like a confident, factual professional describing their own work — not corporate HR language and not self-promotional boasting. It should be defensible under scrutiny because every claim is grounded in what they actually told you.

OUTPUT 2 — LEVEL SIGNAL
Write ONE sentence that names the gap between their current title and the level at which they are actually operating. This is the aha moment. It should be specific to their situation, not generic. It should name what they demonstrated that belongs at the next level. Example format: "The work you described designing the [specific system] and managing [specific stakeholder complexity] is operating at [target level] — your current title does not reflect the scope you are already carrying." Make it true, make it specific, make it something they have never had the words for before.

OUTPUT 3 — CONVERSATION OPENER
Write the ONE sentence they say when they walk into the review to set the frame for the entire conversation. Not a script. One sentence. It should be confident without being arrogant, specific without being defensive, and forward-looking without being presumptuous. It should make the manager lean in rather than get defensive. Example format: "I want to talk about the gap between what I have been doing this year and how that work is currently reflected in my title and compensation."

OUTPUT 4 — BUSINESS VALUE TAGS
List 3-5 short business value category labels that apply to their work. Examples: "Operational Reliability", "Decision Speed", "Risk Reduction", "Efficiency Gain", "Client Experience", "Strategic Enablement". These will appear as tags in their document.

OUTPUT 5 — SCOPE SIGNALS
List 2-3 short phrases that describe the above-scope signals in their contribution. Examples: "Self-initiated system design", "Cross-functional stakeholder management", "Ongoing value beyond task completion". These will appear in the promotion support section.

RESPOND IN THIS EXACT JSON FORMAT — no preamble, no explanation, just the JSON:

{
  "translatedNarrative": "...",
  "levelSignal": "...",
  "conversationOpener": "...",
  "businessValueTags": ["...", "...", "..."],
  "scopeSignals": ["...", "...", "..."]
}`;
}

export async function generateReviewReady(
  input: ReviewReadyInput
): Promise<ReviewReadyOutput> {
  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: buildPrompt(input),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} — ${errorText}`);
  }

  const data = await response.json() as {
    content: Array<{ type: string; text: string }>;
  };

  const rawText = data.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  const cleanJson = rawText
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();

  const parsed = JSON.parse(cleanJson) as {
    translatedNarrative: string;
    levelSignal: string;
    conversationOpener: string;
    businessValueTags: string[];
    scopeSignals: string[];
  };

  return {
    translatedNarrative: parsed.translatedNarrative,
    levelSignal: parsed.levelSignal,
    conversationOpener: parsed.conversationOpener,
    businessValueTags: parsed.businessValueTags,
    scopeSignals: parsed.scopeSignals,
    approvedByUser: false,
    generatedAt: new Date().toISOString(),
  };
}
