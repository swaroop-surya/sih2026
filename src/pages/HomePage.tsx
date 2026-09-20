import React, { useState, useRef } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { useTranslation } from '../hooks/useTranslation';
import { useVoiceTrigger } from '../context/VoiceTriggerContext';
import {
  ShieldAlert,
  ChevronRight,
  PhoneCall,
  Clock,
  FilePlus2,
  CheckCircle2,
  Lock,
  Compass,
  Plus,
  Sparkles
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import { KolamRosette } from '../components/common/KolamRosette';

export const HomePage: React.FC = () => {
  const {
    profile,
    setCurrentPage,
    initiateSOSCountdown,
    latestRiskResult,
    safetyPlan,
    toggleSafetyPlanItem,
    contacts,
    incidents,
    checkins
  } = useAegis();
  const { t } = useTranslation();
  const { isListening, startListening, stopListening, setIsModalOpen } = useVoiceTrigger();

  // Hold-to-activate 1.5s SOS logic
  const [isHoldingSOS, setIsHoldingSOS] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setIsHoldingSOS(true);
    setHoldProgress(0);
    const startTime = Date.now();
    const duration = 1500; // 1.5s hold duration

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setIsHoldingSOS(false);
        setHoldProgress(0);
        initiateSOSCountdown(false, 'Activated from Home Dashboard hold gesture');
      }
    }, 30);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setIsHoldingSOS(false);
    setHoldProgress(0);
  };

  const safePlan = safetyPlan || [];
  const safeCheckins = checkins || [];
  const safeContacts = contacts || [];
  const completedPlanCount = safePlan.filter(p => p.isCompleted).length;
  const totalPlanCount = safePlan.length || 7;
  const nextPlanItem = safePlan.find(p => !p.isCompleted);
  const activeCheckin = safeCheckins.find(c => c.status === 'ACTIVE');

  // Extract first name
  const firstName = profile.name ? profile.name.split(' ')[0] : 'there';

  return (
    <div className="relative space-y-8 pb-8">
      {/* Faint pulli pattern (diamond lattice of dots at 6% opacity) behind the Home header */}
      <div className="absolute top-0 left-[-16px] right-[-16px] h-52 pulli-lattice pointer-events-none" />

      {/* 1. Status Section: "Hi, {first name}", "You're covered.", clean status indicators */}
      <section id="home-status-card" className="relative pt-1">
        <h1 className="text-[28px] font-heading font-semibold text-[var(--text)] leading-tight">
          Hi, {firstName}
        </h1>
        <p className="text-[16px] font-medium text-[var(--safe)] mt-1">
          {t.protectionIsOn || "You're covered."}
        </p>

        {/* Status items */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {/* Location status */}
          <div className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-[var(--surface-2)] text-[var(--text)] text-[13px]">
            <span className="w-2 h-2 rounded-full bg-[var(--safe)]" />
            <span>{t.locationChip || 'Location'}: {t.statusOn || 'On'}</span>
          </div>

          {/* Voice trigger status */}
          <button
            onClick={() => {
              if (isListening) stopListening();
              else startListening().catch(() => setIsModalOpen(true));
            }}
            className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface)] text-[var(--text)] text-[13px] border border-[var(--line)] transition cursor-pointer"
            aria-label="Voice safe word status"
          >
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-[var(--safe)]' : 'bg-[var(--muted)]'}`} />
            <span>
              {t.voiceTriggerChip || 'Voice safe word'}: {isListening ? (t.statusListening || 'Listening') : (t.statusOff || 'Off')}
            </span>
          </button>

          {/* Contacts status */}
          <button
            onClick={() => setCurrentPage('profile')}
            className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface)] text-[var(--text)] text-[13px] border border-[var(--line)] transition cursor-pointer"
            aria-label="Trusted contacts status"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--safe)]" />
            <span>{t.trustedCircle || 'Trusted contacts'}: {safeContacts.length}</span>
          </button>
        </div>
      </section>

      {/* 2. THE ONE MEMORABLE ELEMENT: SOS ROSETTE
          Kolam-style rosette in 200x200 viewBox. Faint static copy in --line.
          While user holds SOS, animate stroke-dashoffset from 1 to 0 in accent color (marigold).
          If user releases early, it undraws. No ambient breathing rings. */}
      <section id="home-sos-hero" className="flex flex-col items-center justify-center py-2 text-center select-none">
        <div className="relative flex items-center justify-center w-[210px] h-[210px]">
          {/* Kolam Rosette SVG */}
          <KolamRosette
            progress={holdProgress / 100}
            size={210}
            isHolding={isHoldingSOS}
            className="absolute inset-0"
          />

          {/* Kumkum Red SOS Button (140px) */}
          <button
            id="btn-home-sos-hold"
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            onTouchCancel={cancelHold}
            className="relative z-10 w-[140px] h-[140px] rounded-full bg-[var(--sos)] text-white flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer focus:outline-none"
            aria-label="Emergency SOS - Hold for 1.5 seconds"
          >
            <span className="font-heading text-[38px] font-bold tracking-wider leading-none">
              SOS
            </span>
          </button>
        </div>

        {/* Captions in plain language */}
        <p className="text-[16px] font-semibold text-[var(--text)] mt-4">
          {t.holdHeroCaption || 'Hold for 1.5s to trigger SOS'}
        </p>
        <p className="text-caption text-[13px] mt-1 max-w-xs">
          {t.holdHeroMuted || 'Alerts your trusted contacts with your live location.'}
        </p>
      </section>

      {/* 3. "Something feels off?" (Check my risk) - Filled container 1 */}
      <section>
        <button
          id="btn-home-check-risk"
          onClick={() => setCurrentPage('risk-check')}
          className="soft-card w-full p-4 flex items-center justify-between gap-3 text-left hover:border-[var(--accent)] transition cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <ShieldAlert className="w-5 h-5 text-[var(--text)] shrink-0 stroke-[1.75]" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="card-title text-[16px]">
                  {t.pageTitleCheckMyRisk || 'Something feels off?'}
                </span>
                {latestRiskResult && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                      latestRiskResult.level === 'LOW'
                        ? 'bg-[var(--safe)] text-[var(--on-safe)]'
                        : latestRiskResult.level === 'MODERATE'
                        ? 'bg-[var(--accent)] text-[#1A1F45]'
                        : 'bg-[var(--sos)] text-white'
                    }`}
                  >
                    {latestRiskResult.level === 'LOW'
                      ? 'Low risk'
                      : latestRiskResult.level === 'MODERATE'
                      ? `Moderate, ${latestRiskResult.score}/100`
                      : `High, ${latestRiskResult.score}/100`}
                  </span>
                )}
              </div>
              <p className="text-caption text-[13px] mt-0.5 truncate">
                {t.pageSubtitleCheckMyRisk || "Tell us what's happening. Nothing leaves this phone."}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--muted)] shrink-0 stroke-[1.75]" />
        </button>
      </section>

      {/* Ask Abhaya AI Safety Advisor */}
      <section>
        <button
          id="btn-home-ask-abhaya-ai"
          onClick={() => setCurrentPage('ai-assistant')}
          className="soft-card w-full p-4 flex items-center justify-between gap-3 text-left hover:border-[var(--primary)] transition cursor-pointer group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] text-[var(--primary)] border border-[var(--line)] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="card-title text-[16px]">
                  Ask Abhaya AI
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--safe)]/15 text-[var(--safe)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--safe)] animate-pulse" />
                  Live AI
                </span>
              </div>
              <p className="text-caption text-[13px] mt-0.5 truncate">
                Private safety advisor for red flags, legal rights & next steps
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--text)] shrink-0 stroke-[1.75]" />
        </button>
      </section>

      {/* 4. Quick Action Tiles: "Record an incident" and "Safety check-in" */}
      <section className="grid grid-cols-2 gap-3">
        {/* Record an incident */}
        <button
          id="btn-home-record-incident"
          onClick={() => setCurrentPage('incidents')}
          className="p-4 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] flex flex-col justify-between text-left hover:border-[var(--accent)] transition cursor-pointer min-h-[105px]"
        >
          <div className="flex items-center justify-between w-full">
            <FilePlus2 className="w-5 h-5 text-[var(--text)] stroke-[1.75]" />
            <span className="text-[12px] text-[var(--muted)]">
              {incidents.length} {t.savedCount || 'saved'}
            </span>
          </div>
          <div className="mt-2">
            <h3 className="font-heading font-semibold text-[15px] text-[var(--text)]">
              {t.recordIncident || 'Record an incident'}
            </h3>
            <p className="text-caption text-[12px] mt-0.5">Private log & map</p>
          </div>
        </button>

        {/* Safety check-in */}
        <button
          id="btn-home-safety-checkin"
          onClick={() => setCurrentPage('checkin')}
          className="p-4 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] flex flex-col justify-between text-left hover:border-[var(--accent)] transition cursor-pointer min-h-[105px]"
        >
          <div className="flex items-center justify-between w-full">
            <Clock className="w-5 h-5 text-[var(--text)] stroke-[1.75]" />
            {activeCheckin ? (
              <span className="text-[12px] font-medium text-[var(--accent)]">
                Active
              </span>
            ) : (
              <span className="text-[12px] text-[var(--muted)]">
                Timer
              </span>
            )}
          </div>
          <div className="mt-2">
            <h3 className="font-heading font-semibold text-[15px] text-[var(--text)]">
              {t.safetyCheckin || 'Safety check-in'}
            </h3>
            <p className="text-caption text-[12px] mt-0.5">Auto alert if overdue</p>
          </div>
        </button>
      </section>

      {/* 5. Emergency numbers: Clean round call buttons */}
      <section className="space-y-3">
        <h2 className="section-title text-[20px]">{t.emergencyNumbers || 'Emergency numbers'}</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* 112 Police */}
          <a
            id="btn-home-call-112"
            href="tel:112"
            className="h-12 px-4 rounded-full bg-[var(--sos)] text-white flex items-center justify-between transition active:scale-98 select-none"
          >
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 stroke-[1.75]" />
              <span className="font-heading text-[15px] font-semibold">112 Police</span>
            </div>
            <span className="text-[12px] opacity-90">Call</span>
          </a>

          {/* 181 Women */}
          <a
            id="btn-home-call-181"
            href="tel:181"
            className="h-12 px-4 rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] flex items-center justify-between transition active:scale-98 select-none"
          >
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[var(--safe)] stroke-[1.75]" />
              <span className="font-heading text-[15px] font-semibold">181 Women</span>
            </div>
            <span className="text-[12px] text-[var(--muted)]">Call</span>
          </a>
        </div>
      </section>

      {/* 6. "Your safety plan" - Filled container 2 */}
      <section className="soft-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title text-[18px]">{t.mySafetyPlan || 'Your safety plan'}</h2>
            <p className="text-caption text-[13px] mt-0.5">
              {completedPlanCount} of {totalPlanCount} {t.stepsDone || 'steps completed'}
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('safety-plan')}
            className="text-[13px] font-medium text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            {t.viewPlan || 'View plan'}
            <ChevronRight className="w-3.5 h-3.5 stroke-[1.75]" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-1.5 w-full pt-1">
          {Array.from({ length: totalPlanCount }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                idx < completedPlanCount ? 'bg-[var(--safe)]' : 'bg-[var(--line)]'
              }`}
            />
          ))}
        </div>

        {/* Next step row */}
        {nextPlanItem && (
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-[var(--line)] mt-2">
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-[var(--text)] truncate">
                {nextPlanItem.title}
              </p>
            </div>
            <button
              onClick={() => toggleSafetyPlanItem(nextPlanItem.id)}
              className="h-8 px-3.5 rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] text-[12px] font-medium shrink-0 flex items-center hover:bg-[var(--surface)] transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[var(--safe)] stroke-[1.75]" />
              {t.markDone || 'Mark done'}
            </button>
          </div>
        )}
      </section>

      {/* 7. "Trusted contacts" - Plain section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="section-title text-[20px]">{t.trustedCircle || 'Trusted contacts'}</h2>
          <span className="text-caption text-[13px]">{contacts.length} contacts</span>
        </div>

        {contacts.length === 0 ? (
          <div className="py-4 text-[14px] text-[var(--muted)] border-b border-[var(--line)]">
            {t.emptyTrustedContacts || "Add someone you trust. They'll hear from us if you need help."}
          </div>
        ) : (
          <div className="flex items-center gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] min-w-[125px] shrink-0 flex flex-col items-center text-center relative"
              >
                {/* Active indicator */}
                <span
                  className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${
                    contact.notifyOnSOS ? 'bg-[var(--safe)]' : 'bg-[var(--muted)]'
                  }`}
                  title={contact.notifyOnSOS ? 'Active for SOS alerts' : 'Standard contact'}
                />

                {/* Avatar circle */}
                <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] text-[var(--text)] font-heading font-semibold text-[15px] flex items-center justify-center">
                  {contact.name.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <span className="text-[14px] font-medium text-[var(--text)] mt-2 whitespace-nowrap">
                  {contact.name}
                </span>

                {/* Relationship */}
                <span className="text-[12px] text-[var(--muted)] whitespace-nowrap mt-0.5">
                  {contact.relationship || 'Contact'}
                </span>
              </div>
            ))}

            {/* "+ Add" Chip */}
            <button
              id="btn-home-add-contact"
              onClick={() => setCurrentPage('profile')}
              className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-dashed border-[var(--line)] min-w-[105px] shrink-0 flex flex-col items-center justify-center text-center hover:bg-[var(--surface)] transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--surface)] text-[var(--text)] flex items-center justify-center">
                <Plus className="w-4 h-4 stroke-[1.75]" />
              </div>
              <span className="text-[13px] font-medium text-[var(--text)] mt-2">
                + Add
              </span>
            </button>
          </div>
        )}
      </section>

      {/* 8. "Recent" - Plain section: heading and rows separated by 1px lines */}
      <section className="space-y-2">
        <div className="flex items-center justify-between pb-1">
          <h2 className="section-title text-[20px]">{t.recentIncidents || 'Recent'}</h2>
          <button
            onClick={() => setCurrentPage('incidents')}
            className="text-[13px] font-medium text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            All logs
            <ChevronRight className="w-3.5 h-3.5 stroke-[1.75]" />
          </button>
        </div>

        {incidents.length === 0 ? (
          <div className="py-4 text-[14px] text-[var(--muted)] border-t border-[var(--line)]">
            {t.emptyIncidents || 'Nothing here yet. If something happens, write it down. Only you can see it.'}
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
            {incidents.slice(0, 2).map((inc) => (
              <div
                key={inc.id}
                onClick={() => setCurrentPage('incidents')}
                className="py-3 flex items-center justify-between gap-3 hover:bg-[var(--surface-2)]/50 transition cursor-pointer px-1"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      inc.severity <= 2
                        ? 'bg-[var(--safe)]'
                        : inc.severity === 3
                        ? 'bg-[var(--accent)]'
                        : 'bg-[var(--sos)]'
                    }`}
                  />
                  <div className="min-w-0">
                    <h4 className="text-[14px] font-medium text-[var(--text)] truncate">
                      {inc.category.replace('_', ' ')} • {inc.location}
                    </h4>
                    <p className="text-caption text-[12px] mt-0.5">
                      {formatDate(inc.timestamp)}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                    inc.severity <= 2
                      ? 'bg-[var(--safe)]/15 text-[var(--safe)]'
                      : inc.severity === 3
                      ? 'bg-[var(--accent)] text-[#1A1F45]'
                      : 'bg-[var(--sos)] text-white'
                  }`}
                >
                  {inc.severity <= 2 ? 'Low' : inc.severity === 3 ? 'Moderate' : 'High'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 9. "Prevention" - Plain section with 1px dividers */}
      <section className="space-y-2">
        <h2 className="section-title text-[20px]">{t.learnPrevent || 'Prevention'}</h2>
        <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
          {/* Check a job or travel offer */}
          <button
            id="btn-home-recruitment-checker"
            onClick={() => setCurrentPage('recruitment-checker')}
            className="w-full py-3.5 flex items-center justify-between gap-3 text-left hover:bg-[var(--surface-2)]/50 transition cursor-pointer px-1"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Compass className="w-5 h-5 text-[var(--text)] shrink-0 stroke-[1.75]" />
              <div className="min-w-0">
                <h4 className="text-[15px] font-medium text-[var(--text)]">
                  {t.checkJobOffer || 'Check a job or travel offer'}
                </h4>
                <p className="text-caption text-[12px] mt-0.5 truncate">
                  Contract & travel risk check
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--muted)] shrink-0 stroke-[1.75]" />
          </button>

          {/* Cyber safety */}
          <button
            id="btn-home-cyber-safety"
            onClick={() => setCurrentPage('cyber-safety')}
            className="w-full py-3.5 flex items-center justify-between gap-3 text-left hover:bg-[var(--surface-2)]/50 transition cursor-pointer px-1"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Lock className="w-5 h-5 text-[var(--text)] shrink-0 stroke-[1.75]" />
              <div className="min-w-0">
                <h4 className="text-[15px] font-medium text-[var(--text)]">
                  {t.cyberBlackmail || 'Cyber safety'}
                </h4>
                <p className="text-caption text-[12px] mt-0.5 truncate">
                  1930 & blackmail response steps
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--muted)] shrink-0 stroke-[1.75]" />
          </button>
        </div>
      </section>
    </div>
  );
};
