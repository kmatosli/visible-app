/**
 * ============================================================
 * File: visible.types.ts
 * Project: Visible — Career Operating System
 * Purpose: Complete canonical data model for the Visible
 * platform. Every feature, every screen, every report,
 * and every insight in the application is derived from
 * the types defined in this file.
 *
 * Design principles:
 * - Employee owned. No employer access. Ever.
 * - Portable. Data travels with the user across jobs.
 * - Evidence-based. Claims require proof.
 * - Longitudinal. Value compounds over time.
 * - Actionable. Every insight connects to a next step.
 *
 * Domain structure:
 * - Identity & Onboarding
 * - Compensation & Benefits
 * - Work Entries & Contributions
 * - Ownership & Automation
 * - Promotional Readiness
 * - Goal Setting & Annual Framework
 * - Market Intelligence
 * - Relationships & Advocacy
 * - Departure & Decision Signals
 * - Reviews & Feedback
 * - Reports & Outputs
 * ============================================================
 */


// ============================================================
// SHARED PRIMITIVES
// ============================================================

export type UUID = string;
export type ISODateString = string;
export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "OTHER";

export interface DateRange {
  start: ISODateString;
  end?: ISODateString | null;
  isOngoing: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export type ConfidenceLevel = "confirmed" | "estimated" | "inferred";

export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

export interface QuarterYear {
  quarter: Quarter;
  year: number;
}


// ============================================================
// IDENTITY & ONBOARDING
// ============================================================

export type ProfessionalFunction =
  | "administrative"
  | "operations"
  | "finance_analyst"
  | "quant_research"
  | "data_engineering"
  | "portfolio_management"
  | "risk"
  | "compliance"
  | "technology"
  | "project_management"
  | "business_analysis"
  | "marketing"
  | "sales"
  | "human_resources"
  | "legal"
  | "executive"
  | "other";

export type IndustryVertical =
  | "asset_management"
  | "investment_banking"
  | "private_equity"
  | "hedge_fund"
  | "insurance"
  | "corporate_finance"
  | "fintech"
  | "technology"
  | "healthcare"
  | "consulting"
  | "government"
  | "nonprofit"
  | "other";

export type CareerStage =
  | "early"        // 0-3 years
  | "developing"   // 3-7 years
  | "established"  // 7-15 years
  | "senior"       // 15+ years
  | "executive";

export interface UserProfile {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  currentTitle: string;
  currentFunction: ProfessionalFunction;
  industry: IndustryVertical;
  careerStage: CareerStage;
  yearsOfExperience: number;
  linkedInUrl?: string | null;
  gitHubUrl?: string | null;
  location: UserLocation;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  onboardingCompletedAt?: ISODateString | null;
  onboardingSummary?: OnboardingSummary | null;
}

export interface UserLocation {
  city?: string | null;
  state?: string | null;
  country: string;
  isRemote: boolean;
  workMode: "fully_remote" | "hybrid" | "fully_onsite";
  onsiteDaysPerWeek?: number | null;
}

export interface OnboardingSummary {
  completedAt: ISODateString;
  currentSalaryEntered: boolean;
  promotionGoalSet: boolean;
  firstWorkEntryCreated: boolean;
  operationalRatioEstimated: boolean;
  firstAutomationOpportunityIdentified: boolean;
  initialGapAnalysisGenerated: boolean;
}


// ============================================================
// COMPENSATION & BENEFITS
// ============================================================

export type RaiseType =
  | "merit"
  | "cost_of_living"
  | "market_adjustment"
  | "promotional"
  | "retention"
  | "equity_adjustment"
  | "unknown";

export type BenefitType =
  | "health_insurance"
  | "dental_vision"
  | "retirement_match"
  | "profit_sharing"
  | "bonus"
  | "equity"
  | "vacation"
  | "tuition_reimbursement"
  | "professional_development"
  | "commuter"
  | "wellness"
  | "life_insurance"
  | "disability"
  | "other";

export interface BenefitItem {
  id: UUID;
  type: BenefitType;
  description: string;
  estimatedAnnualValue: number;
  currency: Currency;
  confidenceLevel: ConfidenceLevel;
  notes?: string | null;
}

export interface FinancialAnchor {
  id: UUID;
  type: "retirement_loan" | "education_repayment" | "signing_bonus_clawback" | "equity_vesting" | "other";
  description: string;
  amount: number;
  currency: Currency;
  vestingOrRepaymentDate?: ISODateString | null;
  remainingAmount: number;
  departureImpact: string;
  notes?: string | null;
}

export interface CompensationRecord {
  id: UUID;
  effectiveDate: ISODateString;
  baseSalary: number;
  currency: Currency;
  raiseAmount?: number | null;
  raisePercentage?: number | null;
  raiseType?: RaiseType | null;
  raiseDescription?: string | null;
  bonusTarget?: number | null;
  bonusActual?: number | null;
  profitSharingActual?: number | null;
  equityValue?: number | null;
  benefits: BenefitItem[];
  financialAnchors: FinancialAnchor[];
  totalCompensationCalculated: number;
  realValueAfterInflation?: number | null;
  inflationRateApplied?: number | null;
  marketComparisonLow?: number | null;
  marketComparisonMid?: number | null;
  marketComparisonHigh?: number | null;
  marketDataSource?: string | null;
  marketDataAsOf?: ISODateString | null;
  compensationGapAmount?: number | null;
  compensationGapPercentage?: number | null;
  notes?: string | null;
  createdAt: ISODateString;
}

export interface CompensationHistory {
  userId: UUID;
  records: CompensationRecord[];
  currentRecord: CompensationRecord | null;
  realValueTrend: CompensationTrendPoint[];
  gapTrend: CompensationTrendPoint[];
  goldenCuffsScore: number;
  goldenCuffsBreakdown: GoldenCuffsBreakdown;
}

export interface CompensationTrendPoint {
  date: ISODateString;
  nominalValue: number;
  realValue: number;
  marketMidpoint: number;
  gap: number;
}

export interface GoldenCuffsBreakdown {
  totalFinancialAnchors: number;
  vestingValue: number;
  benefitReplacementCost: number;
  vacationMonetaryValue: number;
  totalRetentionValue: number;
  minimumDepartureCompensationRequired: number;
  timeToBreakEvenIfLeaving: number;
  notes: string;
}


// ============================================================
// WORK ENTRIES & CONTRIBUTIONS
// ============================================================

export type ContributionType =
  | "fully_owned"
  | "partially_owned"
  | "executed_assigned"
  | "contributing_role"
  | "enabling_role"
  | "invisible_organizational_labor";

export type WorkPattern =
  | "interrupt_driven"
  | "assignment_based"
  | "self_initiated"
  | "recurring_operational"
  | "project_based"
  | "strategic_initiative";

export type BusinessFunction =
  | "risk"
  | "compliance"
  | "trading"
  | "operations"
  | "client_services"
  | "regulatory_reporting"
  | "corporate_strategy"
  | "technology"
  | "finance"
  | "human_resources"
  | "marketing"
  | "sales"
  | "other";

export type StakeholderLevel =
  | "peer"
  | "direct_manager"
  | "skip_level"
  | "department_head"
  | "senior_leadership"
  | "executive"
  | "board"
  | "regulator"
  | "external_client"
  | "vendor";

export type BusinessValueCategory =
  | "revenue_generation"
  | "revenue_protection"
  | "cost_reduction"
  | "efficiency_gain"
  | "risk_reduction"
  | "compliance"
  | "decision_speed"
  | "decision_quality"
  | "client_experience"
  | "team_effectiveness"
  | "operational_reliability"
  | "strategic_enablement"
  | "capability_building"
  | "scale_leverage";

export type ImpactStrength =
  | "supporting"
  | "meaningful"
  | "significant"
  | "transformative";

export type PromotionRelevance =
  | "core_responsibility"
  | "above_scope"
  | "strategic_contribution"
  | "leadership_signal"
  | "innovation";

export type DeliverableType =
  | "analytical_output"
  | "knowledge_transfer"
  | "decision_support"
  | "infrastructure"
  | "process_improvement"
  | "relationship_outcome"
  | "operational_execution"
  | "strategic_recommendation"
  | "system_or_tool"
  | "report_or_presentation"
  | "training_or_documentation"
  | "other";

export type AssignmentSource =
  | "self_initiated"
  | "direct_manager"
  | "skip_level"
  | "cross_functional_request"
  | "senior_leadership"
  | "inherited_from_role"
  | "crisis_or_escalation";

export interface QuantifiedImpact {
  timeSavedHoursPerWeek?: number | null;
  timeSavedOneTime?: number | null;
  peopleAffected?: number | null;
  peopleAffectedLevel?: StakeholderLevel | null;
  errorRateBefore?: number | null;
  errorRateAfter?: number | null;
  speedImprovementPercentage?: number | null;
  costSavedEstimate?: number | null;
  revenueInfluenceEstimate?: number | null;
  aumAffected?: number | null;
  outputVolumeChange?: number | null;
  otherMetricLabel?: string | null;
  otherMetricValue?: string | null;
  confidenceLevel: ConfidenceLevel;
  quantificationNotes?: string | null;
}

export interface EvidenceItem {
  id: UUID;
  type: "metric" | "document" | "email" | "pr_or_commit" | "dashboard" | "audit_finding" | "feedback_note" | "presentation" | "data_output" | "other";
  title: string;
  description: string;
  sourceUrl?: string | null;
  sourceSystem?: "google_drive" | "onedrive" | "sharepoint" | "github" | "email" | "slack" | "teams" | "other" | null;
  attachedAt: ISODateString;
  isExternalValidation: boolean;
  validatedBy?: string | null;
  validatedAt?: ISODateString | null;
}

export interface EndorsementRequest {
  id: UUID;
  requestedFrom: string;
  requestedFromLevel: StakeholderLevel;
  requestedAt: ISODateString;
  responseReceivedAt?: ISODateString | null;
  responseContent?: string | null;
  responseType?: "email" | "verbal" | "written_note" | "formal_review" | "other" | null;
  isAttachedAsEvidence: boolean;
  evidenceItemId?: UUID | null;
}

export interface LargerInitiative {
  initiativeName: string;
  initiativeOwner?: string | null;
  userContributionDescription: string;
  counterfactualWithoutContribution: string;
  whoAssembledTheWhole?: string | null;
  wholePresentedTo?: StakeholderLevel | null;
  userAttributionInPresentation?: "full" | "partial" | "none" | "unknown" | null;
}

export interface ManagerVisibility {
  howManagerLearnedOfOutcome:
    | "scheduled_meeting"
    | "proactive_update"
    | "natural_discovery"
    | "not_yet_aware"
    | "other";
  managerReactionIfKnown?: string | null;
  seniorStakeholderAwareness: StakeholderLevel[];
  visibilityGapIdentified: boolean;
  visibilityGapDescription?: string | null;
}

export interface WorkEntry {
  id: UUID;
  userId: UUID;
  title: string;
  dateRange: DateRange;
  workPattern: WorkPattern;
  contributionType: ContributionType;
  assignmentSource: AssignmentSource;
  businessFunction: BusinessFunction;
  deliverableType: DeliverableType;
  stakeholdersAffected: StakeholderLevel[];
  primaryStakeholderLevel: StakeholderLevel;

