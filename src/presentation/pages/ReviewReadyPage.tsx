/**
 * ============================================================
 * File: ReviewReadyPage.tsx
 * Purpose: The first door. Five questions. Three outputs.
 * Fifteen minutes. A document that makes your case.
 *
 * UX principle: one question at a time, never feels like
 * a form, never feels like work. Each question surfaces
 * something the user has never been asked to articulate.
 * ============================================================
 */

import { useState, type CSSProperties } from "react";
import { REVIEW_READY_QUESTIONS } from "../../domain/reviewReady.types";
import type {
  ReviewReadyInput,
  ReviewReadyOutput,
} from "../../domain/reviewReady.types";
import { generateReviewReady } from "../../application/actions/reviewReadyActions";

type PageState =
  | "intro"
  | "questions"
  | "generating"
  | "output"
  | "error";

const EMPTY_INPUT: ReviewReadyInput = {
  currentTitle: "",
  targetTitle: "",
  contribution1: "",
  beneficiaryAndOutcome: "",
  counterfactual: "",
  aboveScopeWork: "",
  additionalContext: "",
};

export default function ReviewReadyPage() {
  const [pageState, setPageState] = useState<PageState>("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState<ReviewReadyInput>(EMPTY_INPUT);
  const [output, setOutput] = useState<ReviewReadyOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const questions = REVIEW_READY_QUESTIONS;
  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  function handleInputChange(value: string) {
    setInput((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  }

  function handleNext() {
    if (isLastStep) {
      void handleGenerate();
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    } else {
      setPageState("intro");
    }
  }

  async function handleGenerate() {
    try {
      setPageState("generating");
      setError(null);
      const result = await generateReviewReady(input);
      setOutput(result);
      setPageState("output");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong generating your document. Please try again."
      );
      setPageState("error");
    }
  }

  function handleStartOver() {
    setInput(EMPTY_INPUT);
    setOutput(null);
    setError(null);
    setCurrentStep(0);
    setPageState("intro");
  }

  const currentValue =
    (input[currentQuestion?.id as keyof ReviewReadyInput] as string) ?? "";
  const canProceed =
    !currentQuestion?.isRequired || currentValue.trim().length > 0;

  if (pageState === "intro") {
    return (
      <div style={styles.page}>
        <div style={styles.centeredCard}>
          <span style={styles.eyebrow}>Review Ready</span>
          <h1 style={styles.headline}>
            Walk into your review with a stronger case than your manager expects.
          </h1>
          <p style={styles.bodyText}>
            Five questions. Plain language. A document that translates your
            work into the business value language that lands with decision makers.
          </p>
          <div style={styles.stepPreview}>
            {[
              "Your current title and where you are trying to go",
              "Your most significant contribution this year",
              "Who benefited and what changed because of your work",
              "What would have broken without your specific contribution",
              "What you did that was not in your job description",
            ].map((step, i) => (
              <div key={i} style={styles.stepItem}>
                <span style={styles.stepNumber}>{i + 1}</span>
                <span style={styles.stepText}>{step}</span>
              </div>
            ))}
          </div>
          <p style={styles.timeEstimate}>
            Most people finish in under 15 minutes.
          </p>
          <button
            style={styles.primaryButton}
            onClick={() => {
              setPageState("questions");
            }}
          >
            Start Building My Case
          </button>
          <p style={styles.pricingNote}>
            Free to complete &nbsp;·&nbsp; $25 to generate and download your document
          </p>
        </div>
      </div>
    );
  }

  if (pageState === "generating") {
    return (
      <div style={styles.page}>
        <div style={styles.centeredCard}>
          <div style={styles.generatingState}>
            <div style={styles.spinner} />
            <h2 style={styles.generatingTitle}>
              Building your promotion case...
            </h2>
            <p style={styles.generatingText}>
              Translating your work into business value language.
              Identifying your level signal. Preparing your conversation opener.
            </p>
            <p style={{ ...styles.generatingText, color: "var(--gold)", marginTop: "8px" }}>
              This takes about 20 seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div style={styles.page}>
        <div style={styles.centeredCard}>
          <h2 style={{ ...styles.headline, color: "var(--error)", fontSize: "1.5rem" }}>
            Something went wrong
          </h2>
          <p style={styles.bodyText}>{error}</p>
          <button style={styles.primaryButton} onClick={handleStartOver}>
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (pageState === "output" && output) {
    return (
      <div style={styles.page}>
        <div style={styles.outputContainer}>

          <div style={styles.outputHeader}>
            <span style={styles.eyebrow}>Your Promotion Case</span>
            <h1 style={styles.headline}>
              Here is what your work actually says about your level.
            </h1>
          </div>

          {/* THE AHA MOMENT — Level Signal first */}
          <div style={styles.levelSignalCard}>
            <p style={styles.levelSignalLabel}>Level Signal</p>
            <p style={styles.levelSignalText}>{output.levelSignal}</p>
            <p style={styles.levelSignalSub}>
              This is the sentence most people have never had the words for.
              It belongs in your review conversation.
            </p>
          </div>

          {/* Conversation Opener */}
          <div style={styles.openerCard}>
            <p style={styles.cardLabel}>How to open the conversation</p>
            <p style={styles.openerText}>
              &ldquo;{output.conversationOpener}&rdquo;
            </p>
            <p style={styles.cardSub}>
              Say this in the first 60 seconds. It sets the frame for everything that follows.
            </p>
          </div>

          {/* Business Value Tags */}
          <div style={styles.tagsRow}>
            {output.businessValueTags.map((tag) => (
              <span key={tag} style={styles.valueTag}>{tag}</span>
            ))}
            {output.scopeSignals.map((signal) => (
              <span key={signal} style={styles.scopeTag}>{signal}</span>
            ))}
          </div>

          {/* Translated Narrative */}
          <div style={styles.narrativeCard}>
            <p style={styles.cardLabel}>Your contribution — in business value language</p>
            <div style={styles.narrativeText}>
              {output.translatedNarrative.split("\n\n").map((para, i) => (
                <p key={i} style={{ marginBottom: "16px", lineHeight: 1.75 }}>
                  {para}
                </p>
              ))}
            </div>
            <div style={styles.narrativeActions}>
              <button
                style={styles.primaryButton}
                onClick={() => {
                  void navigator.clipboard.writeText(
                    `LEVEL SIGNAL\n${output.levelSignal}\n\nCONVERSATION OPENER\n"${output.conversationOpener}"\n\nYOUR CONTRIBUTION\n${output.translatedNarrative}`
                  );
                }}
              >
                Copy to Clipboard
              </button>
              <button style={styles.secondaryButton} onClick={handleStartOver}>
                Start a New Case
              </button>
            </div>
          </div>

          <p style={styles.disclaimerText}>
            Review this carefully before your meeting. Every word should feel true to you.
            Edit anything that does not sound like your voice.
            The document is yours — Visible generated the draft.
          </p>

        </div>
      </div>
    );
  }

  // QUESTION FLOW
  return (
    <div style={styles.page}>
      <div style={styles.questionContainer}>

        {/* Progress bar */}
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`,
            }}
          />
        </div>
        <p style={styles.progressLabel}>
          Question {currentStep + 1} of {totalSteps}
        </p>

        {/* Question */}
        <div style={styles.questionCard}>
          <h2 style={styles.questionTitle}>{currentQuestion.label}</h2>

          <p style={styles.helpText}>{currentQuestion.helpText}</p>

          <textarea
            style={styles.textarea}
            placeholder={currentQuestion.placeholder}
            value={currentValue}
            onChange={(e) => {
              handleInputChange(e.target.value);
            }}
            rows={6}
            autoFocus
          />

          <div style={styles.whyBox}>
            <span style={styles.whyLabel}>Why this matters</span>
            <p style={styles.whyText}>{currentQuestion.whyItMatters}</p>
          </div>

          <div style={styles.questionActions}>
            <button style={styles.backButton} onClick={handleBack}>
              ← Back
            </button>
            <button
              style={{
                ...styles.primaryButton,
                opacity: canProceed ? 1 : 0.4,
                cursor: canProceed ? "pointer" : "not-allowed",
              }}
              onClick={canProceed ? handleNext : undefined}
              disabled={!canProceed}
            >
              {isLastStep ? "Generate My Case →" : "Next →"}
            </button>
          </div>

          {!currentQuestion.isRequired && (
            <button
              style={styles.skipButton}
              onClick={() => {
                if (isLastStep) {
                  void handleGenerate();
                } else {
                  setCurrentStep((s) => s + 1);
                }
              }}
            >
              Skip this question
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "var(--ink)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "48px 24px",
    fontFamily: "var(--font-sans)",
  },
  centeredCard: {
    width: "100%",
    maxWidth: "640px",
    paddingTop: "16px",
  },
  eyebrow: {
    display: "inline-block",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "3px",
    textTransform: "uppercase" as const,
    color: "var(--teal-light)",
    marginBottom: "16px",
    padding: "4px 10px",
    border: "1px solid rgba(18,165,146,0.25)",
    borderRadius: "4px",
    background: "rgba(18,165,146,0.06)",
  },
  headline: {
    fontFamily: "var(--font-serif)",
    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: "16px",
    color: "var(--white)",
  },
  bodyText: {
    fontSize: "1rem",
    color: "var(--muted)",
    lineHeight: 1.75,
    fontWeight: 300,
    marginBottom: "28px",
  },
  stepPreview: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    marginBottom: "28px",
  },
  stepItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  stepNumber: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "var(--teal-glow)",
    border: "1px solid rgba(14,124,110,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "var(--teal-light)",
    flexShrink: 0,
  },
  stepText: {
    fontSize: "0.9rem",
    color: "var(--muted)",
    lineHeight: 1.5,
    fontWeight: 300,
    paddingTop: "3px",
  },
  timeEstimate: {
    fontSize: "0.82rem",
    color: "var(--muted)",
    marginBottom: "24px",
    fontStyle: "italic",
  },
  primaryButton: {
    display: "inline-block",
    background: "var(--teal)",
    color: "var(--white)",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "0.2px",
  },
  secondaryButton: {
    display: "inline-block",
    background: "transparent",
    color: "var(--muted)",
    border: "1px solid rgba(125,148,168,0.3)",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  pricingNote: {
    fontSize: "0.78rem",
    color: "var(--muted)",
    marginTop: "12px",
    fontWeight: 300,
  },
  questionContainer: {
    width: "100%",
    maxWidth: "660px",
    paddingTop: "16px",
  },
  progressBar: {
    height: "3px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "2px",
    marginBottom: "8px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, var(--teal), var(--teal-light))",
    borderRadius: "2px",
    transition: "width 0.4s ease",
  },
  progressLabel: {
    fontSize: "0.75rem",
    color: "var(--muted)",
    marginBottom: "32px",
    letterSpacing: "0.5px",
  },
  questionCard: {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "28px",
  },
  questionTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "var(--white)",
    marginBottom: "10px",
    lineHeight: 1.2,
  },
  helpText: {
    fontSize: "0.85rem",
    color: "var(--muted)",
    marginBottom: "16px",
    fontWeight: 300,
    lineHeight: 1.6,
  },
  textarea: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "14px 16px",
    color: "var(--white)",
    fontSize: "0.95rem",
    lineHeight: 1.65,
    resize: "vertical" as const,
    fontFamily: "var(--font-sans)",
    fontWeight: 300,
    outline: "none",
    transition: "border-color 0.2s",
    marginBottom: "16px",
  },
  whyBox: {
    background: "var(--teal-glow)",
    border: "1px solid rgba(14,124,110,0.2)",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "20px",
  },
  whyLabel: {
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "var(--teal-light)",
    display: "block",
    marginBottom: "6px",
  },
  whyText: {
    fontSize: "0.82rem",
    color: "var(--muted)",
    lineHeight: 1.6,
    fontWeight: 300,
    margin: 0,
  },
  questionActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  backButton: {
    background: "transparent",
    color: "var(--muted)",
    border: "none",
    padding: "10px 0",
    fontSize: "0.88rem",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  },
  skipButton: {
    display: "block",
    background: "transparent",
    border: "none",
    color: "var(--muted)",
    fontSize: "0.78rem",
    cursor: "pointer",
    marginTop: "12px",
    padding: 0,
    fontFamily: "var(--font-sans)",
    textDecoration: "underline",
  },
  generatingState: {
    textAlign: "center" as const,
    padding: "48px 0",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "3px solid rgba(14,124,110,0.2)",
    borderTop: "3px solid var(--teal-light)",
    borderRadius: "50%",
    margin: "0 auto 24px",
    animation: "spin 1s linear infinite",
  },
  generatingTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "var(--white)",
    marginBottom: "12px",
  },
  generatingText: {
    fontSize: "0.92rem",
    color: "var(--muted)",
    fontWeight: 300,
    lineHeight: 1.7,
  },
  outputContainer: {
    width: "100%",
    maxWidth: "720px",
    paddingTop: "16px",
  },
  outputHeader: {
    marginBottom: "28px",
  },
  levelSignalCard: {
    background: "linear-gradient(135deg, rgba(14,124,110,0.15), rgba(14,124,110,0.05))",
    border: "1px solid rgba(14,124,110,0.3)",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "16px",
  },
  levelSignalLabel: {
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "var(--teal-light)",
    marginBottom: "10px",
  },
  levelSignalText: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.35rem",
    fontWeight: 700,
    color: "var(--white)",
    lineHeight: 1.4,
    marginBottom: "10px",
  },
  levelSignalSub: {
    fontSize: "0.8rem",
    color: "var(--muted)",
    fontWeight: 300,
    fontStyle: "italic",
    margin: 0,
  },
  openerCard: {
    background: "rgba(200,168,75,0.06)",
    border: "1px solid rgba(200,168,75,0.2)",
    borderRadius: "14px",
    padding: "20px 24px",
    marginBottom: "16px",
  },
  cardLabel: {
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "var(--gold)",
    marginBottom: "10px",
  },
  openerText: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.15rem",
    fontWeight: 600,
    color: "var(--white)",
    lineHeight: 1.5,
    marginBottom: "10px",
    fontStyle: "italic",
  },
  cardSub: {
    fontSize: "0.8rem",
    color: "var(--muted)",
    fontWeight: 300,
    margin: 0,
  },
  tagsRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
    marginBottom: "16px",
  },
  valueTag: {
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "5px 10px",
    borderRadius: "4px",
    background: "var(--teal-glow)",
    color: "var(--teal-light)",
    border: "1px solid rgba(14,124,110,0.25)",
  },
  scopeTag: {
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "5px 10px",
    borderRadius: "4px",
    background: "var(--gold-soft)",
    color: "var(--gold)",
    border: "1px solid rgba(200,168,75,0.2)",
  },
  narrativeCard: {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "16px",
  },
  narrativeText: {
    fontSize: "0.95rem",
    color: "var(--white)",
    lineHeight: 1.75,
    fontWeight: 300,
    marginTop: "12px",
    marginBottom: "20px",
  },
  narrativeActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const,
  },
  disclaimerText: {
    fontSize: "0.78rem",
    color: "var(--muted)",
    fontWeight: 300,
    lineHeight: 1.6,
    fontStyle: "italic",
    marginBottom: "40px",
  },
};
