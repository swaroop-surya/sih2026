import React from 'react';
import { useAegis } from '../hooks/useAegisState';
import {
  Lock
} from 'lucide-react';

export const AnalyticsDashboardPage: React.FC = () => {
  const { incidents, checkins, evidence, latestRiskResult } = useAegis();

  // Compute stats safely
  const safeIncidents = incidents || [];
  const safeCheckins = checkins || [];
  const safeEvidence = evidence || [];
  const totalIncidents = safeIncidents.length;
  const completedCheckins = safeCheckins.filter(c => c.status === 'SAFE').length;
  const totalCheckins = safeCheckins.length;
  const checkinSuccessRate = totalCheckins > 0 ? Math.round((completedCheckins / totalCheckins) * 100) : 100;

  const categoryCounts: Record<string, number> = {};
  safeIncidents.forEach(inc => {
    categoryCounts[inc.category] = (categoryCounts[inc.category] || 0) + 1;
  });

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="page-title">Safety Analytics</h1>
        <p className="text-caption text-[14px] mt-1">
          De-identified situational insights and pattern telemetry.
        </p>
      </div>

      {/* Privacy Box */}
      <div className="p-3.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] flex items-center gap-2 text-[12px] text-[var(--text)]">
        <Lock className="w-4 h-4 text-[var(--safe)] shrink-0 stroke-[1.75]" />
        <span>Strict Zero-PII Policy: Aggregated charts are stripped of names and personal keys.</span>
      </div>

      {/* Key Metric Blocks */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-1">
          <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider block">
            Documented Incidents
          </span>
          <div className="text-[28px] font-heading font-semibold text-[var(--text)]">{totalIncidents}</div>
          <span className="text-caption text-[11px]">Indexed in chronological log</span>
        </div>

        <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-1">
          <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider block">
            Check-In Success Rate
          </span>
          <div className="text-[28px] font-heading font-semibold text-[var(--safe)]">{checkinSuccessRate}%</div>
          <span className="text-caption text-[11px]">{completedCheckins} of {totalCheckins} safely concluded</span>
        </div>

        <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-1">
          <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider block">
            Evidence Vault
          </span>
          <div className="text-[28px] font-heading font-semibold text-[var(--primary)]">{safeEvidence.length}</div>
          <span className="text-caption text-[11px]">Digitally fingerprinted items</span>
        </div>

        <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-1">
          <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider block">
            Current Risk Score
          </span>
          <div className={`text-[28px] font-heading font-semibold ${
            latestRiskResult?.level === 'CRITICAL' ? 'text-[var(--sos)]' :
            latestRiskResult?.level === 'HIGH' ? 'text-[var(--accent)]' :
            latestRiskResult?.level === 'MODERATE' ? 'text-[var(--accent)]' : 'text-[var(--safe)]'
          }`}>
            {latestRiskResult ? `${latestRiskResult.score}/100` : '0/100'}
          </div>
          <span className="text-caption text-[11px]">{latestRiskResult?.level || 'LOW'} evaluated level</span>
        </div>
      </div>

      {/* Incident Category Distribution Bar Chart */}
      <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-3 text-[13px]">
        <h3 className="section-title text-[15px]">
          Pattern breakdown
        </h3>

        <div className="space-y-2.5">
          {Object.entries(categoryCounts).map(([cat, count]) => {
            const pct = Math.round((count / (totalIncidents || 1)) * 100);
            return (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-[12px]">
                  <span className="capitalize text-[var(--text)]">{cat.replace('_', ' ')}</span>
                  <span className="font-medium text-[var(--muted)]">{count} ({pct}%)</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--surface-2)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prevention Insights */}
      <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-2 text-[13px]">
        <h3 className="section-title text-[15px]">
          Prevention notes
        </h3>
        <ul className="space-y-2 text-caption text-[12px] leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
            <span>Recurring safety check-ins reduce delay in loved ones identifying missed arrivals.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
            <span>Documenting dates immediately strengthens evidence records before memory fades or messages are deleted.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
            <span>Never paying blackmail demands prevents perpetrators from escalating extortion attempts.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