  // Narrative fields — guided input
  situation: string;
  action: string;
  result: string;
  counterfactual: string;
  architecturalThinking?: string | null;
  whatMadeItHard?: string | null;
  knowledgeTransferred?: string | null;

  // Classification
  businessValueCategories: BusinessValueCategory[];
  primaryBusinessValue: BusinessValueCategory;
  impactStrength: ImpactStrength;
  promotionRelevance: PromotionRelevance;
  isOngoing: boolean;
  ongoingValueDescription?: string | null;
  reusabilitySignal?: string | null;

  // Quantification
  quantifiedImpact: QuantifiedImpact;

  // Evidence and validation
  evidence: EvidenceItem[];
  endorsementRequests: EndorsementRequest[];
  hasExternalValidation: boolean;

  // Fragmented work context
  isPartOfLargerInitiative: boolean;
  largerInitiative?: LargerInitiative | null;

  // Ownership and automation
  ownershipAssessment: OwnershipAssessment;

  // Visibility
  managerVisibility: ManagerVisibility;

  // Invisible labor flag
  isInvisibleOrganizationalLabor: boolean;
  invisibleLaborType?: "mentoring" | "knowledge_transfer" | "covering_absence" | "committee_work" | "unattributed_synthesis" | "onboarding_support" | "other" | null;
  invisibleLaborTimeHoursPerMonth?: number | null;

  // Revenue connection
  revenueConnectionType: "direct" | "indirect_enabling" | "indirect_protecting" | "none" | "unknown";
  revenueConnectionDescription?: string | null;

  // Generated output
  generatedNarrative?: string | null;
  narrativeApprovedByUser: boolean;
  reportLanguageVersion?: string | null;

