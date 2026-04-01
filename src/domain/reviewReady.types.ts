export interface ReviewReadyQuestion {
  id: string;
  label: string;
  helpText: string;
  placeholder: string;
  whyItMatters: string;
  isRequired: boolean;
}

export interface ReviewReadyInput {
  currentTitle: string;
  targetTitle: string;
  contribution1: string;
  beneficiaryAndOutcome: string;
  counterfactual: string;
  aboveScopeWork: string;
  additionalContext: string;
}

export interface ReviewReadyOutput {
  levelSignal: string;
  conversationOpener: string;
  businessValueTags: string[];
  scopeSignals: string[];
  translatedNarrative: string;
  approvedByUser: boolean;
  generatedAt: string;
}

export const REVIEW_READY_QUESTIONS: ReviewReadyQuestion[] = [
  { id: 'currentTitle', label: 'What is your current job title?', helpText: 'Your official title at your company.', placeholder: 'e.g. Senior Analyst', whyItMatters: 'Helps frame the level gap we are making the case for.', isRequired: true },
  { id: 'targetTitle', label: 'What title are you targeting?', helpText: 'The role you want to be promoted into.', placeholder: 'e.g. Principal Analyst', whyItMatters: 'Defines the promotion case we are building.', isRequired: true },
  { id: 'contribution1', label: 'Describe your most impactful contribution this year.', helpText: 'One specific project, initiative, or outcome.', placeholder: 'e.g. Led the migration of our data pipeline...', whyItMatters: 'This becomes the centerpiece of your promotion case.', isRequired: true },
  { id: 'beneficiaryAndOutcome', label: 'Who benefited and what was the outcome?', helpText: 'Be specific about who was affected and how.', placeholder: 'e.g. The finance team saved 10 hours per week...', whyItMatters: 'Quantified impact is what gets promotions approved.', isRequired: true },
  { id: 'counterfactual', label: 'What would have happened without your contribution?', helpText: 'The counterfactual makes your value undeniable.', placeholder: 'e.g. We would have missed the Q3 deadline...', whyItMatters: 'Counterfactuals prove indispensability.', isRequired: false },
  { id: 'aboveScopeWork', label: 'Did you do anything above your current scope?', helpText: 'Work that belongs to the next level up.', placeholder: 'e.g. I led cross-functional alignment without being asked...', whyItMatters: 'Above-scope work is the strongest signal for promotion.', isRequired: false },
  { id: 'additionalContext', label: 'Anything else you want included?', helpText: 'Awards, feedback, context, constraints you worked within.', placeholder: 'Optional additional context...', whyItMatters: 'More context produces a stronger, more personalized case.', isRequired: false },
];
