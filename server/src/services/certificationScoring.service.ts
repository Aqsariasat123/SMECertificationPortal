/**
 * Naywa SME Capital-Readiness Certification Scoring Engine
 * Version: 1.2
 *
 * This implements the deterministic state machine for certification decisions
 * as specified in the Naywa Certification Decision Logic V1.2
 *
 * IMPORTANT: This logic is mandatory, non-negotiable, and override-safe.
 */

import { PrismaClient, CriterionRating, PillarStatus, CertificationOutcome, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

// ============================================
// PILLAR DEFINITIONS
// ============================================

export interface SubCriterion {
  code: string;
  name: string;
  weight: number; // Decimal weight (e.g., 0.25 for 25%)
  description: string;
  mandatoryEvidence: string[];
  isAutoFailCriterion?: boolean; // If RED triggers auto-fail
  autoFailCondition?: string; // Description of auto-fail condition
}

export interface PillarDefinition {
  pillarNumber: number;
  name: string;
  weight: number; // Decimal weight (e.g., 0.25 for 25%)
  description: string;
  subCriteria: SubCriterion[];
  passThreshold: number;
  conditionalThreshold: number;
  autoFailRules: AutoFailRule[];
}

export interface AutoFailRule {
  code: string;
  description: string;
  check: (scores: SubCriterionScore[]) => boolean;
}

export interface SubCriterionScore {
  code: string;
  name: string;
  weight: number;
  rating: CriterionRating;
  notes?: string;
}

// ============================================
// PILLAR 1: Legal & Ownership Readiness (25%)
// ============================================
const PILLAR_1: PillarDefinition = {
  pillarNumber: 1,
  name: 'Legal & Ownership Readiness',
  weight: 0.25,
  description: 'Confirms the SME legally exists, ownership is transparent, and representatives have explicit authority to bind the entity financially.',
  passThreshold: 2.50,
  conditionalThreshold: 2.00,
  subCriteria: [
    {
      code: '1.1',
      name: 'Legal Existence (Trade License Validity)',
      weight: 0.25,
      description: 'Verify trade license validity and jurisdiction',
      mandatoryEvidence: ['Valid trade license', 'Emirates ID for sole establishments'],
      isAutoFailCriterion: true,
      autoFailCondition: 'RED in Legal Existence triggers AUTO FAIL'
    },
    {
      code: '1.2',
      name: 'UBO Transparency',
      weight: 0.20,
      description: 'Full UBO disclosure and consistency',
      mandatoryEvidence: ['MOA/AOA', 'Shareholder register', 'UBO declaration'],
      isAutoFailCriterion: true,
      autoFailCondition: 'RED in UBO Transparency triggers AUTO FAIL'
    },
    {
      code: '1.3',
      name: 'Shareholding Clarity',
      weight: 0.15,
      description: 'Cross-check ownership across documents',
      mandatoryEvidence: ['MOA/AOA', 'Shareholder register'],
      isAutoFailCriterion: false
    },
    {
      code: '1.4',
      name: 'Authority & Borrowing Powers',
      weight: 0.25,
      description: 'Verify explicit borrowing and banking authority',
      mandatoryEvidence: ['POA or board resolution', 'Bank mandate'],
      isAutoFailCriterion: true,
      autoFailCondition: 'RED in Authority triggers AUTO FAIL; AMBER results in CONDITIONAL (non-compensable)'
    },
    {
      code: '1.5',
      name: 'MOA/AOA Integrity',
      weight: 0.10,
      description: 'Confirm MOA/AOA completeness and currency',
      mandatoryEvidence: ['MOA', 'AOA (where applicable)'],
      isAutoFailCriterion: false
    },
    {
      code: '1.6',
      name: 'Jurisdictional Alignment',
      weight: 0.05,
      description: 'Legal structure aligns with operations',
      mandatoryEvidence: ['Trade license', 'Operating documents'],
      isAutoFailCriterion: false
    }
  ],
  autoFailRules: [
    {
      code: 'P1_AF1',
      description: 'RED in Legal Existence (1.1)',
      check: (scores) => scores.find(s => s.code === '1.1')?.rating === 'red'
    },
    {
      code: 'P1_AF2',
      description: 'RED in UBO Transparency (1.2)',
      check: (scores) => scores.find(s => s.code === '1.2')?.rating === 'red'
    },
    {
      code: 'P1_AF3',
      description: 'RED in Authority & Borrowing Powers (1.4)',
      check: (scores) => scores.find(s => s.code === '1.4')?.rating === 'red'
    },
    {
      code: 'P1_AF4',
      description: '3 or more RED ratings',
      check: (scores) => scores.filter(s => s.rating === 'red').length >= 3
    }
  ]
};

// ============================================
// PILLAR 2: Financial Discipline (25%)
// ============================================
const PILLAR_2: PillarDefinition = {
  pillarNumber: 2,
  name: 'Financial Discipline',
  weight: 0.25,
  description: 'Confirms the SME\'s financial behaviour is consistent, transparent, and institution-processable.',
  passThreshold: 2.50,
  conditionalThreshold: 2.00,
  subCriteria: [
    {
      code: '2.1',
      name: 'Bank Statement Consistency',
      weight: 0.25,
      description: 'Verify continuity of bank statements (12 months standard; 6 months minimum for entities <18 months old)',
      mandatoryEvidence: ['Bank statements (12 months or 6 months for new entities)'],
      isAutoFailCriterion: true,
      autoFailCondition: 'RED triggers AUTO FAIL'
    },
    {
      code: '2.2',
      name: 'WPS Payroll Regularity',
      weight: 0.20,
      description: 'Confirm WPS payroll compliance (if employees exist)',
      mandatoryEvidence: ['WPS payroll records'],
      isAutoFailCriterion: true,
      autoFailCondition: 'RED triggers AUTO FAIL (if employees exist)'
    },
    {
      code: '2.3',
      name: 'Revenue Traceability',
      weight: 0.20,
      description: 'Attribute revenue inflows to legitimate sources',
      mandatoryEvidence: ['Bank statements', 'Revenue source declaration', 'Invoices'],
      isAutoFailCriterion: true,
      autoFailCondition: 'RED triggers AUTO FAIL'
    },
    {
      code: '2.4',
      name: 'Revenue Concentration Risk',
      weight: 0.10,
      description: 'Measure revenue concentration risk',
      mandatoryEvidence: ['Revenue breakdown', 'Client list'],
      isAutoFailCriterion: false
    },
    {
      code: '2.5',
      name: 'Expense Discipline',
      weight: 0.10,
      description: 'Assess expense discipline and appropriateness',
      mandatoryEvidence: ['Bank statements', 'Expense records'],
      isAutoFailCriterion: false
    },
    {
      code: '2.6',
      name: 'Cash Buffer Behaviour',
      weight: 0.15,
      description: 'Evaluate cash buffer behaviour',
      mandatoryEvidence: ['Bank statements'],
      isAutoFailCriterion: false
    }
  ],
  autoFailRules: [
    {
      code: 'P2_AF1',
      description: 'RED in Bank Statement Consistency (2.1)',
      check: (scores) => scores.find(s => s.code === '2.1')?.rating === 'red'
    },
    {
      code: 'P2_AF2',
      description: 'RED in WPS Payroll Regularity (2.2)',
      check: (scores) => scores.find(s => s.code === '2.2')?.rating === 'red'
    },
    {
      code: 'P2_AF3',
      description: 'RED in Revenue Traceability (2.3)',
      check: (scores) => scores.find(s => s.code === '2.3')?.rating === 'red'
    },
    {
      code: 'P2_AF4',
      description: '3 or more RED ratings',
      check: (scores) => scores.filter(s => s.rating === 'red').length >= 3
    }
  ]
};

// ============================================
// PILLAR 3: Business Model & Unit Economics (20%)
// ============================================
const PILLAR_3: PillarDefinition = {
  pillarNumber: 3,
  name: 'Business Model & Unit Economics',
  weight: 0.20,
  description: 'Confirms the SME\'s core transaction creates economic value on a per-unit basis.',
  passThreshold: 2.50,
  conditionalThreshold: 2.00,
  subCriteria: [
    {
      code: '3.1',
      name: 'Gross Margin Integrity',
      weight: 0.25,
      description: 'Calculate gross profit and gross margin',
      mandatoryEvidence: ['P&L statements', 'Unit economics worksheet'],
      isAutoFailCriterion: true,
      autoFailCondition: 'RED in Gross Margin AND RED in Working Capital (3.3) triggers AUTO FAIL (Death Spiral Rule)'
    },
    {
      code: '3.2',
      name: 'Revenue Model Predictability',
      weight: 0.20,
      description: 'Assess revenue model predictability',
      mandatoryEvidence: ['Revenue breakdown', 'Client contracts'],
      isAutoFailCriterion: false
    },
    {
      code: '3.3',
      name: 'Working Capital Cycle',
      weight: 0.30,
      description: 'Measure working capital cash gap',
      mandatoryEvidence: ['AR aging reports', 'AP aging reports', 'Bank statements'],
      isAutoFailCriterion: true,
      autoFailCondition: 'RED in Working Capital AND RED in Gross Margin (3.1) triggers AUTO FAIL (Death Spiral Rule)'
    },
    {
      code: '3.4',
      name: 'Cost Structure Rationality',
      weight: 0.10,
      description: 'Stress-test cost structure resilience',
      mandatoryEvidence: ['P&L statements', 'Cost breakdown'],
      isAutoFailCriterion: false
    },
    {
      code: '3.5',
      name: 'Breakeven Proximity',
      weight: 0.15,
      description: 'Evaluate breakeven proximity',
      mandatoryEvidence: ['P&L statements', 'Financial projections'],
      isAutoFailCriterion: false
    }
  ],
  autoFailRules: [
    {
      code: 'P3_AF1',
      description: 'Death Spiral Rule: RED in Gross Margin (3.1) AND RED in Working Capital (3.3)',
      check: (scores) => {
        const grossMargin = scores.find(s => s.code === '3.1');
        const workingCapital = scores.find(s => s.code === '3.3');
        return grossMargin?.rating === 'red' && workingCapital?.rating === 'red';
      }
    }
  ]
};

// ============================================
// PILLAR 4: Governance, Controls & Risk Discipline (20%)
// ============================================
const PILLAR_4: PillarDefinition = {
  pillarNumber: 4,
  name: 'Governance, Controls & Risk Discipline',
  weight: 0.20,
  description: 'Ensures external capital can enter the SME without misuse, loss, or operational collapse.',
  passThreshold: 2.50,
  conditionalThreshold: 2.00,
  subCriteria: [
    {
      code: '4.1',
      name: 'Decision Authority',
      weight: 0.15,
      description: 'Confirm decision authority clarity',
      mandatoryEvidence: ['Board resolution', 'Organizational chart'],
      isAutoFailCriterion: false
    },
    {
      code: '4.2',
      name: 'Financial Controls',
      weight: 0.30,
      description: 'Verify maker-checker financial controls (or single signatory with independent monthly reconciliation for sole traders)',
      mandatoryEvidence: ['Bank mandate', 'Payment approval workflow', 'External accountant confirmation'],
      isAutoFailCriterion: true,
      autoFailCondition: 'RED in Financial Controls triggers AUTO FAIL (non-overrideable)'
    },
    {
      code: '4.3',
      name: 'Risk & Insurance',
      weight: 0.20,
      description: 'Validate insurance coverage',
      mandatoryEvidence: ['Insurance policies'],
      isAutoFailCriterion: false
    },
    {
      code: '4.4',
      name: 'Transparency & Reporting',
      weight: 0.15,
      description: 'Review reporting cadence',
      mandatoryEvidence: ['Financial reports', 'Management accounts'],
      isAutoFailCriterion: false
    },
    {
      code: '4.5',
      name: 'Key Person Risk',
      weight: 0.20,
      description: 'Confirm key-person continuity planning',
      mandatoryEvidence: ['Business continuity plan', 'POA documentation'],
      isAutoFailCriterion: false
    }
  ],
  autoFailRules: [
    {
      code: 'P4_AF1',
      description: 'RED in Financial Controls (4.2) - Non-overrideable',
      check: (scores) => scores.find(s => s.code === '4.2')?.rating === 'red'
    }
  ]
};

// ============================================
// PILLAR 5: Data Integrity, Auditability & Information Reliability (15%)
// ============================================
const PILLAR_5: PillarDefinition = {
  pillarNumber: 5,
  name: 'Data Integrity, Auditability & Information Reliability',
  weight: 0.15,
  description: 'Confirms all information is reliable, current, and auditable without re-verification. Pillar 5 outcomes take precedence over all other pillars.',
  passThreshold: 2.50,
  conditionalThreshold: 2.00,
  subCriteria: [
    {
      code: '5.1',
      name: 'Cross-Source Data Consistency (VAT-Anchored)',
      weight: 0.40,
      description: 'Reconcile revenue using VAT Returns, Bank Inflows, and P&L/Management Accounts',
      mandatoryEvidence: ['Bank statements', 'Management accounts', 'VAT returns (if VAT-registered)', 'WPS summaries'],
      isAutoFailCriterion: true,
      autoFailCondition: 'RED triggers GLOBAL FAIL - entire certification fails regardless of other pillars'
    },
    {
      code: '5.2',
      name: 'Traceability & Evidence Lineage',
      weight: 0.25,
      description: 'Trace summary figures to source documents',
      mandatoryEvidence: ['Mapping from summary figures to raw evidence', 'Sample transaction drill-downs'],
      isAutoFailCriterion: false
    },
    {
      code: '5.3',
      name: 'Documentation Completeness & Hygiene',
      weight: 0.05,
      description: 'Verify documents are complete, legible, organized, and usable',
      mandatoryEvidence: ['Full document set as required under Pillars 1-4', 'Clear file labeling'],
      isAutoFailCriterion: false
    },
    {
      code: '5.4',
      name: 'Transparency Protocol',
      weight: 0.15,
      description: 'Evaluate structured transparency process when discrepancies exist',
      mandatoryEvidence: ['Notes to Accounts', 'Variance analysis', 'Written disclosure notes'],
      isAutoFailCriterion: false
    },
    {
      code: '5.5',
      name: 'Information Currency & Timeliness',
      weight: 0.15,
      description: 'Verify information is recent enough for current decision-making',
      mandatoryEvidence: ['Dates on financial statements, bank statements, and filings'],
      isAutoFailCriterion: false
    }
  ],
  autoFailRules: [
    {
      code: 'P5_AF1',
      description: 'RED in Cross-Source Data Consistency (5.1) - GLOBAL KILL SWITCH',
      check: (scores) => scores.find(s => s.code === '5.1')?.rating === 'red'
    }
  ]
};

// All pillars
export const ALL_PILLARS: PillarDefinition[] = [PILLAR_1, PILLAR_2, PILLAR_3, PILLAR_4, PILLAR_5];

// ============================================
// SCORING FUNCTIONS
// ============================================

/**
 * Convert rating to numeric score
 */
export function ratingToScore(rating: CriterionRating): number {
  switch (rating) {
    case 'green': return 3;
    case 'amber': return 2;
    case 'red': return 1;
    case 'not_rated': return 0;
    default: return 0;
  }
}

/**
 * Calculate weighted score for a pillar based on sub-criteria scores
 */
export function calculatePillarScore(scores: SubCriterionScore[]): number {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const score of scores) {
    if (score.rating !== 'not_rated') {
      totalWeightedScore += ratingToScore(score.rating) * score.weight;
      totalWeight += score.weight;
    }
  }

  if (totalWeight === 0) return 0;
  return Number((totalWeightedScore / totalWeight).toFixed(2));
}