  // Metadata
  tags: string[];
  linkedGoalId?: UUID | null;
  linkedReviewId?: UUID | null;
  quarter: QuarterYear;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}


// ============================================================
// OWNERSHIP & AUTOMATION
// ============================================================

export type OwnershipType =
  | "full_ownership"
  | "partial_ownership"
  | "execution_only"
  | "contributing_member";

export type WorkNature =
  | "operational_recurring"
  | "operational_nonrecurring"
  | "revenue_connected"
  | "strategic"
  | "developmental"
  | "administrative";

export type AutomationPotential =
  | "high"
  | "medium"
  | "low"
  | "not_applicable"
  | "unknown";

export interface OwnershipAssessment {
  ownershipType: OwnershipType;
  workNature: WorkNature;
  isAutomatable: boolean;
  automationPotential: AutomationPotential;
  automationSkillsRequired?: string[] | null;
  userHasAutomationSkills: boolean;
  estimatedTimePerWeekHours?: number | null;
  ifAutomatedWouldFreeHoursPerWeek?: number | null;
  freedTimeIntendedUse?: string | null;
  freedTimeAlignedWithGoal: boolean;
  automationPriorityScore?: number | null;
}

export interface AutomationOpportunityMap {
  userId: UUID;
  generatedAt: ISODateString;
  totalOperationalHoursPerWeek: number;
  totalAutomatableHoursPerWeek: number;
  topOpportunities: AutomationOpportunity[];
  freedTimeIfTopThreeAutomated: number;
  statedUseOfFreedTime: string;
  alignmentWithPromotionGoal: boolean;
  recommendedFirstAutomation: AutomationOpportunity | null;
}

export interface AutomationOpportunity {
  workEntryId: UUID;
  workEntryTitle: string;
  estimatedHoursPerWeek: number;
  automationPotential: AutomationPotential;
  requiredSkills: string[];
  userHasSkills: boolean;
  skillGapToClose?: string | null;
  projectedTimeToAutomate?: string | null;
  freedTimeUse?: string | null;
}

export interface OperationalRevenueRatio {
  userId: UUID;
  calculatedAt: ISODateString;
  periodCovered: DateRange;
  operationalPercentage: number;
  revenueConnectedPercentage: number;
  strategicPercentage: number;
  developmentalPercentage: number;
  targetRatioForPromotionGoal: OperationalRevenueRatio | null;
  gapFromTarget: number;
  trend: "improving" | "stable" | "worsening";
  trendNotes: string;
}


// ============================================================
// SKILLS & MARKET INTELLIGENCE
// ============================================================

export type SkillCategory =
  | "technical"
  | "analytical"
  | "communication"
  | "leadership"
  | "domain_knowledge"
  | "process"
  | "tools_and_systems"
  | "strategic"
  | "interpersonal"
  | "emerging";

export type SkillDemandTrajectory =
  | "rapidly_growing"
  | "growing"
  | "stable"
  | "declining"
  | "being_automated";

export type SkillPortability =
  | "highly_portable"
  | "moderately_portable"
  | "firm_specific"
  | "industry_specific";

export interface Skill {
  id: UUID;
  name: string;
  category: SkillCategory;
  proficiencyLevel: "awareness" | "developing" | "proficient" | "advanced" | "expert";
  isFirmSpecific: boolean;
  portability: SkillPortability;
  demandTrajectory: SkillDemandTrajectory;
  marketDemandScore?: number | null;
  isOnTopGrowingSkillsList: boolean;
  topGrowingSkillsRank?: number | null;
  appliedInEntryIds: UUID[];
  lastAppliedAt?: ISODateString | null;
  acquiredAt?: ISODateString | null;
  credential?: CredentialRecord | null;
  notes?: string | null;
}

export interface CredentialRecord {
  id: UUID;
  name: string;
  issuingOrganization: string;
  acquiredAt: ISODateString;
  expiresAt?: ISODateString | null;
  internalOrganizationalValue: "high" | "medium" | "low" | "unknown";
  externalMarketValue: "high" | "medium" | "low" | "unknown";
  internalValueDependsOn?: string | null;
  externalValueDescription?: string | null;
  singlePointOfFailureRisk: boolean;
  whoInternallyRecognizesThis: string[];
  whatHappensIfTheyLeave?: string | null;
  notes?: string | null;
}

export interface MarketSalaryRange {
  id: UUID;
  roleTitle: string;
  function: ProfessionalFunction;
  industry: IndustryVertical;
  geography: string;
  experienceLevel: CareerStage;
  salaryLow: number;
  salaryMid: number;
  salaryHigh: number;
  currency: Currency;
  source: string;
  sourceUrl?: string | null;
  asOfDate: ISODateString;
  includesBonus: boolean;
  includesTotalCompensation: boolean;
  notes?: string | null;
}

export interface SkillGapAnalysis {
  userId: UUID;
  promotionGoalId: UUID;
  generatedAt: ISODateString;
  currentSkills: Skill[];
  requiredSkillsForTarget: string[];
  gapSkills: SkillGap[];
  strengthSkills: Skill[];
  atRiskSkills: Skill[];
  overallReadinessScore: number;
  prioritizedDevelopmentPlan: DevelopmentAction[];
}

export interface SkillGap {
  skillName: string;
  category: SkillCategory;
  currentLevel: string;
  requiredLevel: string;
  marketDemand: SkillDemandTrajectory;
  estimatedTimeToClose: string;
  suggestedActions: string[];
  priority: "critical" | "high" | "medium" | "low";
}

export interface DevelopmentAction {
  id: UUID;
  skillTargeted: string;
  actionDescription: string;
  actionType: "course" | "certification" | "on_the_job" | "mentoring" | "project" | "reading" | "networking" | "other";
  estimatedTimeInvestment: string;
  estimatedCost?: number | null;
  employerMayFund: boolean;
  linkedToGoalId?: UUID | null;
  targetCompletionQuarter: QuarterYear;
  completedAt?: ISODateString | null;
  outcomeDescription?: string | null;
  marketValueImpact?: string | null;
}


// ============================================================
// PROMOTIONAL READINESS SELF ASSESSMENT
// ============================================================

export type PromotionalDimension =
  | "communication_and_presence"
  | "leadership_and_influence"
  | "strategic_thinking"
  | "execution_reliability"
  | "relationships_and_collaboration"
  | "self_awareness_and_development";

export interface DimensionRating {
  dimension: PromotionalDimension;
  selfRating: 1 | 2 | 3 | 4 | 5;
  evidenceEntryIds: UUID[];
  supportingEvidence: string;
  gapDescription?: string | null;
  managerFeedbackAligns?: boolean | null;
  managerFeedbackNotes?: string | null;
  priorityForDevelopment: "critical" | "high" | "medium" | "low";
  developmentActions: DevelopmentAction[];
}

export interface PublicSpeakingRecord {
  id: UUID;
  eventDescription: string;
  audienceLevel: StakeholderLevel;
  audienceSize?: number | null;
  date: ISODateString;
  outcome: string;
  feedbackReceived?: string | null;
  confidenceLevel: 1 | 2 | 3 | 4 | 5;
  notes?: string | null;
}

export interface LeadershipInstance {
  id: UUID;
  description: string;
  hadFormalAuthority: boolean;
  influencedWithoutAuthority: boolean;
  outcomeAchieved: string;
  peopleInfluenced?: number | null;
  date: ISODateString;
  evidenceEntryId?: UUID | null;
}

export interface PromotionalReadinessAssessment {
  id: UUID;
  userId: UUID;
  promotionGoalId: UUID;
  assessedAt: ISODateString;
  quarter: QuarterYear;
  dimensionRatings: DimensionRating[];
  overallReadinessScore: number;
  overallReadinessNarrative: string;
  publicSpeakingRecords: PublicSpeakingRecord[];
  leadershipInstances: LeadershipInstance[];
  strongestDimensions: PromotionalDimension[];
  criticalGapDimensions: PromotionalDimension[];
  selfPerceptionVsEvidenceGaps: SelfPerceptionGap[];
  readinessComparedToTargetLevel: "below" | "approaching" | "at" | "exceeds";
  estimatedTimeToReadiness?: string | null;
  previousAssessmentId?: UUID | null;
  trendFromPrevious?: "improving" | "stable" | "declining" | null;
}

export interface SelfPerceptionGap {
  dimension: PromotionalDimension;
  selfRating: number;
  evidenceSupportedRating: number;
  gapDirection: "overrating" | "underrating" | "aligned";
  gapMagnitude: number;
  interpretation: string;
}


// ============================================================
// GOAL SETTING & ANNUAL FRAMEWORK
// ============================================================

export type GoalType =
  | "contribution"
  | "development"
  | "visibility"
  | "relationship"
  | "compensation"
  | "automation"
  | "promotion";

export type GoalStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "blocked"
  | "deferred"
  | "abandoned";

export interface PromotionGoal {
  id: UUID;
  userId: UUID;
  targetTitle: string;
  targetFunction: ProfessionalFunction;
  targetCompensation: number;
  targetCurrency: Currency;
  targetTimeline: ISODateString;
  targetOrganization: "current" | "external" | "either";
  isActive: boolean;
  setAt: ISODateString;
  lastReviewedAt?: ISODateString | null;
  progressNarrative?: string | null;
  organizationCanDeliverThis: boolean | null;
  organizationCanDeliverAssessment?: string | null;
  requiredCapabilities: string[];
  requiredExperiences: string[];
  currentReadinessScore?: number | null;
  estimatedGapClosureDate?: ISODateString | null;
  notes?: string | null;
}

export interface QuarterlyGoal {
  id: UUID;
  userId: UUID;
  promotionGoalId: UUID;
  quarter: QuarterYear;
  goalType: GoalType;
  title: string;
  description: string;
  successCriteria: string;
  status: GoalStatus;
  progressNotes: string[];
  linkedWorkEntryIds: UUID[];
  completedAt?: ISODateString | null;
  outcomeDescription?: string | null;
  lessonLearned?: string | null;
  carriedToNextQuarter: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface QuarterlyPlan {
  id: UUID;
  userId: UUID;
  quarter: QuarterYear;
  quarterType: "execution" | "planning";
  goals: QuarterlyGoal[];
  focusStatement: string;
  keyConstraints: string[];
  keyOpportunities: string[];
  operationalRatioTarget: number;
  revenueConnectedTarget: number;
  createdAt: ISODateString;
  reviewedAt?: ISODateString | null;
  reviewSummary?: string | null;
}

export interface AnnualStrategicPlan {
  id: UUID;
  userId: UUID;
  year: number;
  createdInQ4Of: number;
  promotionGoalId: UUID;
  threeTopPriorities: AnnualPriority[];
  yearInReviewSummary: string;
  compensationReviewPreparationComplete: boolean;
  promotionalReadinessAssessmentComplete: boolean;
  keyLessonsFromPriorYear: string[];
  whatToStopDoing: string[];
  whatToStartDoing: string[];
  whatToContinueDoing: string[];
  sponsorshipRedundancyTarget: number;
  currentSponsorshipScore: number;
  q4PlanningCompletedAt?: ISODateString | null;
}

export interface AnnualPriority {
  rank: 1 | 2 | 3;
  description: string;
  type: GoalType;
  expectedOutcome: string;
  successMeasure: string;
  linkedToPromotionGoal: boolean;
}

export interface MidYearReview {
  id: UUID;
  userId: UUID;
  year: number;
  conductedAt: ISODateString;
  wasOrganizationProvided: boolean;
  q1GoalsOnTrack: boolean;
  q2GoalsOnTrack: boolean;
  blockers: string[];
  adjustmentsForH2: string[];
  promotionGoalStillValid: boolean;
  promotionGoalAdjustments?: string | null;
  overallH1Assessment: string;
  h2ActionPlan: string;
  generatedByVisible: boolean;
}


// ============================================================
// REVIEWS & FEEDBACK
// ============================================================

export type ReviewType =
  | "annual_performance"
  | "mid_year"
  | "quarterly_check_in"
  | "probationary"
  | "promotion_review"
  | "informal_feedback"
  | "peer_feedback"
  | "upward_feedback";

export type PerformanceRating =
  | "exceeds_expectations"
  | "meets_expectations"
  | "partially_meets"
  | "does_not_meet"
  | "outstanding"
  | "no_rating_given"
  | "other";

export type CeilingSignalType =
  | "salary_band_maximum"
  | "title_ceiling_stated"
  | "job_description_change_required"
  | "no_headcount_for_promotion"
  | "implicit_ceiling"
  | "none_detected";

export interface ReviewFeedbackItem {
  id: UUID;
  dimension: string;
  feedbackText: string;
  isStrength: boolean;
  isDevelopmentArea: boolean;
  isBlindSpot: boolean;
  actionRequired?: string | null;
  linkedDimensionRating?: PromotionalDimension | null;
  userAgreesWithFeedback: boolean | null;
  userResponseNotes?: string | null;
}

export interface PerformanceReview {
  id: UUID;
  userId: UUID;
  reviewType: ReviewType;
  reviewPeriodStart: ISODateString;
  reviewPeriodEnd: ISODateString;
  conductedAt: ISODateString;
  reviewerTitle?: string | null;
  reviewerLevel?: StakeholderLevel | null;
  officialRating?: PerformanceRating | null;
  userSelfAssessmentRating?: PerformanceRating | null;
  ratingAlignedWithContributionRecord: boolean | null;
  ratingGapExplanation?: string | null;

