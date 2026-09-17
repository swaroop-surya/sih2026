import React from 'react';
import { useAegis } from '../hooks/useAegisState';
import {
  BarChart3,
  PieChart,
  ShieldCheck,
  Clock,
  AlertTriangle,
  TrendingUp,
  FileCheck,
  Lock
} from 'lucide-react';

export const AnalyticsDashboardPage: React.FC = () => {
  const { incidents, checkins, evidence, latestRiskResult } = useAegis();

  // Compute stats
  const totalIncidents = incidents.length;
  const completedCheckins = checkins.filter(c => c.status === 'SAFE').length;
  const totalCheckins = checkins.length;
  const checkinSuccessRate = totalCheckins > 0 ? Math.round((completedCheckins / totalCheckins) * 100) : 100;

  const categoryCounts: Record<string, number> = {};
  incidents.forEach(inc => {
    categoryCounts[inc.category] = (categoryCounts[inc.category] || 0) + 1;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-sky-400" />
          Safety Trends & Prevention Analytics
        </h2>
        <p className="text-xs text-slate-400">
          De-identified, aggregate situational insights and pattern telemetry.
        </p>
      </div>

      {/* Privacy Box */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Strict Zero-PII Policy: All aggregated charts are stripped of names, locations, and personal keys.</span>
      </div>

      {/* Key Metric Blocks */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Documented Incidents
          </span>
          <div className="text-2xl font-bold text-white">{totalIncidents}</div>
          <span className="text-[10px] text-slate-500">Indexed in chronological journal</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Check-In Success Rate
          </span>
          <div className="text-2xl font-bold text-emerald-400">{checkinSuccessRate}%</div>
          <span className="text-[10px] text-slate-500">{completedCheckins} of {totalCheckins} safely concluded</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Sealed Evidence Vault
          </span>
          <div className="text-2xl font-bold text-sky-400">{evidence.length}</div>
          <span className="text-[10px] text-slate-500">Cryptographically hashed items</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Current Risk Score
          </span>
          <div className={`text-2xl font-bold ${
            latestRiskResult?.level === 'CRITICAL' ? 'text-rose-400' :
            latestRiskResult?.level === 'HIGH' ? 'text-orange-400' :
            latestRiskResult?.level === 'MODERATE' ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {latestRiskResult ? `${latestRiskResult.score}/100` : 'Baseline'}
          </div>
          <span className="text-[10px] text-slate-500">{latestRiskResult?.level || 'LOW'} evaluated level</span>
        </div>
      </div>

      {/* Incident Category Distribution Bar Chart */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
        <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <PieChart className="w-3.5 h-3.5 text-sky-400" />
          Pattern Category Breakdown
        </h3>

        <div className="space-y-2">
          {Object.entries(categoryCounts).map(([cat, count]) => {
            const pct = Math.round((count / (totalIncidents || 1)) * 100);
            return (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="capitalize text-slate-300">{cat.replace('_', ' ')}</span>
                  <span className="font-semibold text-slate-200">{count} ({pct}%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prevention Insights */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2.5 text-xs text-slate-300">
        <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          Prevention & Early Detection Insights
        </h3>
        <ul className="space-y-1.5 text-[11px] text-slate-400 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 mt-1 shrink-0" />
            <span>Frequent recurring safety check-ins reduce delay in loved ones identifying missed arrivals by up to 85%.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 mt-1 shrink-0" />
            <span>Documenting chronological dates immediately strengthens 65B evidence certificates before memory fades or messages are deleted.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 mt-1 shrink-0" />
            <span>Never paying blackmail demands prevents cyber perpetrators from selling contact details to secondary extortion rings.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
