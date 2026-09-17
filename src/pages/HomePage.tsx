import React, { useState, useRef } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../context/ThemeContext';
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
  const { isCream } = useTheme();
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
      <div
        className={`flex items-center justify-between p-3.5 rounded-2xl transition ${
          isCream
            ? 'bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]'
            : 'bg-[#0a0a0a] border border-[#FDFBD4]/30'
        }`}
      >
        <div>
          <div className="flex items-center gap-1.5">
            <h2
              className={`text-base font-bold tracking-tight ${
                isCream ? 'text-black' : 'text-[#FDFBD4]'
              }`}
            >
              Hello, {profile.name || 'Protected User'}
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${isCream ? 'text-[#333333]' : 'text-slate-400'}`}>
            Safety Shield:{' '}
            <span className={isCream ? 'text-emerald-700 font-bold' : 'text-emerald-400 font-medium'}>
              Active & Monitoring
            </span>
          </p>
        </div>

        {/* Quick link to AI Advisor */}
        <button
          onClick={() => setCurrentPage('ai-assistant')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
            isCream
              ? 'bg-[#FDFBD4] border border-black text-black hover:bg-black hover:text-[#FDFBD4]'
              : 'bg-[#181814] border border-[#FDFBD4]/40 text-[#FDFBD4] hover:bg-[#FDFBD4] hover:text-black'
          }`}
          title="Open AI Safety Advisor"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Advisor</span>
        </button>
      </div>

      {/* Download Aegis to Mobile Banner */}
      <PWAInstallButton variant="banner" />

      {/* Main 4 Action Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* CARD 1: CHECK MY RISK */}
        <button
          id="btn-home-check-risk"
          onClick={() => setCurrentPage('risk-check')}
          className={`flex flex-col justify-between p-3.5 rounded-2xl text-left group transition active:scale-[0.98] min-h-[142px] ${
            isCream
              ? 'bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]'
              : 'bg-[#0a0a0a] border border-[#FDFBD4]/40 hover:border-[#FDFBD4] shadow-md'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center border transition ${
                isCream
                  ? 'bg-[#FDFBD4] border-black text-black'
                  : 'bg-[#1a1a15] border-[#FDFBD4]/30 text-[#FDFBD4]'
              }`}
            >
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            {latestRiskResult ? (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  isCream
                    ? 'bg-black text-[#FDFBD4] border-black'
                    : 'bg-[#181814] text-[#FDFBD4] border-[#FDFBD4]/40'
                }`}
              >
                {latestRiskResult.level}
              </span>
            ) : (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  isCream
                    ? 'bg-[#FDFBD4] text-black border-black'
                    : 'bg-[#181814] text-[#FDFBD4] border-[#FDFBD4]/40'
                }`}
              >
                ASSESS
              </span>
            )}
          </div>
          <div>
            <span
              className={`text-xs font-bold tracking-wide block uppercase ${
                isCream ? 'text-black' : 'text-[#FDFBD4]'
              }`}
            >
              {t.checkMyRisk}
            </span>
            <span className={`text-[11px] mt-0.5 block leading-tight ${isCream ? 'text-[#333333]' : 'text-slate-400'}`}>
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
          className={`relative overflow-hidden flex flex-col justify-between p-3.5 rounded-2xl text-left select-none cursor-pointer transition active:scale-[0.98] min-h-[142px] ${
            isCream
              ? 'bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]'
              : 'bg-[#0d0507] border-2 border-rose-600/70 shadow-lg'
          }`}
        >
          {/* Progress fill during hold */}
          {isHoldingEmergency && (
            <div
              className={`absolute inset-0 transition-all pointer-events-none ${
                isCream ? 'bg-rose-500/25' : 'bg-rose-600/40'
              }`}
              style={{ width: `${holdProgress}%` }}
            />
          )}

          <div className="flex items-center justify-between w-full mb-2 relative z-10">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center border ${
                isCream
                  ? 'bg-rose-600 border-black text-white'
                  : 'bg-rose-600/30 border-rose-500/50 text-rose-400'
              }`}
            >
              <AlertOctagon className="w-5 h-5 animate-pulse stroke-[2.2]" />
            </div>
            <span
              className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
                isCream
                  ? 'bg-black text-white border-black'
                  : 'bg-rose-950 text-[#FDFBD4] border-rose-700'
              }`}
            >
              HOLD 1.5s
            </span>
          </div>

          <div className="relative z-10">
            <span
              className={`text-xs font-extrabold tracking-wide block uppercase ${
                isCream ? 'text-rose-700' : 'text-rose-200'
              }`}
            >
              {t.imInDanger}
            </span>
            <span
              className={`text-[11px] mt-0.5 block leading-tight font-medium ${
                isCream ? 'text-[#333333]' : 'text-rose-300/80'
              }`}
            >
              {isHoldingEmergency ? 'Keep holding...' : 'Press and hold to trigger SOS'}
            </span>
          </div>
        </div>

        {/* CARD 3: REPORT / RECORD INCIDENT */}
        <button
          id="btn-home-record-incident"
          onClick={() => setCurrentPage('incidents')}
          className={`flex flex-col justify-between p-3.5 rounded-2xl text-left group transition active:scale-[0.98] min-h-[142px] ${
            isCream
              ? 'bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]'
              : 'bg-[#0a0a0a] border border-[#FDFBD4]/40 hover:border-[#FDFBD4] shadow-md'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center border transition ${
                isCream
                  ? 'bg-[#FDFBD4] border-black text-black'
                  : 'bg-[#1a1a15] border-[#FDFBD4]/30 text-[#FDFBD4]'
              }`}
            >
              <FileEdit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                isCream
                  ? 'bg-black/5 text-black border-black/20'
                  : 'bg-white/5 text-[#FDFBD4] border-[#FDFBD4]/20'
              }`}
            >
              {incidents.length} Logged
            </span>
          </div>
          <div>
            <span
              className={`text-xs font-bold tracking-wide block uppercase ${
                isCream ? 'text-black' : 'text-[#FDFBD4]'
              }`}
            >
              {t.recordIncident}
            </span>
            <span className={`text-[11px] mt-0.5 block leading-tight ${isCream ? 'text-[#333333]' : 'text-slate-400'}`}>
              Journal & hash timestamped evidence
            </span>
          </div>
        </button>

        {/* CARD 4: SAFETY CHECK-IN */}
        <button
          id="btn-home-safety-checkin"
          onClick={() => setCurrentPage('checkin')}
          className={`flex flex-col justify-between p-3.5 rounded-2xl text-left group transition active:scale-[0.98] min-h-[142px] ${
            isCream
              ? 'bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]'
              : 'bg-[#0a0a0a] border border-[#FDFBD4]/40 hover:border-[#FDFBD4] shadow-md'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center border transition ${
                isCream
                  ? 'bg-[#FDFBD4] border-black text-black'
                  : 'bg-[#1a1a15] border-[#FDFBD4]/30 text-[#FDFBD4]'
              }`}
            >
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            {activeCheckin ? (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border animate-pulse ${
                  isCream
                    ? 'bg-amber-500 text-black border-black'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}
              >
                RUNNING
              </span>
            ) : (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  isCream
                    ? 'bg-black/5 text-black border-black/20'
                    : 'bg-white/5 text-[#FDFBD4] border-[#FDFBD4]/20'
                }`}
              >
                Timer
              </span>
            )}
          </div>
          <div>
            <span
              className={`text-xs font-bold tracking-wide block uppercase ${
                isCream ? 'text-black' : 'text-[#FDFBD4]'
              }`}
            >
              {t.safetyCheckin}
            </span>
            <span className={`text-[11px] mt-0.5 block leading-tight ${isCream ? 'text-[#333333]' : 'text-slate-400'}`}>
              {activeCheckin ? 'Check-in currently active' : 'Commute & meeting timers'}
            </span>
          </div>
        </button>
      </div>

      {/* Quick Direct Helplines Bar (India 112 & 181) - Cleanly Aligned & Structured */}
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href="tel:112"
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition active:scale-[0.98] ${
            isCream
              ? 'bg-white border-2 border-black text-black shadow-[1px_1px_0px_0px_#000] hover:bg-[#FDFBD4]'
              : 'bg-[#0a0a0a] border border-[#FDFBD4]/30 text-[#FDFBD4] hover:border-[#FDFBD4]'
          }`}
          title="Call 112 National Emergency"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${
                isCream ? 'bg-black text-[#FDFBD4]' : 'bg-[#FDFBD4] text-black'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs leading-none truncate">112 Police</p>
              <p className={`text-[9px] mt-1 leading-none ${isCream ? 'text-[#444444]' : 'text-slate-400'}`}>
                Emergency
              </p>
            </div>
          </div>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 whitespace-nowrap ml-1 ${
              isCream ? 'bg-black/5 text-black border border-black/10' : 'bg-white/10 text-[#FDFBD4]'
            }`}
          >
            24x7
          </span>
        </a>

        <a
          href="tel:181"
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition active:scale-[0.98] ${
            isCream
              ? 'bg-white border-2 border-black text-black shadow-[1px_1px_0px_0px_#000] hover:bg-[#FDFBD4]'
              : 'bg-[#0a0a0a] border border-[#FDFBD4]/30 text-[#FDFBD4] hover:border-[#FDFBD4]'
          }`}
          title="Call 181 Women Helpline"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${
                isCream ? 'bg-black text-[#FDFBD4]' : 'bg-[#FDFBD4] text-black'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs leading-none truncate">181 Women</p>
              <p className={`text-[9px] mt-1 leading-none ${isCream ? 'text-[#444444]' : 'text-slate-400'}`}>
                Helpline
              </p>
            </div>
          </div>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 whitespace-nowrap ml-1 ${
              isCream ? 'bg-black/5 text-black border border-black/10' : 'bg-white/10 text-[#FDFBD4]'
            }`}
          >
            Free
          </span>
        </a>
      </div>

      {/* Recruitment & Job Offer Analyzer Banner */}
      <div
        id="banner-home-recruitment-checker"
        onClick={() => setCurrentPage('recruitment-checker')}
        className={`cursor-pointer p-3.5 rounded-2xl border transition flex items-center justify-between ${
          isCream
            ? 'bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]'
            : 'bg-[#0a0a0a] border border-[#FDFBD4]/40 hover:border-[#FDFBD4]'
        }`}
      >
        <div className="space-y-0.5">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider block ${
              isCream ? 'text-black' : 'text-[#FDFBD4]'
            }`}
          >
            Exploitation Prevention
          </span>
          <h3 className={`text-xs font-bold ${isCream ? 'text-black' : 'text-white'}`}>
            Trafficking & Recruitment Risk Checker
          </h3>
          <p className={`text-[11px] ${isCream ? 'text-[#333333]' : 'text-slate-400'}`}>
            Paste job ads or travel offers to screen for red flags
          </p>
        </div>
        <ChevronRight className={`w-4 h-4 shrink-0 ${isCream ? 'text-black' : 'text-[#FDFBD4]'}`} />
      </div>

      {/* Additional Section: My Safety Plan */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3
            className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isCream ? 'text-black' : 'text-[#FDFBD4]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            {t.mySafetyPlan}
          </h3>
          <button
            onClick={() => setCurrentPage('safety-plan')}
            className={`text-[11px] font-bold hover:underline flex items-center gap-0.5 ${
              isCream ? 'text-black' : 'text-[#FDFBD4]'
            }`}
          >
            Manage <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div
          onClick={() => setCurrentPage('safety-plan')}
          className={`cursor-pointer p-3 rounded-2xl flex items-center justify-between transition ${
            isCream
              ? 'bg-white border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]'
              : 'bg-[#0a0a0a] border border-[#FDFBD4]/30 text-white hover:border-[#FDFBD4]'
          }`}
        >
          <div>
            <div className={`text-xs font-bold ${isCream ? 'text-black' : 'text-[#FDFBD4]'}`}>
              Preparedness Status: {completedPlanCount} of {safetyPlan.length} Complete
            </div>
            <p className={`text-[11px] mt-0.5 ${isCream ? 'text-[#333333]' : 'text-slate-400'}`}>
              Documents backup, safe routes, emergency fund & secret exit bag
            </p>
          </div>
          <div
            className={`h-2.5 w-16 rounded-full overflow-hidden shrink-0 ml-3 border ${
              isCream ? 'bg-[#FDFBD4] border-black' : 'bg-neutral-800 border-[#FDFBD4]/20'
            }`}
          >
            <div
              className={`h-full rounded-full ${isCream ? 'bg-black' : 'bg-[#FDFBD4]'}`}
              style={{ width: `${(completedPlanCount / safetyPlan.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Additional Section: Trusted Circle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3
            className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isCream ? 'text-black' : 'text-[#FDFBD4]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {t.trustedCircle} ({contacts.length})
          </h3>
          <button
            onClick={() => setCurrentPage('profile')}
            className={`text-[11px] font-bold hover:underline flex items-center gap-0.5 ${
              isCream ? 'text-black' : 'text-[#FDFBD4]'
            }`}
          >
            View Circle <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {contacts.slice(0, 2).map((contact) => (
            <div
              key={contact.id}
              className={`p-2.5 rounded-xl space-y-1 text-xs border ${
                isCream
                  ? 'bg-white border-2 border-black text-black shadow-[1px_1px_0px_0px_#000]'
                  : 'bg-[#0a0a0a] border border-[#FDFBD4]/30 text-white'
              }`}
            >
              <div className={`font-bold truncate ${isCream ? 'text-black' : 'text-[#FDFBD4]'}`}>
                {contact.name}
              </div>
              <div className={`text-[11px] ${isCream ? 'text-[#444444]' : 'text-slate-400'}`}>
                {contact.relationship}
              </div>
              <div
                className={`text-[10px] font-semibold flex items-center gap-1 ${
                  isCream ? 'text-emerald-700' : 'text-emerald-400'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {contact.notifyOnSOS ? 'SOS Alert Enabled' : 'Secondary'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Section: Recent Incidents */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3
            className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isCream ? 'text-black' : 'text-[#FDFBD4]'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            {t.recentIncidents}
          </h3>
          <button
            onClick={() => setCurrentPage('incidents')}
            className={`text-[11px] font-bold hover:underline flex items-center gap-0.5 ${
              isCream ? 'text-black' : 'text-[#FDFBD4]'
            }`}
          >
            All Logs <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {incidents.length === 0 ? (
          <div
            className={`p-4 rounded-xl border text-center text-xs ${
              isCream
                ? 'bg-white border-2 border-black text-[#444444] shadow-[1px_1px_0px_0px_#000]'
                : 'bg-[#0a0a0a] border border-[#FDFBD4]/20 text-slate-400'
            }`}
          >
            No incidents recorded. You are safe.
          </div>
        ) : (
          <div className="space-y-2">
            {incidents.slice(0, 2).map((inc) => (
              <div
                key={inc.id}
                onClick={() => setCurrentPage('incidents')}
                className={`cursor-pointer p-3 rounded-xl border transition text-xs space-y-1 ${
                  isCream
                    ? 'bg-white border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-[#0a0a0a] border border-[#FDFBD4]/30 text-white hover:border-[#FDFBD4]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold capitalize ${isCream ? 'text-black' : 'text-[#FDFBD4]'}`}>
                    {inc.category.replace('_', ' ')}
                  </span>
                  <span className={`text-[10px] ${isCream ? 'text-[#444444]' : 'text-slate-400'}`}>
                    {formatDate(inc.timestamp)}
                  </span>
                </div>
                <p className={`text-[11px] line-clamp-2 leading-relaxed ${isCream ? 'text-[#333333]' : 'text-slate-400'}`}>
                  {inc.description}
                </p>
                <div className={`flex items-center gap-2 pt-1 text-[10px] ${isCream ? 'text-[#444444]' : 'text-slate-400'}`}>
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
        <h3
          className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isCream ? 'text-black' : 'text-[#FDFBD4]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          {t.learnPrevent}
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div
            onClick={() => setCurrentPage('cyber-safety')}
            className={`cursor-pointer p-3 rounded-xl border transition space-y-1 ${
              isCream
                ? 'bg-white border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-[#0a0a0a] border border-[#FDFBD4]/30 text-white hover:border-[#FDFBD4]'
            }`}
          >
            <span className={`font-bold block ${isCream ? 'text-black' : 'text-[#FDFBD4]'}`}>
              Cyber Blackmail
            </span>
            <p className={`text-[10px] leading-tight ${isCream ? 'text-[#333333]' : 'text-slate-400'}`}>
              Steps to preserve digital headers & StopNCII hash protocol
            </p>
          </div>

          <div
            onClick={() => setCurrentPage('location-safety')}
            className={`cursor-pointer p-3 rounded-xl border transition space-y-1 ${
              isCream
                ? 'bg-white border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-[#0a0a0a] border border-[#FDFBD4]/30 text-white hover:border-[#FDFBD4]'
            }`}
          >
            <span className={`font-bold block ${isCream ? 'text-black' : 'text-[#FDFBD4]'}`}>
              Safe Havens
            </span>
            <p className={`text-[10px] leading-tight ${isCream ? 'text-[#333333]' : 'text-slate-400'}`}>
              One Stop Sakhi Centres & 24/7 verified police desks
            </p>
          </div>
        </div>
      </div>

      {/* Presentation Demo Scenario Switcher (Requested for judges/reviewers) */}
      <div className={`pt-2 border-t ${isCream ? 'border-black/20' : 'border-[#FDFBD4]/20'}`}>
        <div
          className={`p-3 rounded-xl border space-y-2 ${
            isCream
              ? 'bg-white border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]'
              : 'bg-[#0a0a0a] border border-[#FDFBD4]/30 text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                isCream ? 'text-black' : 'text-[#FDFBD4]'
              }`}
            >
              <Sparkles className="w-3 h-3" /> Evaluator / Judge Demo Scenarios
            </span>
            <span className={`text-[10px] ${isCream ? 'text-[#444444]' : 'text-slate-400'}`}>
              Walkthrough
            </span>
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
                className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                  activeDemoScenarioId === sc.id
                    ? isCream
                      ? 'bg-black text-[#FDFBD4] border-black'
                      : 'bg-[#FDFBD4] text-black border-[#FDFBD4]'
                    : isCream
                    ? 'bg-[#FDFBD4] border-black text-black hover:bg-black hover:text-[#FDFBD4]'
                    : 'bg-[#181814] border-[#FDFBD4]/30 text-slate-300 hover:border-[#FDFBD4]'
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
