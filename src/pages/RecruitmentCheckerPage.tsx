import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { analyzeRecruitmentOffer } from '../services/aiService';
import {
  Briefcase,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  FileCheck,
  Building,
  Info
} from 'lucide-react';

export const RecruitmentCheckerPage: React.FC = () => {
  const { setCurrentPage } = useAegis();

  const [offerText, setOfferText] = useState('');
  const [offerUrl, setOfferUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    riskScore: number;
    detectedIndicators: string[];
    explanation: string;
    recommendations: string[];
    disclaimer: string;
  } | null>(null);

  const sampleSuspiciousAd = `Urgent overseas hospitality assistant position in Dubai/Cambodia. High salary ₹1.5 Lakh/month with free food and visa. No education or experience required. Age 18-30 only. Immediate departure within 48 hours. Candidates must submit original passport and ₹25,000 security deposit for ticket processing. Company will provide company phone upon arrival. Contact Telegram: @OverseasQuickJobs.`;

  const handleAnalyze = async () => {
    if (!offerText.trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeRecruitmentOffer(offerText, offerUrl);
      setResult(data);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = () => {
    setOfferText(sampleSuspiciousAd);
    setOfferUrl('https://t.me/OverseasQuickJobs');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          Recruitment & Trafficking Risk Checker
        </h2>
        <p className="text-xs text-slate-400">
          Screen job advertisements, overseas offers, and messages for coercive exploitation red flags.
        </p>
      </div>

      {/* Product Principle Guardrail Notice */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
        <span className="font-semibold text-sky-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5" /> Product Principle: Coercion vs Autonomy
        </span>
        <p className="text-slate-400 leading-relaxed">
          Aegis does not treat consensual adult decisions as trafficking. The analysis specifically screens for coercion, passport retention, forced labor, financial debt bondage, isolation, and inability to safely exit.
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200">
            Paste Job Ad, WhatsApp Text, or Recruiter Message:
          </label>
          <button
            onClick={loadSample}
            className="text-[11px] text-indigo-400 hover:underline font-medium"
          >
            Load Sample Red-Flag Ad
          </button>
        </div>

        <textarea
          rows={5}
          value={offerText}
          onChange={(e) => setOfferText(e.target.value)}
          placeholder="Paste job description, salary terms, recruiter demands, or chat screenshots text here..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Job Posting URL or Recruiter Social Link (Optional)
          </label>
          <input
            type="url"
            value={offerUrl}
            onChange={(e) => setOfferUrl(e.target.value)}
            placeholder="e.g. https://t.me/recruiter or website link"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          id="btn-analyze-recruitment"
          disabled={isAnalyzing || !offerText.trim()}
          onClick={handleAnalyze}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition"
        >
          {isAnalyzing ? (
            <span>Analyzing Red Flags with AI...</span>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Screen for Exploitation & Deception Indicators</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Result */}
      {result && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Screening Results
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              result.riskLevel === 'CRITICAL'
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : result.riskLevel === 'HIGH'
                ? 'bg-orange-950 text-orange-300 border-orange-800'
                : result.riskLevel === 'MODERATE'
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }`}>
              {result.riskLevel} RISK (Score {result.riskScore}/100)
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Why This May Be Risky:</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.explanation}
            </p>
          </div>

          {/* Detected Flags */}
          {result.detectedIndicators.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Detected Red Flags ({result.detectedIndicators.length})
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {result.detectedIndicators.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-rose-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Protective Recommendations */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">
              Mandatory Protective Steps
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {result.recommendations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Government Verification Portals */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
        <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
          <Building className="w-4 h-4 text-sky-400" />
          Official Government Verification Tools
        </h4>
        <div className="space-y-2 text-slate-300">
          <a
            href="https://emigrate.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
          >
            <div>
              <div className="font-semibold text-white">eMigrate Portal (Ministry of External Affairs)</div>
              <div className="text-[11px] text-slate-400">Verify whether an overseas recruiting agency has an authentic MEA license</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
          >
            <div>
              <div className="font-semibold text-white">National Cyber Crime Reporting Portal</div>
              <div className="text-[11px] text-slate-400">Report fraudulent online recruitment scams or Telegram job cartels</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
