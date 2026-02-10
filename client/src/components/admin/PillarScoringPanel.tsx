'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import {
  PillarAssessment,
  CertificationDecision,
  CertificationDefinitions,
  CriterionRating,
  PillarStatus,
  CertificationOutcome,
  SubCriterionScore,
} from '@/types';

interface PillarScoringPanelProps {
  smeProfileId: string;
  companyName: string | null;
  onDecisionCalculated?: (decision: CertificationDecision) => void;
}

export default function PillarScoringPanel({
  smeProfileId,
  companyName,
  onDecisionCalculated,
}: PillarScoringPanelProps) {
  const [definitions, setDefinitions] = useState<CertificationDefinitions | null>(null);
  const [assessments, setAssessments] = useState<PillarAssessment[]>([]);
  const [decision, setDecision] = useState<CertificationDecision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null);
  const [savingCriterion, setSavingCriterion] = useState<string | null>(null);
  const [calculatingDecision, setCalculatingDecision] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [defResult, assessResult, decisionResult] = await Promise.all([
        api.getCertificationDefinitions(),
        api.getPillarAssessments(smeProfileId),
        api.getCertificationDecision(smeProfileId),
      ]);

      if (defResult.success && defResult.data) {
        setDefinitions(defResult.data);
      }

      if (assessResult.success && assessResult.data) {
        setAssessments(assessResult.data);
      }

      if (decisionResult.success && decisionResult.data !== undefined) {
        setDecision(decisionResult.data);
      }
    } catch (err) {
      console.error('Error fetching scoring data:', err);
      setError('Failed to load scoring data');
    } finally {
      setLoading(false);
    }
  }, [smeProfileId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update criterion score
  const handleScoreChange = async (
    pillarNumber: number,
    criterionCode: string,
    rating: CriterionRating,
    notes?: string
  ) => {
    const criterionKey = `${pillarNumber}-${criterionCode}`;
    setSavingCriterion(criterionKey);

    try {
      const result = await api.updateCriterionScore(
        smeProfileId,
        pillarNumber,
        criterionCode,
        rating,
        notes
      );

      if (result.success && result.data) {
        // Update the assessment in state
        setAssessments((prev) =>
          prev.map((a) =>
            a.pillarNumber === pillarNumber ? result.data! : a
          )
        );
      } else {
        setError(result.message || 'Failed to update score');
      }
    } catch (err) {
      console.error('Error updating score:', err);
      setError('Failed to update score');
    } finally {
      setSavingCriterion(null);
    }
  };

  // Calculate final decision
  const handleCalculateDecision = async () => {
    setCalculatingDecision(true);
    setError(null);

    try {
      const result = await api.calculateCertificationDecision(smeProfileId);

      if (result.success && result.data) {
        setDecision(result.data);
        if (onDecisionCalculated) {
          onDecisionCalculated(result.data);
        }
      } else {
        setError(result.message || 'Failed to calculate decision');
      }
    } catch (err) {
      console.error('Error calculating decision:', err);
      setError('Failed to calculate decision');
    } finally {
      setCalculatingDecision(false);
    }
  };

  // Get rating badge style
  const getRatingStyle = (rating: CriterionRating) => {
    switch (rating) {
      case 'green':
        return { bg: 'var(--success-50)', color: 'var(--success-700)', border: 'var(--success-200)' };
      case 'amber':
        return { bg: 'var(--warning-50)', color: 'var(--warning-700)', border: 'var(--warning-200)' };
      case 'red':
        return { bg: 'var(--danger-50)', color: 'var(--danger-700)', border: 'var(--danger-200)' };
      default:
        return { bg: 'var(--graphite-100)', color: 'var(--graphite-600)', border: 'var(--graphite-200)' };
    }
  };

  // Get pillar status style
  const getPillarStatusStyle = (status: PillarStatus) => {
    switch (status) {
      case 'pass':
        return { bg: 'var(--success-50)', color: 'var(--success-700)' };
      case 'conditional':
        return { bg: 'var(--warning-50)', color: 'var(--warning-700)' };
      case 'fail':
        return { bg: 'var(--danger-50)', color: 'var(--danger-700)' };
      case 'in_progress':
        return { bg: 'var(--teal-50)', color: 'var(--teal-700)' };
      default:
        return { bg: 'var(--graphite-100)', color: 'var(--graphite-600)' };
    }
  };

  // Get outcome style
  const getOutcomeStyle = (outcome: CertificationOutcome) => {
    switch (outcome) {
      case 'certified':
        return { bg: 'var(--success-50)', color: 'var(--success-700)', label: 'CERTIFIED' };
      case 'conditional_certification':
        return { bg: 'var(--warning-50)', color: 'var(--warning-700)', label: 'CONDITIONAL' };
      case 'not_certified':
        return { bg: 'var(--danger-50)', color: 'var(--danger-700)', label: 'NOT CERTIFIED' };
      default:
        return { bg: 'var(--graphite-100)', color: 'var(--graphite-600)', label: 'PENDING' };
    }
  };

  // Calculate progress
  const getProgress = () => {
    let totalCriteria = 0;
    let ratedCriteria = 0;

    for (const assessment of assessments) {
      const scores = assessment.subCriteriaScores || [];
      totalCriteria += scores.length;
      ratedCriteria += scores.filter((s) => s.rating !== 'not_rated').length;
    }

    return {
      total: totalCriteria,
      rated: ratedCriteria,
      percent: totalCriteria > 0 ? Math.round((ratedCriteria / totalCriteria) * 100) : 0,
    };
  };

  if (loading) {
    return (
      <div className="solid-card rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--teal-600)' }}></div>
          <span className="ml-3" style={{ color: 'var(--graphite-600)' }}>Loading scoring engine...</span>
        </div>
      </div>
    );
  }

  if (error && !definitions) {
    return (
      <div className="solid-card rounded-xl p-6">
        <div className="text-center py-8">
          <p style={{ color: 'var(--danger-600)' }}>{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: 'var(--teal-600)', color: 'white' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const progress = getProgress();

  return (
    <div className="solid-card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--graphite-200)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
              <svg className="w-5 h-5" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Capital-Readiness Certification Assessment
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--graphite-500)' }}>
              {companyName || 'SME'} - 5-Pillar Scoring Engine
            </p>
          </div>

          {/* Progress */}
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: 'var(--teal-600)' }}>
              {progress.percent}%
            </div>
            <div className="text-xs" style={{ color: 'var(--graphite-500)' }}>
              {progress.rated}/{progress.total} criteria rated
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'var(--graphite-200)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress.percent}%`,
              background: progress.percent === 100 ? 'var(--success-500)' : 'var(--teal-500)',
            }}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-5 py-3" style={{ background: 'var(--danger-50)' }}>
          <p className="text-sm" style={{ color: 'var(--danger-700)' }}>{error}</p>
        </div>
      )}

      {/* Decision Summary (if exists) */}
      {decision && decision.outcome !== 'pending' && (
        <div className="p-5 border-b" style={{ borderColor: 'var(--graphite-200)', background: getOutcomeStyle(decision.outcome).bg }}>
          <div className="flex items-center justify-between">
            <div>
              <span
                className="px-3 py-1 rounded-full text-sm font-semibold"
                style={{
                  background: getOutcomeStyle(decision.outcome).bg,
                  color: getOutcomeStyle(decision.outcome).color,
                  border: `1px solid ${getOutcomeStyle(decision.outcome).color}`,
                }}
              >
                {getOutcomeStyle(decision.outcome).label}
              </span>
              {decision.globalAutoFail && (
                <span className="ml-2 text-sm" style={{ color: 'var(--danger-600)' }}>
                  (Auto-fail: {decision.globalAutoFailReason})
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-medium" style={{ color: 'var(--graphite-700)' }}>
                Overall Score: {decision.overallWeightedScore?.toFixed(2) || 'N/A'}
              </div>
              {decision.decidedAt && (
                <div className="text-xs" style={{ color: 'var(--graphite-500)' }}>
                  Decided: {new Date(decision.decidedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pillars */}
      <div className="divide-y" style={{ borderColor: 'var(--graphite-200)' }}>
        {assessments.map((assessment) => {
          const pillarDef = definitions?.pillars.find((p) => p.pillarNumber === assessment.pillarNumber);
          const isExpanded = expandedPillar === assessment.pillarNumber;
          const scores = assessment.subCriteriaScores || [];
          const ratedCount = scores.filter((s) => s.rating !== 'not_rated').length;
          const statusStyle = getPillarStatusStyle(assessment.status);

          return (
            <div key={assessment.pillarNumber}>
              {/* Pillar Header */}
              <button
                onClick={() => setExpandedPillar(isExpanded ? null : assessment.pillarNumber)}
                className="w-full p-4 flex items-center justify-between hover:bg-opacity-50 transition-colors"
                style={{ background: isExpanded ? 'var(--graphite-50)' : 'transparent' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'var(--teal-100)', color: 'var(--teal-700)' }}
                  >
                    {assessment.pillarNumber}
                  </div>
                  <div className="text-left">
                    <div className="font-medium" style={{ color: 'var(--graphite-900)' }}>
                      {assessment.pillarName}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--graphite-500)' }}>
                      Weight: {((assessment.pillarWeight || 0) * 100).toFixed(0)}% | {ratedCount}/{scores.length} criteria
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Auto-fail warning */}
                  {assessment.autoFailTriggered && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: 'var(--danger-100)', color: 'var(--danger-700)' }}>
                      AUTO-FAIL
                    </span>
                  )}

                  {/* Score */}
                  {assessment.weightedScore !== null && (
                    <span className="text-sm font-medium" style={{ color: 'var(--graphite-700)' }}>
                      Score: {Number(assessment.weightedScore).toFixed(2)}
                    </span>
                  )}

                  {/* Status badge */}
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                  >
                    {assessment.status.replace('_', ' ')}
                  </span>

                  {/* Expand icon */}
                  <svg
                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--graphite-400)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && pillarDef && (
                <div className="px-4 pb-4">
                  {/* Pillar description */}
                  <p className="text-sm mb-4 p-3 rounded-lg" style={{ background: 'var(--graphite-50)', color: 'var(--graphite-600)' }}>
                    {pillarDef.description}
                  </p>

                  {/* Auto-fail reason */}
                  {assessment.autoFailTriggered && assessment.autoFailReason && (
                    <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--danger-50)' }}>
                      <p className="text-sm font-medium" style={{ color: 'var(--danger-700)' }}>
                        Auto-Fail Triggered: {assessment.autoFailReason}
                      </p>
                    </div>
                  )}

                  {/* Sub-criteria */}
                  <div className="space-y-3">
                    {pillarDef.subCriteria.map((criterion) => {
                      const scoreData = scores.find((s) => s.code === criterion.code);
                      const currentRating = scoreData?.rating || 'not_rated';
                      const isSaving = savingCriterion === `${assessment.pillarNumber}-${criterion.code}`;
                      const ratingStyle = getRatingStyle(currentRating);

                      return (
                        <div
                          key={criterion.code}
                          className="p-3 rounded-lg border"
                          style={{ borderColor: ratingStyle.border, background: ratingStyle.bg }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--graphite-200)' }}>
                                  {criterion.code}
                                </span>
                                <span className="font-medium text-sm" style={{ color: 'var(--graphite-900)' }}>
                                  {criterion.name}
                                </span>
                                {criterion.isAutoFailCriterion && (
                                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--danger-100)', color: 'var(--danger-700)' }}>
                                    Auto-fail if RED
                                  </span>
                                )}
                              </div>
                              <p className="text-xs mt-1" style={{ color: 'var(--graphite-500)' }}>
                                {criterion.description} (Weight: {(criterion.weight * 100).toFixed(0)}%)
                              </p>
                            </div>

                            {/* Rating selector */}
                            <div className="flex items-center gap-1">
                              {isSaving && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" style={{ borderColor: 'var(--teal-600)' }}></div>
                              )}
                              {(['green', 'amber', 'red'] as const).map((rating) => {
                                const style = getRatingStyle(rating);
                                const isSelected = currentRating === rating;
                                return (
                                  <button
                                    key={rating}
                                    onClick={() => handleScoreChange(assessment.pillarNumber, criterion.code, rating)}
                                    disabled={isSaving}
                                    className={`px-3 py-1 rounded text-xs font-semibold uppercase transition-all ${
                                      isSelected ? 'scale-105 shadow-md' : 'opacity-60 hover:opacity-100'
                                    }`}
                                    style={{
                                      background: style.bg,
                                      color: style.color,
                                      border: isSelected ? `2px solid ${style.color}` : '2px solid transparent',
                                    }}
                                  >
                                    {rating}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Mandatory evidence */}
                          <div className="mt-2 text-xs" style={{ color: 'var(--graphite-500)' }}>
                            <span className="font-medium">Required:</span> {criterion.mandatoryEvidence.join(', ')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Calculate Decision Button */}
      <div className="p-5 border-t" style={{ borderColor: 'var(--graphite-200)', background: 'var(--graphite-50)' }}>
        <div className="flex items-center justify-between">
          <div className="text-sm" style={{ color: 'var(--graphite-600)' }}>
            {progress.percent === 100 ? (
              <span style={{ color: 'var(--success-600)' }}>All criteria have been rated. Ready to calculate decision.</span>
            ) : (
              <span>Rate all criteria to calculate the final decision.</span>
            )}
          </div>
          <button
            onClick={handleCalculateDecision}
            disabled={progress.percent < 100 || calculatingDecision}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: progress.percent === 100 ? 'var(--teal-600)' : 'var(--graphite-300)',
              color: 'white',
            }}
          >
            {calculatingDecision ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Calculating...
              </span>
            ) : (
              'Calculate Certification Decision'
            )}
          </button>
        </div>

        {/* Disclaimer */}
        {definitions?.disclaimer && (
          <p className="mt-3 text-xs" style={{ color: 'var(--graphite-500)' }}>
            {definitions.disclaimer}
          </p>
        )}
      </div>
    </div>
  );
}
