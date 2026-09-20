import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { initialRiskQuestions } from '../data/initialState';
import { RiskAssessmentResult, RiskCategory, RiskLevel } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { ResourceNavigatorPage } from './ResourceNavigatorPage';
import {
  ArrowRight,
  RotateCcw,
  Check,
  FilePlus2,
  LifeBuoy,
  Info,
  Circle,
  Sparkles
} from 'lucide-react';
import { generateId } from '../lib/utils';

export const RiskAssessmentPage: React.FC = () => {
  const {
    saveRiskResult,
    latestRiskResult,
    setCurrentPage,
    addIncident
  } = useAegis();
  const { t } = useTranslation();

  // Top Segmented Control: "Something feels off?" | "Get help"
  const [safetyTab, setSafetyTab] = useState<'risk' | 'resources'>('risk');

  // Selected question answers
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [assessmentResult, setAssessmentResult] = useState<RiskAssessmentResult | null>(latestRiskResult);
  const [showResultView, setShowResultView] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [isDisclaimerExpanded, setIsDisclaimerExpanded] = useState(false);

  const selectedCount = Object.values(answers).filter(Boolean).length;

  const categories = [
    { key: 'ALL', label: 'All' },
    { key: 'stalking', label: 'Stalking' },
    { key: 'harassment', label: 'Harassment' },
    { key: 'domestic_abuse', label: 'Relationship' },
    { key: 'trafficking', label: 'Travel & Job' },
    { key: 'cyber_threat', label: 'Cyber' }
  ];

  const filteredQuestions = selectedCategoryFilter === 'ALL'
    ? initialRiskQuestions
    : initialRiskQuestions.filter(q => q.category === selectedCategoryFilter);

  const toggleAnswer = (questionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const computeRisk = () => {
    let totalScore = 0;
    const categoryScores: Record<string, number> = {};
    const detectedIndicators: string[] = [];

    initialRiskQuestions.forEach(q => {
      if (answers[q.id]) {
        totalScore += q.weight;
        categoryScores[q.category] = (categoryScores[q.category] || 0) + q.weight;
        detectedIndicators.push(q.indicatorText);
      }
    });

    const normalizedScore = Math.min(100, totalScore);

    let level: RiskLevel = 'LOW';
    if (normalizedScore >= 50) level = 'HIGH';
    else if (normalizedScore >= 20) level = 'MODERATE';

    let highestCat: RiskCategory = 'stalking';
    let maxCatScore = -1;
    Object.entries(categoryScores).forEach(([cat, score]) => {
      if (score > maxCatScore) {
        maxCatScore = score;
        highestCat = cat as RiskCategory;
      }
    });

    // Plain language recommendations (max 4 steps)
    const recommendations: string[] = [];
    if (level === 'HIGH') {
      recommendations.push('Contact 181 Women Helpline or 112 if you feel in immediate danger.');
      recommendations.push("Save screenshots to your private record so they cannot be altered later.");
      recommendations.push('Do not confront the person alone or let them know you are documenting incidents.');
      recommendations.push('Keep copies of key identity documents and emergency cash in a safe place.');
    } else if (level === 'MODERATE') {
      recommendations.push('Set a Safety check-in timer whenever traveling or meeting unfamiliar people.');
      recommendations.push("Save screenshots to your private record so they cannot be altered later.");
      recommendations.push('Log dates, locations, and messages in your incident log.');
      recommendations.push('Share your live location with a trusted contact during vulnerable hours.');
    } else {
      recommendations.push('Keep active trusted contacts for one-tap emergency alerts.');
      recommendations.push("Save screenshots to your private record so they cannot be altered later.");
      recommendations.push('Check app settings and enable the voice safe word.');
      recommendations.push('Write down any unusual patterns or harassment in your incident log.');
    }

    const result: RiskAssessmentResult = {
      id: generateId('risk'),
      completedAt: new Date().toISOString(),
      score: normalizedScore,
      level,
      primaryCategory: highestCat,
      detectedIndicators: detectedIndicators.length > 0 ? detectedIndicators : ['No high-risk indicators currently reported'],
      explanation: 'Evaluated risk profile based on reported behavioral and environmental indicators.',
      recommendedSteps: recommendations,
      recommendations
    };

    setAssessmentResult(result);
    saveRiskResult(result);
    setShowResultView(true);
  };

  const handleSaveToIncidents = () => {
    if (!assessmentResult) return;
    addIncident({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      category: 'harassment',
      severity: assessmentResult.level === 'HIGH' ? 4 : assessmentResult.level === 'MODERATE' ? 3 : 2,
      location: 'Self-Assessed via Risk Check',
      description: `Risk evaluation completed: ${assessmentResult.level} (${assessmentResult.score}/100). Indicators: ${assessmentResult.detectedIndicators.join('; ')}`,
      evidenceIds: [],
      notes: 'Recorded from Check my risk questionnaire.',
      reportedToPolice: false
    });
    setCurrentPage('incidents');
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Segmented Control: "Something feels off?" | "Get help" */}
      <div className="p-1 rounded-full bg-[var(--surface-2)] border border-[var(--line)] grid grid-cols-2 gap-1">
        <button
          onClick={() => setSafetyTab('risk')}
          className={`h-9 rounded-full text-[13px] font-medium transition cursor-pointer ${
            safetyTab === 'risk'
              ? 'bg-[var(--surface)] text-[var(--text)]'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          {t.pageTitleCheckMyRisk || 'Something feels off?'}
        </button>
        <button
          onClick={() => setSafetyTab('resources')}
          className={`h-9 rounded-full text-[13px] font-medium transition cursor-pointer ${
            safetyTab === 'resources'
              ? 'bg-[var(--surface)] text-[var(--text)]'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          {t.pageTitleGetHelp || 'Get help'}
        </button>
      </div>

      {/* If "Get help" is active, render ResourceNavigatorPage embedded */}
      {safetyTab === 'resources' ? (
        <ResourceNavigatorPage embedded={true} />
      ) : (
        /* "Something feels off?" content */
        <div className="space-y-4">
          {/* Page Header */}
          <div>
            <h1 className="page-title">{t.pageTitleCheckMyRisk || 'Something feels off?'}</h1>
            <p className="text-caption text-[14px] mt-1">
              {t.pageSubtitleCheckMyRisk || "Tell us what's happening. Nothing leaves this phone."}
            </p>
          </div>

          {/* Shrunk Info Box */}
          <div className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] text-[13px] text-[var(--text)]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <Info className="w-4 h-4 text-[var(--muted)] shrink-0 stroke-[1.75]" />
                <span className="truncate text-[12px]">
                  Informational guidance only, not legal advice.
                </span>
              </div>
              <button
                onClick={() => setIsDisclaimerExpanded(!isDisclaimerExpanded)}
                className="text-[12px] font-medium text-[var(--primary)] hover:underline shrink-0 cursor-pointer"
              >
                {isDisclaimerExpanded ? 'Hide' : 'Learn more'}
              </button>
            </div>

            {isDisclaimerExpanded && (
              <p className="text-caption text-[12px] mt-2 pt-2 border-t border-[var(--line)]">
                This tool checks patterns of stalking, coercion, and harassment using structured indicators. It is confidential, stored only on your device, and does not replace emergency response.
              </p>
            )}
          </div>

          {/* RESULTS VIEW */}
          {showResultView && assessmentResult ? (
            <div className="soft-card p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="section-title text-[18px]">Assessment result</h2>
                <button
                  onClick={() => setShowResultView(false)}
                  className="text-[12px] text-[var(--primary)] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 stroke-[1.75]" />
                  Edit answers
                </button>
              </div>

              {/* 3-segment risk scale */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span
                    className={`font-heading text-[22px] font-semibold ${
                      assessmentResult.level === 'LOW'
                        ? 'text-[var(--safe)]'
                        : assessmentResult.level === 'MODERATE'
                        ? 'text-[var(--accent)]'
                        : 'text-[var(--sos)]'
                    }`}
                  >
                    {assessmentResult.level === 'LOW'
                      ? 'Low risk'
                      : assessmentResult.level === 'MODERATE'
                      ? 'Moderate risk'
                      : 'High risk'}
                  </span>
                  <span className="text-[12px] text-[var(--muted)] font-mono">
                    Score: {assessmentResult.score}/100
                  </span>
                </div>

                {/* 3-segment scale bar */}
                <div className="grid grid-cols-3 gap-1.5 h-2">
                  <div
                    className={`rounded-full transition ${
                      assessmentResult.level === 'LOW' || assessmentResult.level === 'MODERATE' || assessmentResult.level === 'HIGH'
                        ? 'bg-[var(--safe)]'
                        : 'bg-[var(--line)]'
                    }`}
                  />
                  <div
                    className={`rounded-full transition ${
                      assessmentResult.level === 'MODERATE' || assessmentResult.level === 'HIGH'
                        ? 'bg-[var(--accent)]'
                        : 'bg-[var(--line)]'
                    }`}
                  />
                  <div
                    className={`rounded-full transition ${
                      assessmentResult.level === 'HIGH'
                        ? 'bg-[var(--sos)]'
                        : 'bg-[var(--line)]'
                    }`}
                  />
                </div>
              </div>

              {/* "What we noticed" flags */}
              <div className="space-y-2">
                <h3 className="section-title text-[16px]">{t.whatWeNoticed || 'What we noticed'}</h3>
                <div className="space-y-1.5">
                  {assessmentResult.detectedIndicators.map((ind, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-[12px] bg-[var(--surface-2)] text-[13px] text-[var(--text)] flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* "What you can do" as at most 4 steps with circle bullets */}
              <div className="space-y-2">
                <h3 className="section-title text-[16px]">{t.whatYouCanDo || 'What you can do'}</h3>
                <div className="space-y-2">
                  {assessmentResult.recommendations.slice(0, 4).map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-[13px] text-[var(--text)] p-2.5 rounded-[12px] bg-[var(--surface-2)]"
                    >
                      <Circle className="w-3.5 h-3.5 text-[var(--safe)] mt-0.5 shrink-0 stroke-[2]" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="btn-save-risk-incident"
                    onClick={handleSaveToIncidents}
                    className="soft-btn soft-btn-secondary text-[13px]"
                  >
                    <FilePlus2 className="w-3.5 h-3.5 mr-1.5 stroke-[1.75]" />
                    {t.saveToIncidentLog || 'Save to incident log'}
                  </button>
                  <button
                    id="btn-risk-get-help"
                    onClick={() => setSafetyTab('resources')}
                    className="soft-btn soft-btn-primary text-[13px]"
                  >
                    <LifeBuoy className="w-3.5 h-3.5 mr-1.5 stroke-[1.75]" />
                    {t.getHelpNow || 'Get help now'}
                  </button>
                </div>
                <button
                  id="btn-risk-discuss-ai"
                  onClick={() => setCurrentPage('ai-assistant')}
                  className="w-full h-11 px-4 rounded-[12px] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] hover:border-[var(--primary)] flex items-center justify-center gap-2 text-[13px] font-medium transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[var(--primary)] stroke-[1.75]" />
                  <span>Discuss answers with Abhaya AI Advisor</span>
                </button>
              </div>
            </div>
          ) : (
            /* QUESTIONNAIRE VIEW */
            <div className="space-y-4">
              {/* Sticky Filter Tabs */}
              <div className="sticky top-14 z-20 bg-[var(--bg)] pt-1 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-[var(--muted)]">
                    Filter by concern:
                  </span>
                  <span className="text-[12px] font-medium text-[var(--primary)]">
                    {selectedCount} {t.selectedCount || 'selected'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategoryFilter(cat.key)}
                      className={`h-8 px-3 rounded-full text-[12px] font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${
                        selectedCategoryFilter === cat.key
                          ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                          : 'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--line)]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-2">
                {filteredQuestions.map((q) => {
                  const isChecked = !!answers[q.id];
                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleAnswer(q.id)}
                      className={`p-3.5 rounded-[12px] bg-[var(--surface)] border flex items-start gap-3.5 transition cursor-pointer select-none ${
                        isChecked
                          ? 'border-[var(--primary)] bg-[var(--surface-2)]'
                          : 'border-[var(--line)] hover:bg-[var(--surface-2)]/50'
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 border transition ${
                          isChecked
                            ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--on-primary)]'
                            : 'bg-[var(--surface-2)] border-[var(--line)] text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)] mb-1">
                          {q.category.replace('_', ' ')}
                        </span>
                        <p className="text-[13px] text-[var(--text)] leading-relaxed">
                          {q.indicatorText}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button: "See my results" */}
              <div className="pt-2">
                <button
                  id="btn-see-my-results"
                  onClick={computeRisk}
                  className="soft-btn soft-btn-primary w-full text-[14px]"
                >
                  {t.seeMyResults || 'See my results'}
                  <ArrowRight className="w-4 h-4 ml-2 stroke-[1.75]" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
