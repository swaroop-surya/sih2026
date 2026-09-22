import React, { useState, useRef } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { useTranslation } from '../hooks/useTranslation';
import {
  Radio,
  PhoneCall,
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Mic,
  Camera,
  BookOpen
} from 'lucide-react';
import { connectToEmergencyServices112 } from '../services/emergencyService';
import { useVoiceTrigger } from '../context/VoiceTriggerContext';
import { DiscreetVoiceModal } from '../components/voice/DiscreetVoiceModal';
import { KolamRosette } from '../components/common/KolamRosette';

export const EmergencyPage: React.FC = () => {
  const {
    activeSOS,
    sosDispatchResult,
    initiateSOSCountdown,
    resolveSOS,
    contacts,
    profile,
    setCurrentPage
  } = useAegis();
  const { t } = useTranslation();
  const {
    isListening,
    triggerPhrase,
    startListening,
    stopListening,
    setIsModalOpen,
    isModalOpen
  } = useVoiceTrigger();

  // Hold-to-activate 1.5s state
  const [isHoldingSOS, setIsHoldingSOS] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Silent mode switch under SOS button
  const [isSilentMode, setIsSilentMode] = useState(false);

  // Masked voice safe word reveal
  const [showSafeWord, setShowSafeWord] = useState(false);

  // CAD 112 gateway state
  const [cadDispatchLog, setCadDispatchLog] = useState<string | null>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveReason, setResolveReason] = useState('I am now safely with trusted contacts.');

  // "About Abhaya" expandable bottom collapse
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const startHold = () => {
    setIsHoldingSOS(true);
    setHoldProgress(0);
    const startTime = Date.now();
    const duration = 1500;

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setIsHoldingSOS(false);
        setHoldProgress(0);
        initiateSOSCountdown(isSilentMode, isSilentMode ? 'Silent SOS triggered from Emergency page' : 'Standard SOS triggered from Emergency page');
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

  const handleSimulateCAD112 = async () => {
    if (!activeSOS) return;
    const res = await connectToEmergencyServices112(activeSOS);
    setCadDispatchLog(`112 CAD gateway connected. Ticket: ${res.cadTicketNumber}. Note: ${res.dispatchNote}`);
  };

  return (
    <div className="relative space-y-8 pb-8">
      {/* Faint pulli pattern (diamond lattice of dots at 6% opacity) behind the Emergency page */}
      <div className="absolute top-0 left-[-16px] right-[-16px] h-64 pulli-lattice pointer-events-none" />

      {/* Page Header */}
      <div className="relative pt-1">
        <h1 className="page-title">{t.pageTitleEmergency || 'Emergency'}</h1>
        <p className="text-caption text-[14px] mt-1">
          {t.pageSubtitleEmergency || 'Discreet emergency response, location alerts, and direct help.'}
        </p>
      </div>

      {/* ACTIVE SOS SCREEN IF RUNNING */}
      {activeSOS ? (
        <div className="space-y-4">
          <div className="soft-card p-5 text-center space-y-3 bg-[var(--sos)]/10 border border-[var(--sos)]">
            <div className="w-12 h-12 rounded-full bg-[var(--sos)] text-white flex items-center justify-center mx-auto">
              <Radio className="w-6 h-6 stroke-[1.75]" />
            </div>

            <div>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--sos)] block">
                {activeSOS.isSilent ? 'Silent emergency alert active' : 'Emergency alert active'}
              </span>
              <h2 className="card-title text-[20px] text-[var(--text)] mt-1">
                Alerts dispatched to your trusted contacts
              </h2>
              <p className="text-caption text-[12px] mt-1">
                Started at {new Date(activeSOS.startedAt).toLocaleTimeString('en-IN')} • Live location active
              </p>
            </div>

            {/* Quiet Checklist of Active Protections */}
            <div className="p-3.5 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] text-left space-y-2">
              <div className="flex items-center gap-2 text-[12px] text-[var(--text)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--safe)] shrink-0" />
                <span>Live location shared with {sosDispatchResult?.contactNotifications?.length || contacts?.length || 0} trusted contacts</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[var(--text)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--safe)] shrink-0" />
                <span>Continuous GPS coordinates broadcast</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[var(--text)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--safe)] shrink-0" />
                <span>Incident record created in private Journal</span>
              </div>
              {/* Quiet checklist line for evidence photos: only show if 1 or 2 captured, never 0 or error */}
              {activeSOS.photosCaptured && activeSOS.photosCaptured > 0 ? (
                <div className="flex items-center gap-2 text-[12px] text-[var(--text)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--safe)] shrink-0" />
                  <span className="font-medium text-[var(--text)]">
                    {activeSOS.photosCaptured === 1
                      ? (t.sosPhotoSavedSingle || '1 photo saved to incident & evidence vault')
                      : (t.sosPhotoSavedPlural || `${activeSOS.photosCaptured} photos saved to incident & evidence vault`)}
                  </span>
                </div>
              ) : null}

              {/* Non-urgent mention if photo capture is off or permission was never requested/granted */}
              {(!profile.cameraPermissionGranted || profile.capturePhotosOnSOS === false) && (
                <div className="pt-1.5 text-[11px] text-[var(--muted)] border-t border-[var(--line)] flex items-center justify-between">
                  <span>{t.photoCaptureOffHint || 'Photo capture is off. Turn it on in Profile.'}</span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage('profile')}
                    className="text-[var(--primary)] font-medium hover:underline ml-2 shrink-0 cursor-pointer"
                  >
                    Profile
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <button
                id="btn-resolve-sos"
                onClick={() => setShowResolveModal(true)}
                className="soft-btn soft-btn-primary w-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-2 stroke-[1.75]" />
                I am safe • Resolve alert
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage('incidents')}
                className="w-full h-9 px-3 rounded-full text-[12px] font-medium text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--line)] transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-[var(--primary)] stroke-[1.75]" />
                View Incident & Captured Photos in Journal
              </button>
            </div>
          </div>

          {/* SMS Dispatch Log */}
          {sosDispatchResult && (
            <div className="soft-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="section-title text-[16px]">Alert log</h3>
                <span className="text-caption text-[12px]">Delivered</span>
              </div>
              <div className="space-y-2">
                {sosDispatchResult.contactNotifications.map((c) => (
                  <div
                    key={c.contactId}
                    className="p-3 rounded-[12px] bg-[var(--surface-2)] text-[13px] flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-[var(--text)]">{c.contactName}</p>
                      <p className="text-caption text-[12px] font-mono">{c.phone}</p>
                    </div>
                    <span className="text-[11px] font-medium text-[var(--safe)] px-2 py-0.5 rounded-full bg-[var(--surface)]">
                      Sent
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simulated 112 CAD Gateway */}
          <div className="soft-card p-4 space-y-3">
            <h3 className="section-title text-[16px]">National emergency gateway (112)</h3>
            <p className="text-caption text-[13px]">
              Computer-aided dispatch link for 112 services.
            </p>
            {cadDispatchLog ? (
              <div className="p-3 rounded-[12px] bg-[var(--surface-2)] text-[12px] font-mono text-[var(--text)]">
                {cadDispatchLog}
              </div>
            ) : (
              <button
                id="btn-link-112-cad"
                onClick={handleSimulateCAD112}
                className="soft-btn soft-btn-secondary w-full text-[13px]"
              >
                Connect to 112 dispatch
              </button>
            )}
          </div>
        </div>
      ) : (
        /* STANDBY EMERGENCY ACTIVATION */
        <div className="space-y-8">
          {/* Kolam Rosette SOS Hero */}
          <div className="soft-card p-6 flex flex-col items-center justify-center text-center select-none">
            <div className="relative flex items-center justify-center w-[210px] h-[210px]">
              {/* Kolam Rosette SVG */}
              <KolamRosette
                progress={holdProgress / 100}
                size={210}
                isHolding={isHoldingSOS}
                className="absolute inset-0"
              />

              {/* Kumkum Red Circle Button */}
              <button
                id="btn-emergency-sos-hold"
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                onTouchCancel={cancelHold}
                className="relative z-10 w-[140px] h-[140px] rounded-full bg-[var(--sos)] text-white flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer focus:outline-none"
                aria-label="Hold for 1.5s to trigger SOS"
              >
                <span className="font-heading text-[38px] font-bold tracking-wider leading-none">
                  SOS
                </span>
              </button>
            </div>

            <p className="text-[16px] font-semibold text-[var(--text)] mt-4">
              {t.holdHeroCaption || 'Hold for 1.5s to trigger SOS'}
            </p>
            <p className="text-caption text-[13px] mt-1 max-w-xs">
              {t.holdHeroMuted || 'Alerts your trusted contacts with your live location.'}
            </p>

            {/* Silent Mode Switch under SOS button */}
            <div className="w-full max-w-xs mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between">
              <div className="text-left">
                <span className="text-[14px] font-medium text-[var(--text)] block">
                  {t.silentModeTitle || 'Silent mode'}
                </span>
                <span className="text-caption text-[12px] block">
                  {t.silentModeSubtitle || 'No siren, sound or flash'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="switch-silent-mode"
                  checked={isSilentMode}
                  onChange={(e) => setIsSilentMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[var(--surface-2)] border border-[var(--line)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--safe)]" />
              </label>
            </div>
          </div>

          {/* Voice safe word row: plain section */}
          <div className="space-y-3">
            <h3 className="section-title text-[20px]">{t.voiceSafeWordTitle || 'Voice safe word'}</h3>

            <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Mic className="w-5 h-5 text-[var(--text)] stroke-[1.75]" />
                  <div>
                    <span className="text-[14px] font-medium text-[var(--text)]">Listening state</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-[var(--safe)]' : 'bg-[var(--muted)]'}`} />
                      <span className="text-caption text-[12px]">
                        {isListening ? (t.statusListening || 'Listening') : (t.statusOff || 'Off')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="h-8 px-3 rounded-full bg-[var(--surface-2)] border border-[var(--line)] text-[12px] font-medium text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer"
                  >
                    {t.setUpVoice || 'Set up'}
                  </button>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="switch-voice-listening"
                      checked={isListening}
                      onChange={(e) => {
                        if (e.target.checked) {
                          startListening().catch(() => setIsModalOpen(true));
                        } else {
                          stopListening();
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[var(--surface-2)] border border-[var(--line)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--safe)]" />
                  </label>
                </div>
              </div>

              {/* Masked safe word display */}
              <div className="p-2.5 rounded-[8px] bg-[var(--surface-2)] flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--muted)]">Phrase:</span>
                  <span className="font-mono text-[var(--text)]">
                    {showSafeWord ? triggerPhrase : '••••••••••••'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSafeWord(!showSafeWord)}
                  className="text-[var(--muted)] hover:text-[var(--text)] p-1 cursor-pointer"
                  aria-label={showSafeWord ? 'Hide safe word' : 'Reveal safe word'}
                >
                  {showSafeWord ? <EyeOff className="w-4 h-4 stroke-[1.75]" /> : <Eye className="w-4 h-4 stroke-[1.75]" />}
                </button>
              </div>
            </div>
          </div>

          {/* Emergency numbers */}
          <div className="space-y-3">
            <h3 className="section-title text-[20px]">{t.emergencyNumbers || 'Emergency numbers'}</h3>

            <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
              {/* Row 1: 112 Police */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-semibold text-[16px] text-[var(--sos)]">112</span>
                    <span className="text-[14px] font-medium text-[var(--text)]">Police & Emergency</span>
                  </div>
                  <p className="text-caption text-[12px] mt-0.5">24×7 national emergency services</p>
                </div>
                <a
                  id="btn-emergency-call-112"
                  href="tel:112"
                  className="h-9 px-4 rounded-full bg-[var(--sos)] text-white text-[13px] font-semibold flex items-center shrink-0 transition select-none"
                >
                  <PhoneCall className="w-3.5 h-3.5 mr-1 stroke-[1.75]" />
                  Call
                </a>
              </div>

              {/* Row 2: 181 Women */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-semibold text-[16px] text-[var(--text)]">181</span>
                    <span className="text-[14px] font-medium text-[var(--text)]">Women Helpline</span>
                  </div>
                  <p className="text-caption text-[12px] mt-0.5">24×7 crisis support</p>
                </div>
                <a
                  id="btn-emergency-call-181"
                  href="tel:181"
                  className="h-9 px-4 rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] text-[13px] font-medium flex items-center shrink-0 transition select-none"
                >
                  <PhoneCall className="w-3.5 h-3.5 mr-1 stroke-[1.75]" />
                  Call
                </a>
              </div>

              {/* Row 3: 1930 Cyber */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-semibold text-[16px] text-[var(--text)]">1930</span>
                    <span className="text-[14px] font-medium text-[var(--text)]">Cyber Crime & Extortion</span>
                  </div>
                  <p className="text-caption text-[12px] mt-0.5">Online threats and blackmail</p>
                </div>
                <a
                  id="btn-emergency-call-1930"
                  href="tel:1930"
                  className="h-9 px-4 rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] text-[13px] font-medium flex items-center shrink-0 transition select-none"
                >
                  <PhoneCall className="w-3.5 h-3.5 mr-1 stroke-[1.75]" />
                  Call
                </a>
              </div>
            </div>
          </div>

          {/* "About Abhaya" collapsed at the bottom */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setIsAboutExpanded(!isAboutExpanded)}
              className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--text)] font-medium cursor-pointer"
            >
              <span>{t.aboutAegis || 'About Abhaya'}</span>
              {isAboutExpanded ? <ChevronUp className="w-3.5 h-3.5 stroke-[1.75]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[1.75]" />}
            </button>

            {isAboutExpanded && (
              <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] text-left text-[13px] text-[var(--muted)] space-y-2 mt-3">
                <p>
                  Abhaya is an offline-first tool built for safety, prevention, and early risk detection.
                  All contacts, incident records, and notes remain private on your phone.
                </p>
                <p>
                  In life-threatening situations, always call 112 immediately.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resolution Confirmation Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="soft-card w-full max-w-sm p-5 space-y-4 bg-[var(--surface)] border border-[var(--line)]">
            <h3 className="section-title text-[18px]">Confirm you are safe</h3>
            <p className="text-caption text-[13px]">
              This will resolve the alert and let your trusted contacts know you are safe.
            </p>
            <textarea
              value={resolveReason}
              onChange={(e) => setResolveReason(e.target.value)}
              className="soft-input w-full h-24 p-3 text-[13px]"
              placeholder="Reason (e.g., Safely home, family arrived)"
            />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowResolveModal(false)}
                className="soft-btn soft-btn-secondary w-full text-[13px]"
              >
                Keep active
              </button>
              <button
                onClick={() => {
                  resolveSOS(resolveReason);
                  setShowResolveModal(false);
                }}
                className="soft-btn soft-btn-primary w-full text-[13px]"
              >
                Confirm safe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Trigger Setup Modal */}
      {isModalOpen && <DiscreetVoiceModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