  // Compensation outcome
  compensationOutcome?: CompensationRecord | null;
  raiseCharacterizedAs?: RaiseType | null;
  realValueOfRaiseAfterInflation?: number | null;
  wasRaiseAdequate: boolean | null;
  adequacyAssessmentNotes?: string | null;

  // Feedback capture
  feedbackItems: ReviewFeedbackItem[];
  promotionTimelineDiscussed: boolean;
  promotionTimelineDetails?: string | null;
  promotionCriteriaSpecified: boolean;
  promotionCriteriaDetails?: string | null;
  promotionCriteriaWillBeTracked: boolean;

  // Ceiling signals
  ceilingSignalDetected: CeilingSignalType;
  ceilingSignalVerbatim?: string | null;
  ceilingSignalImplication?: string | null;
  jobDescriptionChangeRequired: boolean;
  jobDescriptionChangeDetails?: string | null;
  organizationLikelyToDeliverPromotion: boolean | null;
  organizationAssessmentNotes?: string | null;

  // Goal alignment
  goalsWereSetForPeriod: boolean;
  goalsProvidedByOrganization: boolean;
  goalsSetByEmployee: boolean;
  goalAchievementSummary?: string | null;

  // Overall assessment
  overallReviewNarrative: string;
  actionItemsForNextPeriod: string[];
  visibleRecordAlignedWithReview: boolean;
  visibleRecordGaps?: string | null;

