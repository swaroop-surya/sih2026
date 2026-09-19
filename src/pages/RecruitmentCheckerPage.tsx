import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { analyzeRecruitmentOffer } from '../services/aiService';
import {
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Search,
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
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="page-title">Recruitment Checker</h1>
        <p className="text-caption text-[14px] mt-1">
          Screen job advertisements, overseas offers, and messages for coercive exploitation red flags.
        </p>
      </div>

      {/* Product Principle Guardrail Notice */}
      <div className="p-3.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] text-[12px] text-[var(--text)] space-y-1">
        <span className="font-medium text-[var(--text)] flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 stroke-[1.75]" /> Principle: Coercion vs Autonomy
        </span>
        <p className="text-caption text-[12px] leading-relaxed">
          Abhaya does not treat consensual adult decisions as trafficking. The analysis specifically screens for coercion, passport retention, forced labor, financial debt bondage, isolation, and inability to safely exit.
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-3 p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)]">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-medium text-[var(--text)]">
            Job ad or recruiter message:
          </label>
          <button
            onClick={loadSample}
            className="text-[12px] text-[var(--primary)] hover:underline font-medium cursor-pointer"
          >
            Load sample red-flag ad
          </button>
        </div>

        <textarea
          rows={5}
          value={offerText}
          onChange={(e) => setOfferText(e.target.value)}
          placeholder="Paste job description, salary terms, recruiter demands, or chat screenshots text here..."
          className="soft-input w-full p-3 text-[13px]"
        />

        <div>
          <label className="block text-[12px] font-medium text-[var(--text)] mb-1">
            Job posting link (Optional)
          </label>
          <input
            type="url"
            value={offerUrl}
            onChange={(e) => setOfferUrl(e.target.value)}
            placeholder="e.g. https://t.me/recruiter or website link"
            className="soft-input w-full text-[13px]"
          />
        </div>

        <button
          id="btn-analyze-recruitment"
          disabled={isAnalyzing || !offerText.trim()}
          onClick={handleAnalyze}
          className="soft-btn soft-btn-primary w-full text-[13px]"
        >
          {isAnalyzing ? (
            <span>Analyzing red flags...</span>
          ) : (
            <>
              <Search className="w-4 h-4 mr-1.5 stroke-[1.75]" />
              <span>Screen for deception indicators</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Result */}
      {result && (
        <div className="rounded-[12px] bg-[var(--surface)] border border-[var(--line)] p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">
              Screening Results
            </span>
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
              result.riskLevel === 'CRITICAL'
                ? 'bg-[var(--sos)] text-white'
                : result.riskLevel === 'HIGH'
                ? 'bg-[var(--accent)] text-[#1A1F45]'
                : result.riskLevel === 'MODERATE'
                ? 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)]'
                : 'bg-[var(--safe)]/15 text-[var(--safe)]'
            }`}>
              {result.riskLevel} RISK (Score {result.riskScore}/100)
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-[14px] font-medium text-[var(--text)]">Assessment:</h4>
            <p className="text-caption text-[13px] leading-relaxed">
              {result.explanation}
            </p>
          </div>

          {/* Detected Flags */}
          {((result.detectedIndicators?.length || 0) > 0) && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-medium text-[var(--muted)] block uppercase">
                Detected Red Flags ({result.detectedIndicators?.length || 0})
              </span>
              <ul className="space-y-1.5 text-[12px]">
                {result.detectedIndicators?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[var(--surface-2)] p-2.5 rounded-[8px] text-[var(--text)]">
                    <AlertTriangle className="w-3.5 h-3.5 text-[var(--sos)] mt-0.5 shrink-0 stroke-[1.75]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Protective Recommendations */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-medium text-[var(--muted)] block uppercase">
              Protective Steps
            </span>
            <ul className="space-y-1.5 text-[12px]">
              {result.recommendations?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[var(--surface-2)] p-2.5 rounded-[8px] text-[var(--text)]">
                  <CheckCircle className="w-3.5 h-3.5 text-[var(--safe)] mt-0.5 shrink-0 stroke-[1.75]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Government Verification Portals */}
      <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-2.5 text-[13px]">
        <h4 className="font-medium text-[var(--text)] flex items-center gap-1.5">
          <Building className="w-4 h-4 stroke-[1.75]" />
          Official verification tools
        </h4>
        <div className="space-y-2">
          <a
            href="https://emigrate.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-[8px] bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] transition"
          >
            <div>
              <div className="font-medium text-[var(--text)] text-[13px]">eMigrate Portal (Ministry of External Affairs)</div>
              <div className="text-caption text-[11px]">Verify whether an overseas recruiting agency has an authentic MEA license</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--muted)] stroke-[1.75]" />
          </a>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-[8px] bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] transition"
          >
            <div>
              <div className="font-medium text-[var(--text)] text-[13px]">National Cyber Crime Reporting Portal</div>
              <div className="text-caption text-[11px]">Report fraudulent recruitment scams or Telegram job cartels</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--muted)] stroke-[1.75]" />
          </a>
        </div>
      </div>
    </div>
  );
};
