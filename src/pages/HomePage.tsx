import React, { useState, useRef } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { useTranslation } from '../hooks/useTranslation';
import {
  ShieldAlert,
  AlertOctagon,
  ShieldCheck,
  FileEdit,
  Clock,
  ChevronRight,
  Users,
  CheckSquare,
  LifeBuoy,
  BookOpen,
  ArrowRight,
  ExternalLink,
  PhoneCall,
  Sparkles,
  Bot
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import { PWAInstallButton } from '../components/common/PWAInstallButton';

export const HomePage: React.FC = () => {
  const {
    profile,
    setCurrentPage,
    startSOS,
    latestRiskResult,
    safetyPlan,
    contacts,
    incidents,
    checkins,
    activeDemoScenarioId,
    loadDemoScenario
  } = useAegis();
  const { t } = useTranslation();

  // Hold-to-activate emergency interaction to prevent accidental taps
  const [isHoldingEmergency, setIsHoldingEmergency] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setIsHoldingEmergency(true);
    setHoldProgress(0);
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds hold required

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current!);
        setIsHoldingEmergency(false);
        setHoldProgress(0);
        startSOS(false, 'Activated from Home Dashboard hold gesture');
      }
    }, 30);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setIsHoldingEmergency(false);
    setHoldProgress(0);
  };

  const completedPlanCount = safetyPlan.filter(p => p.isCompleted).length;
  const activeCheckin = checkins.find(c => c.status === 'ACTIVE');

  return (
    <div className="space-y-4">
      {/* Top Greeting & Safety Status */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800/80 p-3.5 rounded-2xl">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-bold text-white tracking-tight">
              Hello, {profile.name || 'Protected User'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Safety Shield: <span className="text-emerald-400 font-medium">Active & Monitoring</span>
          </p>
        </div>

        {/* Quick link to AI Advisor */}
        <button
          onClick={() => setCurrentPage('ai-assistant')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-800/50 text-sky-300 text-xs font-semibold transition"
          title="Open AI Safety Advisor"
        >
          <Bot className="w-3.5 h-3.5 text-sky-400" />
          <span>AI Advisor</span>
        </button>
      </div>

      {/* Download Aegis to Mobile Banner */}
      <PWAInstallButton variant="banner" />

      {/* Main 4 Action Cards Requested */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* CARD 1: CHECK MY RISK */}
        <button
          id="btn-home-check-risk"
          onClick={() => setCurrentPage('risk-check')}
          className="flex flex-col justify-between p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-sky-900/40 hover:border-sky-700/60 transition text-left group shadow-sm active:scale-[0.98]"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            {latestRiskResult && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                latestRiskResult.level === 'LOW'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                  : latestRiskResult.level === 'MODERATE'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                  : 'bg-rose-950 text-rose-300 border border-rose-800/50'
              }`}>
                {latestRiskResult.level}
              </span>
            )}
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wide block uppercase">
              {t.checkMyRisk}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block leading-tight">
              Evaluate early warning signs & coercion
            </span>
          </div>
        </button>

        {/* CARD 2: I'M IN DANGER (HOLD TO ACTIVATE) */}
        <div
          id="card-home-danger-sos"
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          className="relative overflow-hidden flex flex-col justify-between p-3.5 rounded-2xl bg-gradient-to-br from-rose-950/80 to-slate-900 border border-rose-700/50 text-left select-none cursor-pointer transition shadow-lg active:scale-[0.98]"
        >
          {/* Progress fill during hold */}
          {isHoldingEmergency && (
            <div
              className="absolute inset-0 bg-rose-600/40 transition-all pointer-events-none"
              style={{ width: `${holdProgress}%` }}
            />
          )}

          <div className="flex items-center justify-between w-full mb-3 relative z-10">
            <div className="h-9 w-9 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold bg-rose-900/60 text-rose-200 border border-rose-700 px-1.5 py-0.5 rounded">
              HOLD 1.5s
            </span>
          </div>

          <div className="relative z-10">
            <span className="text-xs font-bold text-rose-200 tracking-wide block uppercase">
              {t.imInDanger}
            </span>
            <span className="text-[11px] text-rose-300/80 mt-0.5 block leading-tight">
              {isHoldingEmergency ? 'Keep holding...' : 'Press and hold to trigger SOS'}
            </span>
          </div>
        </div>

        {/* CARD 3: REPORT / RECORD INCIDENT */}
        <button
          id="btn-home-record-incident"
          onClick={() => setCurrentPage('incidents')}
          className="flex flex-col justify-between p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 hover:border-slate-700 transition text-left group shadow-sm active:scale-[0.98]"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileEdit className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {incidents.length} Logged
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wide block uppercase">
              {t.recordIncident}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block leading-tight">
              Journal & hash timestamped evidence
            </span>
          </div>
        </button>

        {/* CARD 4: SAFETY CHECK-IN */}
        <button
          id="btn-home-safety-checkin"
          onClick={() => setCurrentPage('checkin')}
          className="flex flex-col justify-between p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-amber-900/40 hover:border-amber-700/60 transition text-left group shadow-sm active:scale-[0.98]"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            {activeCheckin ? (
              <span className="text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/60 px-1.5 py-0.5 rounded animate-pulse">
                RUNNING
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium">Timer</span>
            )}
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wide block uppercase">
              {t.safetyCheckin}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block leading-tight">
              {activeCheckin ? 'Check-in currently active' : 'Commute & meeting timers'}
            </span>
          </div>
        </button>
      </div>

      {/* Quick Direct Helplines Bar (India 112 & 181) */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <a
          href="tel:112"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition"
        >
          <span className="font-semibold flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
            112 Police
          </span>
          <span className="text-[10px] text-slate-400">24x7 Call</span>
        </a>

        <a
          href="tel:181"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition"
        >
          <span className="font-semibold flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            181 Women Line
          </span>
          <span className="text-[10px] text-slate-400">Toll-Free</span>
        </a>
      </div>

      {/* Recruitment & Job Offer Analyzer Banner */}
      <div
        onClick={() => setCurrentPage('recruitment-checker')}
        className="cursor-pointer p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-900/40 hover:border-indigo-700/60 transition flex items-center justify-between"
      >
        <div className="space-y-0.5">
          <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block">
            Exploitation Prevention
          </span>
          <h3 className="text-xs font-bold text-white">Trafficking & Recruitment Risk Checker</h3>
          <p className="text-[11px] text-slate-400">Paste job ads or travel offers to screen for red flags</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {/* Additional Section: My Safety Plan */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-sky-400" />
            {t.mySafetyPlan}
          </h3>
          <button
            onClick={() => setCurrentPage('safety-plan')}
            className="text-[11px] font-semibold text-sky-400 hover:underline flex items-center gap-0.5"
          >
            Manage <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div
          onClick={() => setCurrentPage('safety-plan')}
          className="cursor-pointer bg-slate-900/70 border border-slate-800 p-3 rounded-xl flex items-center justify-between hover:bg-slate-900 transition"
        >
          <div>
            <div className="text-xs font-semibold text-white">
              Preparedness Status: {completedPlanCount} of {safetyPlan.length} Complete
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Documents backup, safe routes, emergency fund & secret exit bag
            </p>
          </div>
          <div className="h-2 w-16 bg-slate-800 rounded-full overflow-hidden shrink-0 ml-3">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${(completedPlanCount / safetyPlan.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Additional Section: Trusted Circle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            {t.trustedCircle} ({contacts.length})
          </h3>
          <button
            onClick={() => setCurrentPage('profile')}
            className="text-[11px] font-semibold text-sky-400 hover:underline flex items-center gap-0.5"
          >
            View Circle <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {contacts.slice(0, 2).map((contact) => (
            <div
              key={contact.id}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs"
            >
              <div className="font-semibold text-white truncate">{contact.name}</div>
              <div className="text-[11px] text-slate-400">{contact.relationship}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {contact.notifyOnSOS ? 'SOS Alert Enabled' : 'Secondary'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Section: Recent Incidents */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <FileEdit className="w-3.5 h-3.5 text-sky-400" />
            {t.recentIncidents}
          </h3>
          <button
            onClick={() => setCurrentPage('incidents')}
            className="text-[11px] font-semibold text-sky-400 hover:underline flex items-center gap-0.5"
          >
            All Logs <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {incidents.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-center text-xs text-slate-400">
            No incidents recorded. You are safe.
          </div>
        ) : (
          <div className="space-y-2">
            {incidents.slice(0, 2).map((inc) => (
              <div
                key={inc.id}
                onClick={() => setCurrentPage('incidents')}
                className="cursor-pointer p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 capitalize">
                    {inc.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400">{formatDate(inc.timestamp)}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {inc.description}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
                  <span>Severity: {inc.severity}/5</span>
                  <span>•</span>
                  <span>{inc.evidenceIds?.length || 0} Evidence Files</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Section: Learn & Prevent */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          {t.learnPrevent}
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div
            onClick={() => setCurrentPage('cyber-safety')}
            className="cursor-pointer p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-1"
          >
            <span className="font-semibold text-slate-200 block">Cyber Blackmail</span>
            <p className="text-[10px] text-slate-400 leading-tight">
              Steps to preserve digital headers & StopNCII hash protocol
            </p>
          </div>

          <div
            onClick={() => setCurrentPage('location-safety')}
            className="cursor-pointer p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-1"
          >
            <span className="font-semibold text-slate-200 block">Safe Havens</span>
            <p className="text-[10px] text-slate-400 leading-tight">
              One Stop Sakhi Centres & 24/7 verified police desks
            </p>
          </div>
        </div>
      </div>

      {/* Presentation Demo Scenario Switcher (Requested for judges/reviewers) */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Evaluator / Judge Demo Scenarios
            </span>
            <span className="text-[10px] text-slate-400">Walkthrough</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'scenario_stalking', label: '1. Stalking' },
              { id: 'scenario_domestic', label: '2. Coercive Control' },
              { id: 'scenario_recruitment', label: '3. Job Scam' },
              { id: 'scenario_blackmail', label: '4. Cyber Blackmail' },
              { id: 'scenario_emergency', label: '5. Immediate SOS' },
            ].map(sc => (
              <button
                key={sc.id}
                onClick={() => loadDemoScenario(sc.id)}
                className={`text-[10px] font-medium px-2 py-1 rounded-lg border transition ${
                  activeDemoScenarioId === sc.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