  createdAt: ISODateString;
  updatedAt: ISODateString;
}


// ============================================================
// RELATIONSHIPS, ADVOCACY & SPONSORSHIP
// ============================================================

export type RelationshipType =
  | "direct_manager"
  | "skip_level"
  | "peer"
  | "cross_functional"
  | "senior_stakeholder"
  | "executive_sponsor"
  | "external_mentor"
  | "industry_contact"
  | "recruiter"
  | "former_colleague";

export type AdvocacyStrength =
  | "active_sponsor"
  | "passive_supporter"
  | "neutral_aware"
  | "uninformed"
  | "potentially_detrimental";

export type RelationshipHealthStatus =
  | "strong_and_current"
  | "warm_but_inactive"
  | "cooling"
  | "cold"
  | "damaged"
  | "new";

export interface RelationshipRecord {
  id: UUID;
  userId: UUID;
  contactName: string;
  contactTitle: string;
  contactLevel: StakeholderLevel;
  relationshipType: RelationshipType;
  organizationContext: "current_employer" | "former_employer" | "external";
  isHighLeverage: boolean;
  advocacyStrength: AdvocacyStrength;
  healthStatus: RelationshipHealthStatus;
  lastMeaningfulInteractionAt?: ISODateString | null;
  lastInteractionDescription?: string | null;
  workTheyHaveSeen: UUID[];
  hasSpokenPositivelyAboutWork: boolean;
  positiveStatementContext?: string | null;
  isActiveReference: boolean;
  referenceLastRefreshedAt?: ISODateString | null;
  credentialTheyHoldForUser?: string | null;
  hasBeenAskedToEndorse: boolean;
  endorsementResponseReceived: boolean;
  endorsementContent?: string | null;
  nextPlannedInteraction?: ISODateString | null;
  nextInteractionPurpose?: string | null;
  notes?: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SponsorshipProfile {
  userId: UUID;
  calculatedAt: ISODateString;
  activeSponsors: RelationshipRecord[];
  passiveSupporters: RelationshipRecord[];
  sponsorshipRedundancyScore: number;
  isSinglePointOfFailure: boolean;
  singlePointOfFailureRisk?: string | null;
  minimumViableSponsors: number;
  currentSponsorCount: number;
  sponsorshipGapDescription: string;
  recommendedActions: SponsorshipAction[];
  lastSponsorChangeAt?: ISODateString | null;
  sponsorTransitionProtocolActive: boolean;
  sponsorTransitionDetails?: SponsorTransitionProtocol | null;
}

export interface SponsorTransitionProtocol {
  triggeredAt: ISODateString;
  departedSponsorName: string;
  departedSponsorLevel: StakeholderLevel;
  immediateExposureToNewLeadership: RelationshipRecord[];
  top3ContributionsForReintroduction: UUID[];
  naturalReintroductionOpportunities: string[];
  rebuildTimelineWeeks: number;
  currentStatus: "active" | "in_progress" | "completed";
  completedAt?: ISODateString | null;
}

export interface SponsorshipAction {
  priority: number;
  description: string;
  targetContact?: string | null;
  rationale: string;
  suggestedTimeframe: string;
}

export interface MentorRecord {
  id: UUID;
  userId: UUID;
  mentorName?: string | null;
  mentorTitle?: string | null;
  mentorLevel?: StakeholderLevel | null;
  isOrganizationProvided: boolean;
  isSelfFound: boolean;
  isVisible: boolean;
  mentorshipAreas: string[];
  meetingCadence?: string | null;
  lastMeetingAt?: ISODateString | null;
  keyInsightsReceived: MentorInsight[];
  isActive: boolean;
  startedAt?: ISODateString | null;
  endedAt?: ISODateString | null;
  notes?: string | null;
}

export interface MentorInsight {
  id: UUID;
  receivedAt: ISODateString;
  insightText: string;
  category: "unwritten_rules" | "blind_spot_feedback" | "strategic_guidance" | "technical_guidance" | "political_navigation" | "career_direction" | "other";
  actionTaken?: string | null;
  wasValuable: boolean | null;
}


// ============================================================
// DEPARTURE & DECISION SIGNALS
// ============================================================

export type DepartureSignalStrength =
  | "green"
  | "yellow"
  | "orange"
  | "red";

export interface DepartureSignalScore {
  userId: UUID;
  calculatedAt: ISODateString;
  overallSignal: DepartureSignalStrength;
  overallScore: number;
  compensationGapSignal: DepartureSignalStrength;
  compensationGapScore: number;
  visibilityStagnationSignal: DepartureSignalStrength;
  visibilityStagnationScore: number;
  skillAlignmentDriftSignal: DepartureSignalStrength;
  skillAlignmentDriftScore: number;
  sponsorshipVacuumSignal: DepartureSignalStrength;
  sponsorshipVacuumScore: number;
  ceilingPatternSignal: DepartureSignalStrength;
  ceilingPatternScore: number;
  identityCeilingDetected: boolean;
  identityCeilingDescription?: string | null;
  timeInRoleWithoutAdvancement?: number | null;
  narrativeSummary: string;
  recommendedAction: string;
  externalMarketValueEstimate?: number | null;
  whatWouldNeedToChangeTo Stay: string[];
  changeRequiredByDate?: ISODateString | null;
}

export interface JobOfferEvaluation {
  id: UUID;
  userId: UUID;
  evaluatedAt: ISODateString;
  offerFromOrganization: string;
  offerTitle: string;
  offerFunction: ProfessionalFunction;

  // Compensation comparison
  offerBaseSalary: number;
  offerCurrency: Currency;
  offerBonusTarget?: number | null;
  offerEquity?: number | null;
  offerBenefitsEstimatedValue?: number | null;
  offerTotalCompensationEstimate: number;
  currentTotalCompensation: number;
  nominalCompensationGain: number;
  realCompensationGainAfterCosts?: number | null;

  // Work mode cost
  workMode: "fully_remote" | "hybrid" | "fully_onsite";
  commuteCostPerYear?: number | null;
  commuteTimeHoursPerYear?: number | null;
  commuteTimeMonetizedValue?: number | null;
  flexibilityValueForfeited?: number | null;
  totalWorkModeCostAdjustment?: number | null;
  adjustedCompensationComparison?: number | null;

  // Skills and trajectory
  roleUsesCurrentStrengths: boolean;
  roleDevelopsMarketGrowthSkills: boolean;
  roleImproveOperationalRevenueRatio: boolean;
  trajectoryAssessment: string;
  typicalNextRoleAfterThis?: string | null;
  nextRoleAlignedWithGoal: boolean;

  // Exit optionality
  roleIncreasesMarketability: boolean;
  roleNarrowsOrBroadensProfile: "narrows" | "broadens" | "neutral";
  exitOptionalityAssessment: string;

  // Culture and environment
  promotesFromWithin?: boolean | null;
  managerTransitionRisk?: string | null;
  averageTenureAtLevel?: string | null;
  ceilingRiskAssessment?: string | null;

  // Sponsorship
  knownAdvocatesAtOrganization: number;
  sponsorshipStartingPoint: "zero" | "weak" | "moderate" | "strong";

  // Financial anchors at current role
  financialAnchorsForfeited: FinancialAnchor[];
  totalAnchorsForfeited: number;
  breakEvenTimelineMonths?: number | null;

  // Overall assessment
  overallRecommendation: "strong_accept" | "accept" | "negotiate_first" | "decline" | "needs_more_information";
  recommendationRationale: string;
  questionsToAskBeforeDeciding: string[];
  negotiationLeverage: string[];
  counterOfferConsiderations?: string | null;

  notes?: string | null;
}

export interface CareerPivotEvaluation {
  id: UUID;
  userId: UUID;
  evaluatedAt: ISODateString;
  targetField: string;
  targetFunction: ProfessionalFunction;
  targetIndustry: IndustryVertical;
  motivationDescription: string;

  // Entry barriers
  typicalCredentialsRequired: string[];
  credentialsUserHas: string[];
  credentialGap: string[];
  typicalExperienceRequired: string;
  transferableExperience: string;
  experienceGap: string;
  realisticEntryLevel: string;
  realisticEntryCompensation?: number | null;
  compensationDeltaFromCurrent?: number | null;

  // Transferability
  highlyTransferableSkills: string[];
  partiallyTransferableSkills: string[];
  skillsToRebuild: string[];
  visibleRecordTransferabilityScore: number;
  transferabilityNarrative: string;

  // Demand trajectory
  fieldGrowthTrajectory: "rapidly_growing" | "growing" | "stable" | "declining" | "disrupted";
  aiAutomationRiskInField: "high" | "medium" | "low";
  demandOutlook2030: string;

  // Network
  existingNetworkInField: number;
  networkBridgeOpportunities: string[];
  communityAccessPoints: string[];

  // Timeline
  realisticTransitionTimeline: string;
  phasedApproach: PivotPhase[];

