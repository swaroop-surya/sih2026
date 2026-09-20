import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { useTranslation } from '../hooks/useTranslation';
import {
  Clock,
  CheckCircle,
  AlertOctagon,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Radio,
  Bell,
  ChevronLeft,
  Plus,
  Info,
  X,
  MessageSquare,
  Check,
  Navigation
} from 'lucide-react';
import { formatMMSS } from '../lib/utils';

// Accessible Tailwind Switch Component
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  id?: string;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, id, label }) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      checked ? 'bg-[var(--primary)]' : 'bg-[var(--surface-2)] border border-[var(--line)]'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export const SafetyCheckinPage: React.FC = () => {
  const {
    checkins,
    contacts,
    createCheckin,
    extendCheckin,
    resolveCheckinSafe,
    endCheckinWithoutAlert,
    triggerCheckinOverdueAlertAction,
    cancelCheckinAlert,
    setCurrentPage,
    sosDispatchResult,
    activeSOS
  } = useAegis();
  const { t } = useTranslation();

  // Find current active check-in, if any
  const activeCheckin = useMemo(() => {
    return (checkins || []).find(c => c.status === 'ACTIVE' || (c.status === 'EXPIRED' && c.overdueAlertSent));
  }, [checkins]);

  const pastCheckins = useMemo(() => {
    return (checkins || []).filter(c => c.id !== activeCheckin?.id);
  }, [checkins, activeCheckin]);

  // SETUP STATE
  // Duration preset: 15, 30, 60, 120, or 'custom'
  const [selectedDurationPreset, setSelectedDurationPreset] = useState<number | 'custom'>(30);
  const [customMinutes, setCustomMinutes] = useState<number>(45);

  // "What for" chip: Commute, Cab or auto ride, Walking home, Meeting, Other
  const whatForOptions = [
    { key: 'cab', label: t.checkinPurposeCab || 'Cab or auto ride' },
    { key: 'commute', label: t.checkinPurposeCommute || 'Commute' },
    { key: 'walking', label: t.checkinPurposeWalking || 'Walking home' },
    { key: 'meeting', label: t.checkinPurposeMeeting || 'Meeting' },
    { key: 'other', label: t.checkinPurposeOther || 'Other' }
  ];

  const [selectedWhatFor, setSelectedWhatFor] = useState<string>(whatForOptions[0].label);
  const [customNote, setCustomNote] = useState<string>('');

  // Who gets alerted switches (all on by default, contacts with overdue alert enabled preferred)
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(() => {
    const valid = (contacts || []).filter(c => c.notifyOnCheckinMiss);
    if (valid.length > 0) return valid.map(c => c.id);
    return (contacts || []).map(c => c.id);
  });

  // Toggles
  const [shareLocation, setShareLocation] = useState<boolean>(true);
  const [notifyWhenSafe, setNotifyWhenSafe] = useState<boolean>(true);

  // Dialog confirmation state for "End without alerting"
  const [showConfirmEndDialog, setShowConfirmEndDialog] = useState<boolean>(false);

  // RUNNING TIMER CLOCK STATE
  // Real-time ticker based on absolute timestamp
  const [nowTime, setNowTime] = useState<number>(Date.now());
  const warnedRef = useRef<boolean>(false);
  const alertSentTriggeredRef = useRef<boolean>(false);

  // Absolute end timestamp
  const targetEndTime = activeCheckin ? new Date(activeCheckin.expiresAt).getTime() : 0;
  const targetStartTime = activeCheckin ? new Date(activeCheckin.startedAt).getTime() : 0;
  const totalDurationMs = Math.max(1, targetEndTime - targetStartTime);
  const remainingMs = targetEndTime - nowTime;

  // 60-second Grace period tracking when remainingMs <= 0
  const isGracePeriod = activeCheckin && activeCheckin.status === 'ACTIVE' && remainingMs <= 0;
  const graceElapsedSec = isGracePeriod ? Math.floor(Math.abs(remainingMs) / 1000) : 0;
  const graceRemainingSec = isGracePeriod ? Math.max(0, 60 - graceElapsedSec) : 60;

  // Alert sent state
  const isAlertSent = activeCheckin?.overdueAlertSent || (activeCheckin?.status === 'EXPIRED' && activeCheckin.overdueAlertSent);

  // Recompute on ticker, visibilitychange, and focus
  useEffect(() => {
    const updateTime = () => setNowTime(Date.now());
    const interval = setInterval(updateTime, 1000);

    window.addEventListener('visibilitychange', updateTime);
    window.addEventListener('focus', updateTime);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', updateTime);
      window.removeEventListener('focus', updateTime);
    };
  }, []);

  // Request WakeLock while the running screen is mounted
  useEffect(() => {
    if (!activeCheckin) return;
    let wakeLock: any = null;
    let isMounted = true;

    async function requestScreenLock() {
      if ('wakeLock' in navigator) {
        try {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          // Graceful fallback if denied or unsupported
        }
      }
    }

    requestScreenLock();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isMounted && activeCheckin) {
        requestScreenLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibility);
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, [activeCheckin?.id]);

  // Warning chime and vibration helper
  const playWarningChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // Ignored if blocked
    }
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch {
        // Ignored
      }
    }
  };

  // Warning trigger: 2 minutes remaining (or 25% for shorter timers)
  const isWarningWindow = useMemo(() => {
    if (!activeCheckin || activeCheckin.status !== 'ACTIVE' || remainingMs <= 0) return false;
    const warningThresholdMs = Math.min(2 * 60 * 1000, totalDurationMs * 0.25);
    return remainingMs <= warningThresholdMs;
  }, [activeCheckin, remainingMs, totalDurationMs]);

  useEffect(() => {
    if (isWarningWindow && !warnedRef.current) {
      warnedRef.current = true;
      playWarningChime();
    }
    if (!isWarningWindow && remainingMs > 2 * 60 * 1000) {
      warnedRef.current = false;
    }
  }, [isWarningWindow, remainingMs]);

  // Grace Period Expiration Monitor: If graceRemainingSec hits 0 and alert not sent, dispatch alert
  useEffect(() => {
    if (isGracePeriod && graceRemainingSec <= 0 && activeCheckin && !activeCheckin.overdueAlertSent && !alertSentTriggeredRef.current) {
      alertSentTriggeredRef.current = true;
      triggerCheckinOverdueAlertAction(activeCheckin.id);
    }
  }, [isGracePeriod, graceRemainingSec, activeCheckin, triggerCheckinOverdueAlertAction]);

  // Reset alert trigger ref when activeCheckin changes
  useEffect(() => {
    if (!activeCheckin) {
      alertSentTriggeredRef.current = false;
      warnedRef.current = false;
    }
  }, [activeCheckin]);

  // START CHECK-IN
  const handleStartCheckin = () => {
    const finalMinutes = selectedDurationPreset === 'custom'
      ? Math.max(1, Math.min(480, customMinutes || 30))
      : selectedDurationPreset;

    const safeContacts = contacts || [];
    const targetContacts = selectedContactIds.length > 0 ? selectedContactIds : safeContacts.map(c => c.id);

    createCheckin({
      purpose: selectedWhatFor,
      destination: customNote ? customNote.trim() : selectedWhatFor,
      note: customNote.trim() || undefined,
      durationMinutes: finalMinutes,
      isRecurring: false,
      contactId: targetContacts[0] || 'tc_1',
      notifyContactIds: targetContacts,
      shareLocation,
      notifyWhenSafe
    });
  };

  const handleToggleContact = (id: string) => {
    setSelectedContactIds(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  // Progress computation for circular ring
  const progressFraction = Math.max(0, Math.min(1, remainingMs / totalDurationMs));
  const strokeDashoffset = 283 * (1 - progressFraction);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-9 h-9 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center text-[var(--text)] transition cursor-pointer"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-5 h-5 stroke-[1.75]" />
          </button>
          <div>
            <h1 className="page-title text-[22px] leading-tight">
              {t.safetyCheckin || 'Safety check-in'}
            </h1>
            <p className="text-caption text-[12px]">
              {activeCheckin ? (t.checkinRunningStatus || 'Active countdown') : (t.checkinTimerSectionSubtitle || 'Set automated alert countdowns for travel or meetings')}
            </p>
          </div>
        </div>

        {activeCheckin && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[var(--accent)] text-[#1A1F45]">
            <span className="w-2 h-2 rounded-full bg-[#1A1F45] animate-ping" />
            {t.checkinRunningStatus || 'Running'}
          </span>
        )}
      </div>

      {/* ========================================================================= */}
      {/* RUNNING SCREEN                                                            */}
      {/* ========================================================================= */}
      {activeCheckin ? (
        <div className="space-y-6">
          {/* Amber warning banner when due soon */}
          {isWarningWindow && !isGracePeriod && !isAlertSent && (
            <div className="p-4 rounded-[14px] bg-[var(--warn)]/15 border border-[var(--warn)]/30 text-[var(--text)] flex items-start gap-3 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-[var(--warn)] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[14px]">
                  {t.checkinDueSoonBannerTitle || 'Check-in due soon. Are you okay?'}
                </h4>
                <p className="text-caption text-[12px] mt-0.5">
                  Confirm your safety below or add 10 minutes if you need more time.
                </p>
              </div>
            </div>
          )}

          {/* 60-Second Grace Period Banner (when timer hits 0) */}
          {isGracePeriod && !isAlertSent && (
            <div className="p-4 rounded-[16px] bg-[var(--sos)] text-white space-y-2 shadow-lg animate-pulse">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-6 h-6 animate-bounce" />
                <h3 className="font-heading font-bold text-[18px]">
                  {t.checkinAreYouSafeTitle || 'Are you safe?'}
                </h3>
              </div>
              <p className="text-[13px] text-white/90">
                {t.checkinGraceCountdownNotice || 'Alerting trusted contacts with your live location in'}:{' '}
                <strong className="text-[20px] font-mono underline ml-1">{graceRemainingSec}s</strong>
              </p>
              <button
                id="btn-grace-safe"
                onClick={() => resolveCheckinSafe(activeCheckin.id)}
                className="w-full mt-2 h-11 rounded-[10px] bg-white text-[var(--sos)] font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm hover:bg-white/90 transition cursor-pointer"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{t.checkinImSafeButton || "I'm safe"}</span>
              </button>
            </div>
          )}

          {/* Alert Sent State View */}
          {isAlertSent ? (
            <div className="p-6 rounded-[20px] bg-[var(--surface)] border-2 border-[var(--sos)] space-y-5 text-center shadow-md">
              <div className="w-16 h-16 rounded-full bg-[var(--sos)] text-white flex items-center justify-center mx-auto ring-8 ring-[var(--sos)]/20 animate-pulse">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h2 className="font-heading font-serif text-[24px] font-bold text-[var(--sos)]">
                  {t.checkinAlertSentTitle || 'Overdue alert sent'}
                </h2>
                <p className="text-caption text-[13px] max-w-xs mx-auto">
                  {t.checkinAlertSentSubtitle || 'Your trusted contacts have been sent your last known location and check-in details.'}
                </p>
              </div>

              {/* Dispatched SMS Info */}
              <div className="p-3.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] text-left text-[12px] space-y-2">
                <div className="flex items-center justify-between font-semibold text-[var(--text)]">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[var(--sos)]" />
                    Automatic SMS dispatch log
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">Just now</span>
                </div>
                <div className="space-y-1 text-[var(--muted)]">
                  {(sosDispatchResult?.contactNotifications || []).map((cn, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-[var(--text)] font-medium">{cn.name} ({cn.phone})</span>
                      <span className="text-[var(--safe)] text-[11px] font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Sent
                      </span>
                    </div>
                  ))}
                  {(!sosDispatchResult || sosDispatchResult.contactNotifications.length === 0) && (
                    <p className="text-caption">Emergency SMS notifications dispatched to your selected circle.</p>
                  )}
                </div>
              </div>

              <button
                id="btn-cancel-alert"
                onClick={() => cancelCheckinAlert(activeCheckin.id)}
                className="w-full h-12 rounded-[12px] bg-[var(--safe)] text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition cursor-pointer"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{t.checkinCancelAlertButton || "I'm safe, cancel alert"}</span>
              </button>
            </div>
          ) : (
            /* Standard Running Display */
            <div className="p-6 rounded-[20px] bg-[var(--surface)] border border-[var(--line)] text-center space-y-5 shadow-sm">
              {/* Circular Progress & Big Countdown */}
              <div className="relative flex items-center justify-center w-[200px] h-[200px] mx-auto select-none">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="var(--line)"
                    strokeWidth="5"
                  />
                  {/* Active Progress Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke={isWarningWindow ? 'var(--warn)' : 'var(--accent)'}
                    strokeWidth="5.5"
                    strokeDasharray="283"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                {/* Big Countdown inside ring: serif font, tabular numbers */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-heading font-serif text-[46px] font-bold text-[var(--text)] tracking-tight tabular-nums leading-none">
                    {remainingMs > 0 ? formatMMSS(remainingMs) : '00:00'}
                  </span>
                  <span className="text-[12px] font-medium text-[var(--muted)] mt-1 tracking-wider uppercase">
                    Remaining
                  </span>
                </div>
              </div>

              {/* Purpose & Note */}
              <div className="space-y-1">
                <h2 className="font-heading text-[20px] font-semibold text-[var(--text)]">
                  {activeCheckin.purpose}
                </h2>
                {activeCheckin.note && (
                  <p className="text-caption text-[13px] text-[var(--text)]/80 italic">
                    "{activeCheckin.note}"
                  </p>
                )}
              </div>

              {/* Subhead indicating live location sharing if enabled */}
              {activeCheckin.shareLocation && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--line)] text-[12px] text-[var(--safe)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--safe)] animate-pulse" />
                  <span>{t.checkinLiveLocationSharing || 'Live location sharing active'}</span>
                </div>
              )}

              {/* Three Actions */}
              <div className="space-y-2.5 pt-2">
                {/* 1. "I'm safe": primary button */}
                <button
                  id="btn-checkin-im-safe"
                  onClick={() => resolveCheckinSafe(activeCheckin.id)}
                  className="w-full h-12 rounded-[12px] bg-[var(--primary)] text-[var(--on-primary)] font-semibold text-[15px] flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition cursor-pointer"
                >
                  <CheckCircle className="w-5 h-5 stroke-[2]" />
                  <span>{t.checkinImSafeButton || "I'm safe"}</span>
                </button>

                {/* 2. "Add 10 min": bumps the timer */}
                <button
                  id="btn-checkin-add-10"
                  onClick={() => extendCheckin(activeCheckin.id, 10)}
                  className="w-full h-11 rounded-[12px] bg-[var(--surface-2)] hover:bg-[var(--surface)] text-[var(--text)] border border-[var(--line)] font-medium text-[14px] flex items-center justify-center gap-2 active:scale-[0.99] transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2]" />
                  <span>{t.checkinAdd10MinButton || 'Add 10 min'}</span>
                </button>

                {/* 3. "End without alerting": secondary/ghost button */}
                <button
                  id="btn-checkin-end-quietly"
                  onClick={() => setShowConfirmEndDialog(true)}
                  className="w-full py-2.5 text-[13px] text-[var(--muted)] hover:text-[var(--text)] transition cursor-pointer"
                >
                  {t.checkinEndWithoutAlertingButton || 'End without alerting'}
                </button>
              </div>
            </div>
          )}

          {/* INLINE CONFIRMATION MODAL / DIALOG */}
          {showConfirmEndDialog && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="w-full max-w-sm rounded-[18px] bg-[var(--surface)] border border-[var(--line)] p-5 space-y-4 shadow-xl">
                <div className="flex items-start justify-between">
                  <h3 className="font-heading font-semibold text-[16px] text-[var(--text)]">
                    {t.checkinConfirmEndTitle || 'End check-in without alerting?'}
                  </h3>
                  <button
                    onClick={() => setShowConfirmEndDialog(false)}
                    className="p-1 text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-caption text-[13px] leading-relaxed">
                  {t.checkinConfirmEndSubtitle || 'Your timer will stop immediately. No notifications will be sent to your contacts.'}
                </p>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    id="btn-confirm-end-no"
                    onClick={() => setShowConfirmEndDialog(false)}
                    className="h-10 rounded-[10px] bg-[var(--surface-2)] border border-[var(--line)] text-[13px] font-medium text-[var(--text)] hover:bg-[var(--surface)] cursor-pointer"
                  >
                    {t.checkinConfirmEndNo || 'Keep running'}
                  </button>
                  <button
                    id="btn-confirm-end-yes"
                    onClick={() => {
                      endCheckinWithoutAlert(activeCheckin.id);
                      setShowConfirmEndDialog(false);
                    }}
                    className="h-10 rounded-[10px] bg-[var(--primary)] text-[var(--on-primary)] text-[13px] font-medium hover:opacity-90 cursor-pointer"
                  >
                    {t.checkinConfirmEndYes || 'Yes, end timer'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* SETUP SCREEN                                                              */
        /* ========================================================================= */
        <div className="space-y-6">
          <div className="p-5 rounded-[20px] bg-[var(--surface)] border border-[var(--line)] space-y-5 shadow-xs">
            {/* 1. DURATION CHIPS: 15 min, 30 min, 1 hour, 2 hours, Custom */}
            <div className="space-y-2.5">
              <label className="block font-heading font-semibold text-[14px] text-[var(--text)]">
                {t.checkinDurationTitle || 'How long will you be?'}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { value: 15, label: '15m' },
                  { value: 30, label: '30m' },
                  { value: 60, label: '1h' },
                  { value: 120, label: '2h' },
                  { value: 'custom' as const, label: t.checkinDurationCustom || 'Custom' }
                ].map(chip => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setSelectedDurationPreset(chip.value)}
                    className={`h-10 rounded-[10px] text-[13px] font-medium border transition cursor-pointer flex items-center justify-center ${
                      selectedDurationPreset === chip.value
                        ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)] font-semibold shadow-xs'
                        : 'bg-[var(--surface-2)] border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Custom Minutes Input (1 to 480) */}
              {selectedDurationPreset === 'custom' && (
                <div className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-[12px] text-[var(--muted)]">
                    <span>{t.checkinCustomMinutesLabel || 'Minutes (1 to 480)'}</span>
                    <span className="font-semibold text-[var(--text)]">{customMinutes} min</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="480"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Math.max(1, Math.min(480, parseInt(e.target.value) || 1)))}
                    className="soft-input w-full text-[14px] font-mono h-10"
                    placeholder="Enter minutes (1-480)"
                  />
                </div>
              )}
            </div>

            {/* 2. "WHAT FOR" CHIPS: Commute, Cab or auto ride, Walking home, Meeting, Other */}
            <div className="space-y-2.5">
              <label className="block font-heading font-semibold text-[14px] text-[var(--text)]">
                {t.checkinWhatForTitle || 'What is this for?'}
              </label>
              <div className="flex flex-wrap gap-2">
                {whatForOptions.map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedWhatFor(opt.label)}
                    className={`h-9 px-3 rounded-full text-[12px] font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                      selectedWhatFor === opt.label
                        ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)] font-semibold'
                        : 'bg-[var(--surface-2)] border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Optional one-line note */}
              <div className="pt-1">
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder={t.checkinNotePlaceholder || 'Optional note (e.g., auto number, meeting details)'}
                  maxLength={120}
                  className="soft-input w-full text-[13px] h-10"
                />
              </div>
            </div>

            {/* 3. WHO GETS ALERTED */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block font-heading font-semibold text-[14px] text-[var(--text)]">
                  {t.checkinWhoAlertedTitle || 'Who gets alerted'}
                </label>
                <span className="text-[12px] text-[var(--muted)]">
                  {selectedContactIds.length} {t.selectedCount || 'selected'}
                </span>
              </div>

              {contacts.length === 0 ? (
                <div className="p-3 rounded-[12px] bg-[var(--surface-2)] text-[12px] text-[var(--muted)] text-center">
                  No trusted contacts added yet.{' '}
                  <button
                    onClick={() => setCurrentPage('profile')}
                    className="text-[var(--primary)] underline font-medium cursor-pointer"
                  >
                    Add contact
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[var(--line)] rounded-[14px] border border-[var(--line)] overflow-hidden bg-[var(--surface-2)]">
                  {contacts.map(c => {
                    const isChecked = selectedContactIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        className="p-3 flex items-center justify-between gap-3 text-[13px] hover:bg-[var(--surface)] transition"
                      >
                        <div className="min-w-0">
                          <span className="font-medium text-[var(--text)] block truncate">
                            {c.name}
                          </span>
                          <span className="text-caption text-[11px]">
                            {c.relationship} • {c.phone}
                          </span>
                        </div>
                        <ToggleSwitch
                          id={`toggle-contact-${c.id}`}
                          label={`Alert ${c.name}`}
                          checked={isChecked}
                          onChange={() => handleToggleContact(c.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. SWITCHES */}
            <div className="space-y-3 pt-1 border-t border-[var(--line)]">
              {/* Share my live location while this runs (default on) */}
              <div className="flex items-center justify-between gap-3 p-1">
                <div className="space-y-0.5">
                  <span className="text-[13px] font-medium text-[var(--text)] block">
                    {t.checkinShareLocationSwitch || 'Share my live location while this runs'}
                  </span>
                  <span className="text-caption text-[11px] block">
                    Coordinates attached to emergency notifications
                  </span>
                </div>
                <ToggleSwitch
                  id="toggle-share-location"
                  label="Share live location"
                  checked={shareLocation}
                  onChange={setShareLocation}
                />
              </div>

              {/* Tell my contacts when I'm safe (default on) */}
              <div className="flex items-center justify-between gap-3 p-1">
                <div className="space-y-0.5">
                  <span className="text-[13px] font-medium text-[var(--text)] block">
                    {t.checkinTellContactsSafeSwitch || "Tell my contacts when I'm safe"}
                  </span>
                  <span className="text-caption text-[11px] block">
                    Sends a reassuring SMS when you complete your check-in
                  </span>
                </div>
                <ToggleSwitch
                  id="toggle-notify-safe"
                  label="Tell contacts when safe"
                  checked={notifyWhenSafe}
                  onChange={setNotifyWhenSafe}
                />
              </div>
            </div>

            {/* 5. BIG START BUTTON */}
            <button
              id="btn-start-checkin"
              onClick={handleStartCheckin}
              className="w-full h-12 rounded-[12px] bg-[var(--primary)] text-[var(--on-primary)] font-semibold text-[15px] flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition cursor-pointer mt-2"
            >
              <Clock className="w-5 h-5 stroke-[2]" />
              <span>{t.checkinStartButton || 'Start check-in'}</span>
            </button>

            {/* 6. HONEST ONE-LINE NOTE */}
            <p className="text-caption text-[12px] text-center text-[var(--muted)] leading-relaxed pt-1">
              {t.checkinHonestLine || 'Keep Abhaya open, or add it to your home screen, so reminders arrive on time.'}
            </p>
          </div>

          {/* PAST CHECK-IN RECORDS */}
          {pastCheckins.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="section-title text-[15px] font-heading">
                Recent check-ins
              </h3>
              <div className="divide-y divide-[var(--line)] rounded-[14px] border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
                {pastCheckins.slice(0, 5).map(chk => (
                  <div key={chk.id} className="p-3.5 flex items-center justify-between text-[13px]">
                    <div className="min-w-0 pr-2">
                      <div className="font-medium text-[var(--text)] truncate">{chk.purpose}</div>
                      <div className="text-caption text-[11px] mt-0.5">
                        {new Date(chk.startedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} • {chk.durationMinutes} min
                        {chk.note ? ` • "${chk.note}"` : ''}
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0 ${
                        chk.status === 'SAFE'
                          ? 'bg-[var(--safe)]/15 text-[var(--safe)]'
                          : chk.status === 'EXPIRED'
                          ? 'bg-[var(--sos)] text-white'
                          : 'bg-[var(--accent)] text-[#1A1F45]'
                      }`}
                    >
                      {chk.status === 'SAFE' ? 'Safe' : chk.status === 'EXPIRED' ? 'Alerted' : chk.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
