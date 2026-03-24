/**
 * ============================================================
 * File: reviewReady.types.ts
 * Purpose: Domain types for the Review Ready feature.
 * The first door. Five questions in. Three outputs out.
 * Fifteen minutes. A document that makes your case.
 * ============================================================
 */

export interface ReviewReadyInput {
  currentTitle: string;
  targetTitle: string;
  contribution1: string;
  beneficiaryAndOutcome: string;
  counterfactual: string;
  aboveScopeWork: string;
  additionalContext?: string;
}

export interface ReviewReadyOutput {
  translatedNarrative: string;
  levelSignal: string;
  conversationOpener: string;
  businessValueTags: string[];
  scopeSignals: string[];
  approvedByUser: boolean;
  generatedAt: string;
}

export interface ReviewReadySession {
  id: string;
  userId: string;
  input: ReviewReadyInput;
  output: ReviewReadyOutput | null;
  status: "drafting" | "generating" | "complete" | "error";
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewReadyQuestion {
  id: keyof ReviewReadyInput;
  step: number;
  label: string;
  placeholder: string;
  helpText: string;
  whyItMatters: string;
  isRequired: boolean;
}

export const REVIEW_READY_QUESTIONS: ReviewReadyQuestion[] = [
  {
    id: "currentTitle",
    step: 1,
    label: "What is your current title?",
    placeholder: "e.g. Operations Coordinator, Data Analyst, Administrative Associate",
    helpText: "Your exact title as it appears in HR systems.",
    whyItMatters: "The gap between your title and how you operate is often the clearest promotion argument.",
    isRequired: true,
  },
  {
    id: "targetTitle",
    step: 1,
    label: "What title are you trying to reach?",
    placeholder: "e.g. Operations Manager, Senior Analyst, Associate",
    helpText: "Be specific. If you are not sure, describe the level — one step up, two steps up.",
    whyItMatters: "Everything in your case needs to point toward this destination.",
    isRequired: true,
  },
  {
    id: "contribution1",
    step: 2,
    label: "Describe the most significant thing you accomplished this past year.",
    placeholder: "Do not worry about how it sounds. Just tell me what happened. What did you do?",
    helpText: "Plain language only. No jargon. Pretend you are telling a trusted friend over coffee.",
    whyItMatters: "Raw honest description produces better output than polished corporate language. We will translate it.",
    isRequired: true,
  },
  {
    id: "beneficiaryAndOutcome",
    step: 3,
    label: "Who benefited from that work — and what were they able to do because of it?",
    placeholder: "e.g. The brokers stopped waiting for information. The meeting ran without delays. The PM could make the decision faster.",
    helpText: "Name the people or groups. Describe what changed for them specifically.",
    whyItMatters: "Impact without a beneficiary is invisible. Naming who benefited and what changed makes the value concrete.",
    isRequired: true,
  },
  {
    id: "counterfactual",
    step: 4,
    label: "What would have broken or been significantly worse without your specific contribution?",
    placeholder: "e.g. The report would have required three hours of manual reconciliation every week. The guest would have waited while the receptionist called around.",
    helpText: "This is the counterfactual. It is often the most powerful sentence in the entire document.",
    whyItMatters: "Most valuable work is invisible because it prevents failures. This question makes the prevention visible.",
    isRequired: true,
  },
  {
    id: "aboveScopeWork",
    step: 5,
    label: "What did you do this year that was not in your job description?",
    placeholder: "e.g. I trained the new hire on three processes that had never been documented. I identified a risk in the data before anyone asked me to look.",
    helpText: "Any work you did because you saw it needed doing — not because it was assigned.",
    whyItMatters: "Promotion decisions are almost always based on whether someone is already operating at the next level. This is the evidence.",
    isRequired: true,
  },
  {
    id: "additionalContext",
    step: 5,
    label: "Anything else you want the document to reflect?",
    placeholder: "Optional — credentials earned, skills applied, difficult circumstances navigated, team impact.",
    helpText: "Leave blank if nothing comes to mind.",
    whyItMatters: "Context that did not fit the other questions.",
    isRequired: false,
  },
];