  // Overall
  overallFeasibilityScore: number;
  overallFeasibilityNarrative: string;
  recommendedFirstStep: string;

  notes?: string | null;
}

export interface PivotPhase {
  phase: number;
  title: string;
  duration: string;
  keyActions: string[];
  targetOutcome: string;
}

export interface StayOrLeaveAssessment {
  id: UUID;
  userId: UUID;
  assessedAt: ISODateString;
  triggerEvent?: string | null;
  departureSignalScore: DepartureSignalScore;
  financialRunwayIfLeftToday?: number | null;
  financialRunwayMonths?: number | null;
  goldenCuffsBreakdown: GoldenCuffsBreakdown;
  externalMarketStrength: "strong" | "moderate" | "developing" | "weak";
  externalMarketNarrative: string;
  stayConditions: string[];
  leaveConditions: string[];
  stayConditionsMetBy: ISODateString | null;
  recommendedDecisionFramework: string;
  emotionalFactorsAcknowledged: string[];
  rationalFactorsSummary: string;
  overallAssessment: string;
  revisitDate?: ISODateString | null;
}

export interface CounterOfferEvaluation {
  id: UUID;
  userId: UUID;
  evaluatedAt: ISODateString;
  originalDepartureReasons: string[];
  counterOfferAmount?: number | null;
  counterOfferOtherTerms?: string | null;
  doesCounterAddressRealReasons: boolean;
  reasonsAddressed: string[];
  reasonsNotAddressed: string[];
  structuralChangeMade: boolean;
  structuralChangeDescription?: string | null;
  historicalPatternOfCounterOffers?: string | null;
  typicalOutcomeAfterAcceptance: string;
  recommendation: "accept" | "decline" | "negotiate_further";
  recommendationRationale: string;
  notes?: string | null;
}


// ============================================================
// WORKPLACE POLICY COST CALCULATOR
// ============================================================

export interface WorkplacePolicyCostAnalysis {
  id: UUID;
  userId: UUID;
  policyDescription: string;
  analyzedAt: ISODateString;
  annualCommuteCost?: number | null;
  annualCommuteHours?: number | null;
  commuteHoursMonetized?: number | null;
  flexibilityPremiumForfeited?: number | null;
  professionalDevelopmentTimeImpact?: number | null;
  mentalHealthCostEstimate?: number | null;
  totalAnnualPolicyCost: number;
  compensationEquivalentRequired: number;
  currentCompensationAccommodates: boolean;
  negotiationArgument: string;
  notes?: string | null;
}


// ============================================================
// REPORTS & OUTPUTS
// ============================================================

export type ReportType =
  | "weekly_standup"
  | "monthly_summary"
  | "quarterly_impact"
  | "annual_review_preparation"
  | "promotion_support"
  | "compensation_review"
  | "departure_readiness"
  | "offer_evaluation_summary"
  | "linkedin_update"
  | "new_manager_introduction";

export interface ReportConfiguration {
  reportType: ReportType;
  primaryAudience: "self" | "direct_manager" | "skip_level" | "hr" | "compensation_committee" | "external_recruiter" | "new_manager";
  frameworkCriteria?: string | null;
  periodCovered: DateRange;
  topContributionCount: number;
  includeQuantifiedOutcomes: boolean;
  includeEvidenceIndex: boolean;
  includeSkillsSection: boolean;
  includeScopeSignals: boolean;
  includePromotionNarrative: boolean;
  toneRegister: "factual" | "confident" | "executive" | "conversational";
  maxPages?: number | null;
}

export interface GeneratedReport {
  id: UUID;
  userId: UUID;
  reportType: ReportType;
  configuration: ReportConfiguration;
  generatedAt: ISODateString;
  periodCovered: DateRange;

  // Content
  executiveSummaryParagraph: string;
  snapshotMetrics: SnapshotMetric[];
  topContributions: ContributionBlock[];
  contributionThemes: ContributionTheme[];
  quantifiedOutcomes: QuantifiedOutcomeBlock[];
  evidenceIndex: EvidenceIndexItem[];
  skillsAppliedAndDeveloped: SkillsBlock[];
  scopeSignals: string[];
  promotionNarrative?: string | null;
  promotionNarrativeApprovedByUser: boolean;
  conversationGuide?: ConversationGuide | null;

  // Verification
  allMetricsTraceable: boolean;
  unverifiedMetricsCount: number;
  userReviewedAt?: ISODateString | null;
  userApproved: boolean;

  // Export
  exportedAt?: ISODateString | null;
  exportFormat?: "pdf" | "docx" | "markdown" | "plain_text" | null;

  notes?: string | null;
}

export interface SnapshotMetric {
  label: string;
  value: string | number;
  isVerified: boolean;
  sourceEntryIds: UUID[];
}

export interface ContributionBlock {
  entryId: UUID;
  title: string;
  businessValueCategory: BusinessValueCategory;
  situation: string;
  actionTaken: string;
  impact: string;
  evidence: string[];
  skillsDemonstrated: string[];
  whyItMatters: string;
  isVerified: boolean;
  scopeSignal?: string | null;
}

export interface ContributionTheme {
  themeName: string;
  themeSummary: string;
  entryIds: UUID[];
  businessValueCategories: BusinessValueCategory[];
}

export interface QuantifiedOutcomeBlock {
  description: string;
  value: string;
  confidenceLevel: ConfidenceLevel;
  sourceEntryId: UUID;
  isDirectlyMeasured: boolean;
}

export interface EvidenceIndexItem {
  evidenceId: string;
  title: string;
  type: string;
  linkedContributionTitle: string;
  isExternallyValidated: boolean;
  validatedBy?: string | null;
}

export interface SkillsBlock {
  skillName: string;
  category: SkillCategory;
  appliedIn: string[];
  developedThisPeriod: boolean;
  marketDemandTrajectory: SkillDemandTrajectory;
  businessOutcomeFromSkill?: string | null;
}

export interface ConversationGuide {
  topThreePointsToLead: string[];
  audienceSpecificFraming: string;
  questionsToExpect: string[];
  questionsToAsk: string[];
  numberToDefendOnSpot: string;
  whatNotToLead: string[];
  closingStatement: string;
}


// ============================================================
// UNWRITTEN RULES & INSIGHT LAYER
// ============================================================

export type InsightCategory =
  | "compensation_reality"
  | "organizational_dynamic"
  | "career_pattern"
  | "market_intelligence"
  | "blind_spot"
  | "sponsorship_signal"
  | "ceiling_pattern"
  | "skill_trajectory"
  | "visibility_gap"
  | "timing_intelligence";

export type InsightUrgency =
  | "immediate_action"
  | "address_this_quarter"
  | "monitor"
  | "awareness_only";

export interface VisibleInsight {
  id: UUID;
  userId: UUID;
  category: InsightCategory;
  urgency: InsightUrgency;
  triggerCondition: string;
  insightHeadline: string;
  insightDetail: string;
  whatThisTypicallyMeans: string;
  recommendedAction: string;
  linkedEntryIds: UUID[];
  linkedGoalIds: UUID[];
  surfacedAt: ISODateString;
  dismissedAt?: ISODateString | null;
  actionTakenAt?: ISODateString | null;
  actionDescription?: string | null;
  isRecurring: boolean;
  recurrenceIntervalDays?: number | null;
}


// ============================================================
// LINKEDIN & EXTERNAL PRESENCE
// ============================================================

export interface LinkedInUpdateDraft {
  id: UUID;
  userId: UUID;
  sourceEntryId?: UUID | null;
  draftType: "post" | "profile_headline" | "profile_about" | "experience_update" | "skill_endorsement_prompt";
  draftContent: string;
  keyMessage: string;
  audienceIntent: string;
  generatedAt: ISODateString;
  editedByUser: boolean;
  publishedAt?: ISODateString | null;
  performanceNotes?: string | null;
}


// ============================================================
// MANAGER RELATIONSHIP INTELLIGENCE
// ============================================================
// Based on direct manager feedback: the behaviors that
// determine whether someone advances or gets managed out
// are rarely documented, rarely taught, and almost never
// visible to the employee until the consequences arrive.
//
// This layer makes those behaviors a first-class product
// feature — not buried in a self-assessment, not surfaced
// only at review time, but tracked continuously so the
// user can see themselves clearly before the manager has
// to say something uncomfortable.
//
// The Andy Sachs problem: everyone is the hero of their
// own story. Visible is the mirror that shows you how you
// actually land on the person who determines your future.
// ============================================================

export type ManagerCommunicationStyle =
  | "brief_and_direct"
  | "context_first_then_ask"
  | "written_updates_preferred"
  | "verbal_preferred"
  | "data_driven"
  | "relationship_first"
  | "structured_agendas"
  | "informal_and_flexible"
  | "unknown";

export type ManagerPriorityFocus =
  | "revenue_and_growth"
  | "risk_and_compliance"
  | "operational_efficiency"
  | "team_development"
  | "stakeholder_relationships"
  | "strategic_positioning"
  | "execution_and_delivery"
  | "unknown";

export type ManagerTimeValue =
  | "highly_protective_of_time"
  | "accessible_and_open"
  | "context_dependent"
  | "unknown";

export interface ManagerProfile {
  id: UUID;
  userId: UUID;
  managerTitle?: string | null;
  managerLevel: StakeholderLevel;
  organizationContext: "current" | "former";
  isActive: boolean;