/**
 * Check auto-fail conditions for a pillar
 */
export function checkAutoFail(pillar: PillarDefinition, scores: SubCriterionScore[]): { triggered: boolean; reason: string | null; criteria: string[] } {
  const triggeredRules: string[] = [];
  const triggeredCriteria: string[] = [];

  for (const rule of pillar.autoFailRules) {
    if (rule.check(scores)) {
      triggeredRules.push(rule.description);
      triggeredCriteria.push(rule.code);
    }
  }

  return {
    triggered: triggeredRules.length > 0,
    reason: triggeredRules.length > 0 ? triggeredRules.join('; ') : null,
    criteria: triggeredCriteria
  };
}

/**
 * Determine pillar status based on score and auto-fail
 */
export function determinePillarStatus(score: number, autoFailTriggered: boolean, conditionalThreshold: number, passThreshold: number): PillarStatus {
  if (autoFailTriggered) return 'fail';
  if (score >= passThreshold) return 'pass';
  if (score >= conditionalThreshold) return 'conditional';
  return 'fail';
}

/**
 * Check if Pillar 5 has global auto-fail (data integrity failure)
 */
export function checkGlobalAutoFail(pillar5Scores: SubCriterionScore[]): boolean {
  const dataConsistency = pillar5Scores.find(s => s.code === '5.1');
  return dataConsistency?.rating === 'red';
}

