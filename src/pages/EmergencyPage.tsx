import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { useTranslation } from '../hooks/useTranslation';
import {
  AlertOctagon,
  VolumeX,
  PhoneCall,
  MapPin,
  CheckCircle,
  Users,
  Shield,
  Clock,
  Radio,
  ExternalLink,
  XCircle,
  AlertTriangle,
  Info,
  Mic,
  MicOff,
  Settings,
  Lock
} from 'lucide-react';
import { connectToEmergencyServices112 } from '../services/emergencyService';
import { useVoiceTrigger } from '../context/VoiceTriggerContext';

export const EmergencyPage: React.FC = () => {
  const {
    activeSOS,
    sosDispatchResult,
    startSOS,
    resolveSOS,
    contacts
  } = useAegis();
  const { t } = useTranslation();
  const {
    isListening,
    triggerPhrase,
    startListening,
    stopListening,
    setIsModalOpen,
    wakeLockActive
  } = useVoiceTrigger();

  const [isSilentLoading, setIsSilentLoading] = useState(false);
  const [isNormalLoading, setIsNormalLoading] = useState(false);
  const [cadDispatchLog, setCadDispatchLog] = useState<string | null>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveReason, setResolveReason] = useState('I am now safely with trusted friends/family.');

  const handleTriggerSOS = async (silent: boolean) => {
    if (silent) setIsSilentLoading(true);
    else setIsNormalLoading(true);

    try {
      await startSOS(silent);
    } finally {
      setIsSilentLoading(false);
      setIsNormalLoading(false);
    }
  };

  const handleSimulateCAD112 = async () => {
    if (!activeSOS) return;
    const res = await connectToEmergencyServices112(activeSOS);
    setCadDispatchLog(`Simulated CAD Gateway Connected: ${res.cadTicketNumber}. Note: ${res.dispatchNote}`);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-500" />
          Emergency System
        </h2>
        <p className="text-xs text-slate-400">
          Discreet emergency coordination, live GPS dispatch, and emergency services link.
        </p>
      </div>

      {/* ACTIVE SOS SCREEN IF RUNNING */}
      {activeSOS ? (
        <div className="space-y-4">
          <div className="rounded-2xl bg-rose-950/80 border-2 border-rose-600 p-5 text-center space-y-3 shadow-2xl relative overflow-hidden">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-600/30 border-2 border-rose-500 text-rose-300 animate-pulse">
              <Radio className="w-8 h-8 text-rose-400" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                {activeSOS.isSilent ? 'SILENT EMERGENCY SOS ACTIVE' : 'EMERGENCY SOS ACTIVE'}
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                Alerts Dispatched to Trusted Circle
              </h3>
              <p className="text-xs text-rose-200/90 mt-1">
                Triggered at {new Date(activeSOS.startedAt).toLocaleTimeString('en-IN')}
              </p>
            </div>

            {/* Simulated Live Location */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-rose-900/60 text-left text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Simulated Location Transmitted:</span>
              </div>
              <p className="text-slate-300 text-[11px] font-mono">
                {activeSOS.location.addressText}
              </p>
              <p className="text-[10px] text-slate-400">
                Coordinates: {activeSOS.location.latitude}, {activeSOS.location.longitude} (±{activeSOS.location.accuracyMeters}m accuracy)
              </p>
            </div>

            {/* Direct Official Helpline Call */}
            <div className="pt-2">
              <a
                href="tel:112"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg transition active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 112 National Police Emergency</span>
              </a>
            </div>

            {/* Cancel/Resolve Button */}
            <div className="pt-1">
              <button
                onClick={() => setShowResolveModal(true)}
                className="text-xs text-slate-400 hover:text-slate-200 underline font-medium"
              >
                I am safe now • End & Resolve Emergency
              </button>
            </div>
          </div>

          {/* Trusted Contacts Notification Status Log */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-400" />
              Trusted Circle Notification Logs
            </h4>
            <div className="space-y-2 text-xs">
              {contacts.filter(c => c.notifyOnSOS).map((c, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">{c.name} ({c.relationship})</div>
                    <div className="text-[11px] text-slate-400">{c.phone}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Payload: [AEGIS ALERT] Live Coordinates Dispatched
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    <CheckCircle className="w-3 h-3" /> SENT
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency 112 CAD Integration Layer */}
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">112 ERSS API Gateway Integration Layer</span>
              <button
                onClick={handleSimulateCAD112}
                className="text-[11px] font-semibold text-sky-400 hover:underline"
              >
                Test Gateway Handshake
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              In a production deployment, this gateway transmits dispatch payloads directly to state police CAD (Computer Aided Dispatch) controllers via authenticated government webhooks.
            </p>
            {cadDispatchLog && (
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-sky-300">
                {cadDispatchLog}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STANDBY SOS SCREEN */
        <div className="space-y-4">
          {/* Main 2 Trigger Options */}
          <div className="space-y-3">
            {/* Standard Emergency SOS */}
            <button
              id="btn-trigger-active-sos"
              disabled={isNormalLoading}
              onClick={() => handleTriggerSOS(false)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-rose-900/90 to-rose-950 border border-rose-600/70 hover:border-rose-500 text-left transition shadow-lg active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md">
                  <AlertOctagon className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    EMERGENCY SOS
                  </h3>
                  <p className="text-xs text-rose-200/80 mt-0.5">
                    Transmits coordinates & alerts entire circle
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-800/80 text-white">
                Activate
              </span>
            </button>

            {/* Silent SOS */}
            <button
              id="btn-trigger-silent-sos"
              disabled={isSilentLoading}
              onClick={() => handleTriggerSOS(true)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <VolumeX className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    SILENT SOS (Discreet Mode)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    No siren sound or bright flashes; silent dispatch
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                Discreet
              </span>
            </button>

            {/* Discreet Voice Command Trigger (Safe Word) Card */}
            <div className={`rounded-2xl p-4 border transition-all ${
              isListening
                ? 'bg-rose-950/40 border-rose-500/60 shadow-lg'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-md'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {isListening ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">Discreet Voice Safe Word</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isListening
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isListening ? 'ARMED' : 'STANDBY'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Saying <span className="font-bold text-sky-400 font-mono">"{triggerPhrase}"</span> triggers a Silent SOS without touching your phone.
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        Screen Lock & Background Active
                      </span>
                      {wakeLockActive && (
                        <span className="text-amber-400 font-medium text-[10px]">
                          ● Screen Awake
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      if (isListening) stopListening();
                      else startListening();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                      isListening
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow'
                    }`}
                  >
                    {isListening ? 'Disarm' : 'Arm'}
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 transition"
                    title="Change Safe Word or Test Trigger"
                  >
                    <Settings className="w-3 h-3 text-slate-400" />
                    <span>Setup</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Telephone Helplines */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
              Verified Government Emergency Numbers
            </h4>
            <div className="space-y-2">
              <a
                href="tel:112"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs transition"
              >
                <div>
                  <div className="font-bold text-white">112 National Emergency (ERSS)</div>
                  <div className="text-[11px] text-slate-400">Police, Ambulance, Disaster & Fire pan-India</div>
                </div>
                <span className="font-semibold text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-900">
                  Dial 112
                </span>
              </a>

              <a
                href="tel:181"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs transition"
              >
                <div>
                  <div className="font-bold text-white">181 Women Helpline</div>
                  <div className="text-[11px] text-slate-400">Violence counseling, crisis intervention & One Stop Sakhi referral</div>
                </div>
                <span className="font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-900">
                  Dial 181
                </span>
              </a>

              <a
                href="tel:1930"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs transition"
              >
                <div>
                  <div className="font-bold text-white">1930 Cyber Crime Helpline</div>
                  <div className="text-[11px] text-slate-400">Financial extortion, blackmail & online harassment</div>
                </div>
                <span className="font-semibold text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-900">
                  Dial 1930
                </span>
              </a>
            </div>
          </div>

          {/* Transparent Infrastructure Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              Safety Architecture Notice
            </p>
            <p className="leading-relaxed">
              Aegis acts as a private prevention and notification layer. The application does not impersonate or replace official police dispatch. For immediate life-saving physical intervention, please dial 112 directly.
            </p>
          </div>
        </div>
      )}

      {/* Resolve SOS Confirmation Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl text-slate-100 space-y-4">
            <h3 className="text-base font-bold text-white">Resolve Emergency State</h3>
            <p className="text-xs text-slate-300">
              Confirm that you are safe. This will update the emergency log and notify your contacts that the situation is resolved.
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Safety Note / Reason</label>
              <input
                type="text"
                value={resolveReason}
                onChange={(e) => setResolveReason(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResolveModal(false)}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Keep Active
              </button>
              <button
                onClick={() => {
                  resolveSOS(resolveReason);
                  setShowResolveModal(false);
                }}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                Confirm Safe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