  // Communication preferences
  // "Ask your manager what communication style they prefer"
  // — direct manager feedback that most employees never act on
  preferredCommunicationStyle: ManagerCommunicationStyle;
  preferredUpdateFrequency: "daily" | "weekly" | "milestone_based" | "as_needed" | "unknown";
  preferredUpdateFormat: "verbal_standup" | "written_summary" | "dashboard" | "email" | "slack_or_teams" | "unknown";
  bestTimeForNonUrgentQuestions?: string | null;
  communicationPreferenceNotes?: string | null;

  // What they value and notice
  // "Managers like to feel good — if you require more of their
  // time consistently than others, that is a cost they feel"
  priorityFocus: ManagerPriorityFocus;
  whatTheyConsistentlyPraise: string[];
  whatFrustratesThem: string[];
  whatTheyConsiderGoodUseOfMeetingTime: string;
  whatTheyConsiderWastedMeetingTime: string;
  timeValueOrientation: ManagerTimeValue;

  // Discovery preference
  // "The employee who gets work done and the manager
  // discovers it a week later — that manager feels great"
  prefersToDiscoverWorkOrBeReported: "discover" | "reported" | "mixed" | "unknown";
  discoveryPreferenceNotes?: string | null;

  // Outside communication
  // "Ask before communicating outside the team on
  // something new — not ongoing collaboration"
  requiresApprovalBeforeExternalComms: boolean;
  externalCommsGuidanceNotes?: string | null;

  // Training and knowledge transfer expectations
  // "More important to document and have a backup
  // for when you are on vacation"
  expectsDocumentationAndBackup: boolean;
  expectsReplacementTraining: boolean;
  knowledgeTransferExpectations?: string | null;

  // Relationship health
  relationshipHealthStatus: RelationshipHealthStatus;
  lastMeaningfulConversationAt?: ISODateString | null;
  userConfidenceInRelationship: 1 | 2 | 3 | 4 | 5;
  managerKnowsUserCareerGoals: boolean;
  managerHasGivenClearAdvancementCriteria: boolean;
  advancementCriteriaDetails?: string | null;

  createdAt: ISODateString;
  updatedAt: ISODateString;
  notes?: string | null;
}


// ============================================================
// BEHAVIORAL DEVELOPMENT LAYER
// ============================================================
// The mirror most people never have.
//
// These are the behaviors your manager notices, evaluates,
// and uses to make advancement decisions — often without
// ever saying so directly. Visible tracks them continuously
// so patterns become visible before consequences arrive.
//
// Core behavioral signals from direct manager feedback:
// 1. Initiative — solving before asking
// 2. Judgment — protecting manager time
// 3. Listening — full reception not partial
// 4. Reliability — estimates, deadlines, quality
// 5. Learning — technology and skill currency
// 6. Discovery vs reporting — how outcomes surface
// 7. Communication discipline — timing and permission
// 8. Documentation — backup and continuity
// 9. Project completion — full arc not just tasks
// 10. Purpose vs presence — output not face time
// ============================================================

export type BehavioralSignal =
  | "initiative"
  | "judgment"
  | "listening"
  | "deadline_reliability"
  | "estimate_willingness"
  | "work_quality_checking"
  | "technology_adaptability"
  | "manager_time_efficiency"
  | "communication_discipline"
  | "documentation_and_backup"
  | "project_completion"
  | "purpose_over_presence"
  | "discovery_versus_reporting"
  | "solution_before_escalation";

export type BehavioralRating =
  | "consistently_strong"
  | "improving"
  | "inconsistent"
  | "needs_development"
  | "not_yet_assessed";

export type DiscoveryPattern =
  | "scheduled_meeting"       // Reported in a scheduled touchpoint
  | "proactive_update"        // User sent update before being asked
  | "natural_discovery"       // Manager discovered it independently
  | "manager_asked"           // Manager had to ask what was happening
  | "not_yet_surfaced";       // Manager does not know yet

export interface BehavioralCheckIn {
  id: UUID;
  userId: UUID;
  managerId: UUID;
  checkedInAt: ISODateString;
  periodCovered: DateRange;

  // The five core weekly questions
  // Each one maps directly to a behavioral signal managers evaluate

  // "Not showing initiative — think about how you would solve
  // the problem before saying you're stuck"
  cameWithSolutionsNotJustProblems: boolean | null;
  initiativeExample?: string | null;

  // "Awareness of limited time managers have — unproductive
  // meetings cause unnecessary stress"
  usedManagerTimeWell: boolean | null;
  managerTimeNotes?: string | null;

  // "Not willing to estimate a deadline /
  //  not being able to meet a deadline"
  committedToDeadlineThisPeriod: boolean | null;
  metDeadlineThisPeriod: boolean | null;
  deadlineNotes?: string | null;

  // "Quality of work — minimizing errors, checking work"
  checkedWorkBeforeSubmitting: boolean | null;
  qualityNotes?: string | null;

  // "Unwillingness to learn new technologies"
  engagedWithNewTechnologyOrSkill: boolean | null;
  learningNotes?: string | null;

  // "Prioritizing face time over purpose"
  timePurposefulNotPerformative: boolean | null;
  presenceNotes?: string | null;

  // "Not important to train replacement /
  //  more important to document and have a backup"
  documentedSomethingOnlyYouKnew: boolean | null;
  documentationNotes?: string | null;