// ============================================
// DECISION STATE MACHINE
// ============================================

export interface DecisionResult {
  outcome: CertificationOutcome;
  decisionPath: string;
  globalAutoFail: boolean;
  globalAutoFailPillar: number | null;
  globalAutoFailReason: string | null;
  pillarResults: {
    pillarNumber: number;
    status: PillarStatus;
    score: number;
    autoFailTriggered: boolean;
    autoFailReason: string | null;
  }[];
  overallWeightedScore: number;
  remediationRequired: { pillarNumber: number; criteria: string; action: string }[];
}

/**
 * Execute the deterministic state machine for certification decision
 * As per Naywa Certification Decision Logic V1.2
 */
export function executeCertificationDecision(
  pillarResults: {
    pillarNumber: number;
    status: PillarStatus;
    score: number;
    autoFailTriggered: boolean;
    autoFailReason: string | null;
  }[]
): DecisionResult {
  const remediationRequired: { pillarNumber: number; criteria: string; action: string }[] = [];

  // Calculate overall weighted score
  let overallWeightedScore = 0;
  for (const result of pillarResults) {
    const pillar = ALL_PILLARS.find(p => p.pillarNumber === result.pillarNumber);
    if (pillar) {
      overallWeightedScore += result.score * pillar.weight;
    }
  }
  overallWeightedScore = Number(overallWeightedScore.toFixed(2));

  // Step 1: GLOBAL AUTO-FAIL CHECK (Highest Priority)
  // Check Pillar 5 first as it's the global kill switch
  const pillar5 = pillarResults.find(p => p.pillarNumber === 5);
  if (pillar5?.autoFailTriggered) {
    return {
      outcome: 'not_certified',
      decisionPath: 'auto_fail_p5_global',
      globalAutoFail: true,
      globalAutoFailPillar: 5,
      globalAutoFailReason: pillar5.autoFailReason || 'Data Integrity failure (Pillar 5)',
      pillarResults,
      overallWeightedScore,
      remediationRequired: []
    };
  }

  // Check other pillars for auto-fail
  for (const result of pillarResults) {
    if (result.autoFailTriggered) {
      return {
        outcome: 'not_certified',
        decisionPath: `auto_fail_p${result.pillarNumber}`,
        globalAutoFail: true,
        globalAutoFailPillar: result.pillarNumber,
        globalAutoFailReason: result.autoFailReason,
        pillarResults,
        overallWeightedScore,
        remediationRequired: []
      };
    }
  }

  // Step 2: NON-AUTOMATIC PILLAR FAIL CHECK
  for (const result of pillarResults) {
    if (result.status === 'fail') {
      return {
        outcome: 'not_certified',
        decisionPath: `pillar_fail_p${result.pillarNumber}`,
        globalAutoFail: false,
        globalAutoFailPillar: null,
        globalAutoFailReason: null,
        pillarResults,
        overallWeightedScore,
        remediationRequired: []
      };
    }
  }

  // Step 3: CONDITIONAL CHECK
  const conditionalPillars = pillarResults.filter(p => p.status === 'conditional');
  if (conditionalPillars.length > 0) {
    for (const cp of conditionalPillars) {
      remediationRequired.push({
        pillarNumber: cp.pillarNumber,
        criteria: `Pillar ${cp.pillarNumber} score: ${cp.score}`,
        action: 'Improve score to >= 2.50 or address specific conditions'
      });
    }

    return {
      outcome: 'conditional_certification',
      decisionPath: 'conditional',
      globalAutoFail: false,
      globalAutoFailPillar: null,
      globalAutoFailReason: null,
      pillarResults,
      overallWeightedScore,
      remediationRequired
    };
  }

  // Step 4: CLEAN PASS
  return {
    outcome: 'certified',
    decisionPath: 'clean_pass',
    globalAutoFail: false,
    globalAutoFailPillar: null,
    globalAutoFailReason: null,
    pillarResults,
    overallWeightedScore,
    remediationRequired: []
  };
}

