import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { initialRiskQuestions } from '../data/initialState';
import { RiskAssessmentResult, RiskCategory, RiskLevel } from '../types';
import {
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  LifeBuoy,
  FileEdit,
  Info
} from 'lucide-react';
import { generateId } from '../lib/utils';

export const RiskAssessmentPage: React.FC = () => {
  const {
    saveRiskResult,
    latestRiskResult,
    setCurrentPage,
    addIncident
  } = useAegis();

  // Selected answers: questionId -> true/false
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [assessmentResult, setAssessmentResult] = useState<RiskAssessmentResult | null>(latestRiskResult);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

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

    // Normalize to 0-100
    const normalizedScore = Math.min(100, totalScore);

    let level: RiskLevel = 'LOW';
    if (normalizedScore >= 75) level = 'CRITICAL';
    else if (normalizedScore >= 45) level = 'HIGH';
    else if (normalizedScore >= 20) level = 'MODERATE';

    // Find highest contributing category
    let highestCat: RiskCategory = 'domestic_abuse';
    let maxCatScore = -1;
    Object.entries(categoryScores).forEach(([cat, score]) => {
      if (score > maxCatScore) {
        maxCatScore = score;
        highestCat = cat as RiskCategory;
      }
    });

    const recommendations: string[] = [];
    if (level === 'CRITICAL' || level === 'HIGH') {
      recommendations.push('Consider moving to a verified safe place or contacting 181 Women Helpline (24/7).');
      recommendations.push('Do not alert the perpetrator that you are documenting incidents or preparing an exit.');
      recommendations.push('Secure original identity cards (Aadhaar, Passport) in an emergency safety pack.');
    } else if (level === 'MODERATE') {
      recommendations.push('Establish a routine Safety Check-in with a trusted contact before entering vulnerable situations.');
      recommendations.push('Keep detailed records in the Incident Journal with dates and screenshots.');
    } else {
      recommendations.push('Review cyber privacy settings and keep emergency contacts updated.');
    }

    const explanation = detectedIndicators.length > 0
      ? `Identified ${detectedIndicators.length} documented behavioral indicator(s) suggesting patterns of ${highestCat.replace('_', ' ')}.`
      : 'No high-severity risk patterns identified based on the answered items.';

    const result: RiskAssessmentResult = {
      id: generateId('risk_res'),
      completedAt: new Date().toISOString(),
      score: normalizedScore,
      level,
      primaryCategory: highestCat,
      detectedIndicators,
      explanation,
      recommendedSteps: recommendations,
      recommendations
    };

    setAssessmentResult(result);
    saveRiskResult(result);
  };

  const handleCreateIncidentDraft = () => {
    if (!assessmentResult) return;
    addIncident({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      category: 'harassment',
      severity: assessmentResult.level === 'CRITICAL' ? 5 : assessmentResult.level === 'HIGH' ? 4 : 2,
      location: 'Logged via Risk Assessment',
      description: `Risk Assessment Evaluation: Level ${assessmentResult.level} (${assessmentResult.score}/100). Indicators: ${assessmentResult.detectedIndicators.join('; ')}`,
      evidenceIds: [],
      notes: 'Auto-drafted from questionnaire for timeline documentation.',
      reportedToPolice: false
    });
    setCurrentPage('incidents');
  };

  const categoriesList = [
    { key: 'ALL', label: 'All Indicators' },
    { key: 'domestic_abuse', label: 'Domestic Coercion' },
    { key: 'stalking', label: 'Stalking' },
    { key: 'cyber_harassment', label: 'Cyber Harassment' },
    { key: 'trafficking_exploitation', label: 'Exploitation' },
    { key: 'blackmail_extortion', label: 'Blackmail' }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-sky-400" />
          Early Risk Detection Engine
        </h2>
        <p className="text-xs text-slate-400">
          Structured indicator screening for coercion, stalking, exploitation, and abuse.
        </p>
      </div>

      {/* Mandatory Non-Diagnostic Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed space-y-1">
        <div className="font-semibold text-amber-400 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" /> Informational Safety Observation
        </div>
        <p className="text-slate-400">
          This questionnaire highlights behavioral risk patterns based on established safety protocols. It is not a legal verdict or medical diagnosis. Does not replace emergency services.
        </p>
      </div>

      {/* Result Display if Computed */}
      {assessmentResult && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Assessment Results
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              assessmentResult.level === 'CRITICAL'
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : assessmentResult.level === 'HIGH'
                ? 'bg-orange-950 text-orange-300 border-orange-800'
                : assessmentResult.level === 'MODERATE'
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }`}>
              {assessmentResult.level} RISK ({assessmentResult.score}/100)
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">
              Primary Focus: {assessmentResult.primaryCategory.replace('_', ' ').toUpperCase()}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {assessmentResult.explanation}
            </p>
          </div>

          {/* Detected Indicators List */}
          {assessmentResult.detectedIndicators.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Detected Warning Flags ({assessmentResult.detectedIndicators.length})
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {assessmentResult.detectedIndicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actionable Next Steps */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">
              Recommended Protective Next Steps
            </span>
            <div className="space-y-1.5 text-xs text-slate-300">
              {(assessmentResult.recommendations || assessmentResult.recommendedSteps || []).map((rec, i) => (
                <div key={i} className="flex items-start gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-col gap-2 text-xs">
            <button
              onClick={handleCreateIncidentDraft}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-2 transition"
            >
              <FileEdit className="w-4 h-4 text-sky-400" />
              <span>Create Incident Timeline Entry</span>
            </button>

            <button
              onClick={() => setCurrentPage('resources')}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold flex items-center justify-center gap-2 transition"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Find Verified Support Services (181 / Sakhi)</span>
            </button>
          </div>
        </div>
      )}

      {/* Category Pills Filter */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Filter by Safety Scenario
        </label>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categoriesList.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategoryFilter(cat.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategoryFilter === cat.key
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Interactive List */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Select all that apply to your current situation:
        </span>

        {filteredQuestions.map((q) => {
          const isSelected = !!answers[q.id];
          return (
            <div
              key={q.id}
              onClick={() => toggleAnswer(q.id)}
              className={`cursor-pointer p-3 rounded-xl border transition text-xs flex items-start gap-3 select-none ${
                isSelected
                  ? 'bg-sky-950/40 border-sky-600/80 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}} // Handled by div click
                className="mt-0.5 rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-0 shrink-0"
              />
              <div className="space-y-0.5 flex-1">
                <span className="font-medium text-slate-100 block">{q.indicatorText}</span>
                <span className="text-[10px] text-slate-400 block">
                  Category: {q.category.replace('_', ' ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calculate Button */}
      <div className="pt-2 sticky bottom-16 z-20">
        <button
          onClick={computeRisk}
          className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Compute Risk Assessment & Safety Guidance</span>
        </button>
      </div>
    </div>
  );
};