  // "Being able to bring a large project through to completion"
  madeProgressOnLongestRunningProject: boolean | null;
  projectCompletionNotes?: string | null;

  // Discovery pattern for this period
  // "You want to be the employee the manager feels great
  // about discovering a week later"
  howManagerLearnedOfWork: DiscoveryPattern;
  discoveryContext?: string | null;

  // "Ask before communicating outside the team
  // on something new"
  askedBeforeNewExternalComm: boolean | null;
  externalCommNotes?: string | null;

  // Overall self-honest rating this period
  overallHonestyRating: 1 | 2 | 3 | 4 | 5;
  biggestBlindSpotThisPeriod?: string | null;
  oneThingToImproveNextPeriod?: string | null;

  createdAt: ISODateString;
}

export interface BehavioralPattern {
  userId: UUID;
  managerId: UUID;
  calculatedAt: ISODateString;
  periodCovered: DateRange;
  checkInsAnalyzed: number;

  // Signal-level pattern analysis
  signalRatings: BehavioralSignalRating[];

  // The Andy Sachs mirror
  // Are you the hero of your own story or do you see
  // yourself accurately?
  heroOfOwnStoryRisk: "low" | "moderate" | "high";
  heroOfOwnStoryIndicators: string[];

  // Discovery pattern analysis
  // What percentage of significant work surfaces how?
  discoveryPatternBreakdown: DiscoveryPatternBreakdown;
  isDiscoveryPatternOptimal: boolean;
  discoveryPatternInsight: string;

  // Manager time consumption analysis
  managerTimeConsumptionLevel: "below_peer_average" | "at_peer_average" | "above_peer_average" | "unknown";
  managerTimeTrend: "improving" | "stable" | "worsening" | "insufficient_data";
  managerTimeInsight: string;

  // Initiative vs reactivity ratio
  initiativeRatio: number;
  initiativeTrend: "improving" | "stable" | "worsening" | "insufficient_data";
  initiativeInsight: string;

  // Overall behavioral readiness signal
  overallBehavioralReadiness: "ready_for_next_level" | "approaching_readiness" | "development_needed" | "significant_gaps";
  overallBehavioralNarrative: string;

  // Specific patterns that match manager feedback
  solutionBeforeEscalationRate: number;
  deadlineReliabilityRate: number;
  qualityCheckRate: number;
  documentationConsistency: number;

  // Actionable next step
  topPriorityBehavioralChange: string;
  topPriorityRationale: string;
  suggestedAction: string;
  suggestedTimeline: string;
}

export interface BehavioralSignalRating {
  signal: BehavioralSignal;
  rating: BehavioralRating;
  trend: "improving" | "stable" | "worsening" | "insufficient_data";
  evidenceFromCheckIns: string;
  managersLikelyPerception: string;
  impactOnAdvancement: "high" | "medium" | "low";
  specificFeedback: string;
  developmentAction?: string | null;
}

export interface DiscoveryPatternBreakdown {
  scheduledMeetingPercentage: number;
  proactiveUpdatePercentage: number;
  naturalDiscoveryPercentage: number;
  managerAskedPercentage: number;
  notYetSurfacedPercentage: number;
  optimalTargetNaturalDiscovery: number;
  gapFromOptimal: number;
  insight: string;
}

export interface ManagerTimeLog {
  id: UUID;
  userId: UUID;
  managerId: UUID;
  interactionDate: ISODateString;
  interactionType: "scheduled_1on1" | "ad_hoc_question" | "problem_escalation" | "status_update" | "approval_request" | "social" | "other";
  durationMinutes: number;
  userInitiated: boolean;
  hadSolutionBeforeAsking: boolean | null;
  wasNecessary: boolean | null;
  managerReactionObserved?: "positive" | "neutral" | "seemed_frustrated" | "unknown" | null;
  notes?: string | null;
  createdAt: ISODateString;
}

export interface BehavioralOnboarding {
  userId: UUID;
  completedAt: ISODateString;

  // Self-diagnosis questions
  // These surface the blind spots before check-ins begin
  // so the user enters the system with honest self-awareness
  // rather than optimistic self-assessment

  howOftenBringProblemsWithoutSolutions: "rarely" | "sometimes" | "often" | "unsure";
  howOftenMissDeadlines: "rarely" | "sometimes" | "often" | "unsure";
  howOftenCheckWorkBeforeSubmitting: "always" | "usually" | "sometimes" | "rarely" | "unsure";
  howOftenManagerDiscoverWorkVsReport: "they_usually_discover" | "i_usually_report" | "mixed" | "unsure";
  howMuchManagerTimeConsumed: "less_than_peers" | "similar_to_peers" | "more_than_peers" | "unsure";
  howCurrentOnNewTechnology: "very_current" | "somewhat_current" | "behind" | "significantly_behind" | "unsure";
  howOftenDocumentWork: "consistently" | "sometimes" | "rarely" | "never" | "unsure";
  hasBackupForVacation: boolean | null;
  askedManagerCommunicationPreference: boolean;
  knowsManagerTopPriority: boolean;

  // Initial blind spot assessment
  // "Everyone thinks they are the hero of their own
  // soap opera" — what does the data already suggest?
  initialBlindSpotFlags: string[];
  initialStrengthSignals: string[];
  firstPriorityDevelopmentArea: BehavioralSignal | null;
  onboardingInsight: string;
}


// ============================================================
// APPLICATION STATE
// ============================================================

export interface VisibleAppState {
  user: UserProfile;
  compensationHistory: CompensationHistory;
  workEntries: WorkEntry[];
  promotionGoals: PromotionGoal[];
  quarterlyPlans: QuarterlyPlan[];
  annualStrategicPlans: AnnualStrategicPlan[];
  performanceReviews: PerformanceReview[];
  promotionalReadinessAssessments: PromotionalReadinessAssessment[];
  relationships: RelationshipRecord[];
  sponsorshipProfile: SponsorshipProfile;
  mentorRecords: MentorRecord[];
  skills: Skill[];
  skillGapAnalysis: SkillGapAnalysis | null;
  automationOpportunityMap: AutomationOpportunityMap | null;
  operationalRevenueRatio: OperationalRevenueRatio | null;
  departureSignalScore: DepartureSignalScore | null;
  generatedReports: GeneratedReport[];
  activeInsights: VisibleInsight[];
  linkedInDrafts: LinkedInUpdateDraft[];
  jobOfferEvaluations: JobOfferEvaluation[];
  careerPivotEvaluations: CareerPivotEvaluation[];
  stayOrLeaveAssessments: StayOrLeaveAssessment[];
  workplacePolicyCostAnalyses: WorkplacePolicyCostAnalysis[];
  marketSalaryRanges: MarketSalaryRange[];

  // Manager Relationship Intelligence
  // First class feature — not buried in settings
  // Captured in onboarding before contribution capture begins
  managerProfiles: ManagerProfile[];
  activeManagerProfile: ManagerProfile | null;

  // Behavioral Development Layer
  // The mirror most people never have
  // Tracks the behaviors managers actually evaluate
  // Surfaces patterns before consequences arrive
  behavioralOnboarding: BehavioralOnboarding | null;
  behavioralCheckIns: BehavioralCheckIn[];
  behavioralPattern: BehavioralPattern | null;
  managerTimeLogs: ManagerTimeLog[];

  isLoading: boolean;
  error: string | null;
  lastSyncedAt: ISODateString | null;
}