// ============================================
// DATABASE OPERATIONS
// ============================================

/**
 * Initialize pillar assessments for an SME application
 */
export async function initializePillarAssessments(smeProfileId: string): Promise<void> {
  for (const pillar of ALL_PILLARS) {
    // Check if assessment already exists
    const existing = await prisma.pillarAssessment.findUnique({
      where: {
        smeProfileId_pillarNumber: {
          smeProfileId,
          pillarNumber: pillar.pillarNumber
        }
      }
    });

    if (!existing) {
      // Create default sub-criteria scores
      const defaultScores: SubCriterionScore[] = pillar.subCriteria.map(sc => ({
        code: sc.code,
        name: sc.name,
        weight: sc.weight,
        rating: 'not_rated' as CriterionRating,
        notes: ''
      }));

      await prisma.pillarAssessment.create({
        data: {
          smeProfileId,
          pillarNumber: pillar.pillarNumber,
          pillarName: pillar.name,
          pillarWeight: new Decimal(pillar.weight),
          status: 'not_started',
          subCriteriaScores: defaultScores as unknown as Prisma.InputJsonValue
        }
      });
    }
  }

  // Initialize certification decision record
  const existingDecision = await prisma.certificationDecision.findUnique({
    where: { smeProfileId }
  });

  if (!existingDecision) {
    await prisma.certificationDecision.create({
      data: {
        smeProfileId,
        outcome: 'pending'
      }
    });
  }
}

/**
 * Update sub-criterion score and recalculate pillar
 */
export async function updateSubCriterionScore(
  smeProfileId: string,
  pillarNumber: number,
  criterionCode: string,
  rating: CriterionRating,
  notes: string | null,
  assessedById: string
): Promise<{
  success: boolean;
  pillarAssessment: any;
  message: string;
}> {
  const pillarDef = ALL_PILLARS.find(p => p.pillarNumber === pillarNumber);
  if (!pillarDef) {
    return { success: false, pillarAssessment: null, message: 'Invalid pillar number' };
  }

  const assessment = await prisma.pillarAssessment.findUnique({
    where: {
      smeProfileId_pillarNumber: {
        smeProfileId,
        pillarNumber
      }
    }
  });

  if (!assessment) {
    return { success: false, pillarAssessment: null, message: 'Pillar assessment not found' };
  }

  // Update the specific criterion score
  const scores = (assessment.subCriteriaScores as unknown as SubCriterionScore[]) || [];
  const criterionIndex = scores.findIndex(s => s.code === criterionCode);

  if (criterionIndex === -1) {
    return { success: false, pillarAssessment: null, message: 'Criterion not found' };
  }

  scores[criterionIndex].rating = rating;
  if (notes !== null) {
    scores[criterionIndex].notes = notes;
  }

  // Recalculate pillar score
  const weightedScore = calculatePillarScore(scores);

  // Check auto-fail conditions
  const autoFailResult = checkAutoFail(pillarDef, scores);

  // Determine pillar status
  const allRated = scores.every(s => s.rating !== 'not_rated');
  let status: PillarStatus = 'in_progress';

  if (allRated) {
    status = determinePillarStatus(
      weightedScore,
      autoFailResult.triggered,
      pillarDef.conditionalThreshold,
      pillarDef.passThreshold
    );
  }

  // Update the assessment
  const updated = await prisma.pillarAssessment.update({
    where: {
      smeProfileId_pillarNumber: {
        smeProfileId,
        pillarNumber
      }
    },
    data: {
      subCriteriaScores: scores as unknown as Prisma.InputJsonValue,
      weightedScore: new Decimal(weightedScore),
      status,
      autoFailTriggered: autoFailResult.triggered,
      autoFailReason: autoFailResult.reason,
      autoFailCriteria: autoFailResult.criteria,
      assessedById,
      assessedAt: new Date()
    }
  });

  return { success: true, pillarAssessment: updated, message: 'Score updated successfully' };
}

/**
 * Get all pillar assessments for an SME
 */
export async function getPillarAssessments(smeProfileId: string) {
  const assessments = await prisma.pillarAssessment.findMany({
    where: { smeProfileId },
    orderBy: { pillarNumber: 'asc' },
    include: {
      assessedBy: {
        select: { id: true, fullName: true, email: true }
      }
    }
  });

  // Add pillar definitions to response
  return assessments.map(a => ({
    ...a,
    pillarDefinition: ALL_PILLARS.find(p => p.pillarNumber === a.pillarNumber)
  }));
}

/**
 * Get certification decision for an SME
 */
export async function getCertificationDecision(smeProfileId: string) {
  return prisma.certificationDecision.findUnique({
    where: { smeProfileId },
    include: {
      decidedBy: {
        select: { id: true, fullName: true, email: true }
      }
    }
  });
}

/**
 * Calculate and finalize certification decision
 */
export async function calculateCertificationDecision(
  smeProfileId: string,
  decidedById: string,
  decisionNotes: string | null
): Promise<{
  success: boolean;
  decision: any;
  message: string;
}> {
  // Get all pillar assessments
  const assessments = await prisma.pillarAssessment.findMany({
    where: { smeProfileId },
    orderBy: { pillarNumber: 'asc' }
  });

  if (assessments.length !== 5) {
    return { success: false, decision: null, message: 'All 5 pillars must be assessed' };
  }

  // Check if all pillars are fully assessed
  for (const assessment of assessments) {
    if (assessment.status === 'not_started' || assessment.status === 'in_progress') {
      return {
        success: false,
        decision: null,
        message: `Pillar ${assessment.pillarNumber} (${assessment.pillarName}) is not fully assessed`
      };
    }
  }

  // Prepare pillar results for decision
  const pillarResults = assessments.map(a => ({
    pillarNumber: a.pillarNumber,
    status: a.status,
    score: a.weightedScore ? Number(a.weightedScore) : 0,
    autoFailTriggered: a.autoFailTriggered,
    autoFailReason: a.autoFailReason
  }));

  // Execute decision state machine
  const decision = executeCertificationDecision(pillarResults);

  // Update certification decision record
  const updated = await prisma.certificationDecision.upsert({
    where: { smeProfileId },
    create: {
      smeProfileId,
      outcome: decision.outcome,
      globalAutoFail: decision.globalAutoFail,
      globalAutoFailPillar: decision.globalAutoFailPillar,
      globalAutoFailReason: decision.globalAutoFailReason,
      pillar1Status: pillarResults[0].status,
      pillar1Score: new Decimal(pillarResults[0].score),
      pillar2Status: pillarResults[1].status,
      pillar2Score: new Decimal(pillarResults[1].score),
      pillar3Status: pillarResults[2].status,
      pillar3Score: new Decimal(pillarResults[2].score),
      pillar4Status: pillarResults[3].status,
      pillar4Score: new Decimal(pillarResults[3].score),
      pillar5Status: pillarResults[4].status,
      pillar5Score: new Decimal(pillarResults[4].score),
      overallWeightedScore: new Decimal(decision.overallWeightedScore),
      decidedAt: new Date(),
      decidedById,
      decisionNotes,
      decisionPath: decision.decisionPath,
      remediationRequired: decision.remediationRequired
    },
    update: {
      outcome: decision.outcome,
      globalAutoFail: decision.globalAutoFail,
      globalAutoFailPillar: decision.globalAutoFailPillar,
      globalAutoFailReason: decision.globalAutoFailReason,
      pillar1Status: pillarResults[0].status,
      pillar1Score: new Decimal(pillarResults[0].score),
      pillar2Status: pillarResults[1].status,
      pillar2Score: new Decimal(pillarResults[1].score),
      pillar3Status: pillarResults[2].status,
      pillar3Score: new Decimal(pillarResults[2].score),
      pillar4Status: pillarResults[3].status,
      pillar4Score: new Decimal(pillarResults[3].score),
      pillar5Status: pillarResults[4].status,
      pillar5Score: new Decimal(pillarResults[4].score),
      overallWeightedScore: new Decimal(decision.overallWeightedScore),
      decidedAt: new Date(),
      decidedById,
      decisionNotes,
      decisionPath: decision.decisionPath,
      remediationRequired: decision.remediationRequired
    }
  });

  return { success: true, decision: { ...updated, ...decision }, message: 'Decision calculated successfully' };
}

/**
 * Get pillar definitions (for frontend)
 */
export function getPillarDefinitions() {
  return ALL_PILLARS.map(p => ({
    pillarNumber: p.pillarNumber,
    name: p.name,
    weight: p.weight,
    description: p.description,
    passThreshold: p.passThreshold,
    conditionalThreshold: p.conditionalThreshold,
    subCriteria: p.subCriteria.map(sc => ({
      code: sc.code,
      name: sc.name,
      weight: sc.weight,
      description: sc.description,
      mandatoryEvidence: sc.mandatoryEvidence,
      isAutoFailCriterion: sc.isAutoFailCriterion || false,
      autoFailCondition: sc.autoFailCondition || null
    }))
  }));
}

/**
 * Regulatory disclaimer text (must be included on all certificates)
 */
export const REGULATORY_DISCLAIMER = `This certification confirms operational readiness for institutional review based on submitted documentation. It does not constitute a guarantee of creditworthiness, a lending offer, or a substitute for regulatory KYC/AML due diligence.`;

export default {
  ALL_PILLARS,
  ratingToScore,
  calculatePillarScore,
  checkAutoFail,
  determinePillarStatus,
  checkGlobalAutoFail,
  executeCertificationDecision,
  initializePillarAssessments,
  updateSubCriterionScore,
  getPillarAssessments,
  getCertificationDecision,
  calculateCertificationDecision,
  getPillarDefinitions,
  REGULATORY_DISCLAIMER
};
