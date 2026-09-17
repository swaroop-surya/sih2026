import React, { useState } from 'react';
import { useVoiceTrigger } from '../../context/VoiceTriggerContext';
import {
  Mic,
  MicOff,
  Radio,
  Lock,
  Sun,
  Volume2,
  AlertTriangle,
  Check,
  X,
  Play,
  Sparkles,
  ShieldAlert,
  Info,
  Smartphone
} from 'lucide-react';

export const DiscreetVoiceGuardModal: React.FC = () => {
  const {
    isSupported,
    isListening,
    triggerPhrase,
    setTriggerPhrase,
    lastHeardText,
    wakeLockActive,
    keepScreenAwake,
    setKeepScreenAwake,
    backgroundAudioActive,
    setBackgroundAudioActive,
    isTriggered,
    errorMessage,
    startListening,
    stopListening,
    testTrigger,
    clearStatus,
    isModalOpen,
    setIsModalOpen
  } = useVoiceTrigger();

  const [inputPhrase, setInputPhrase] = useState(triggerPhrase);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isModalOpen) return null;

  const handleSavePhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPhrase.trim()) return;
    setTriggerPhrase(inputPhrase);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleToggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  };

  const presetPhrases = [
    'red umbrella',
    'help me now',
    'code silent',
    'order pizza',
    'green tea'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-2xl border transition ${
              isListening
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                : 'bg-sky-500/20 border-sky-500/40 text-sky-400'
            }`}>
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Discreet Voice Guard</h3>
              <p className="text-[11px] text-slate-400">Web Speech API Silent SOS Trigger</p>
            </div>
          </div>
          <button
            onClick={() => {
              clearStatus();
              setIsModalOpen(false);
            }}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Main Arm/Disarm Status Card */}
          <div className={`rounded-2xl p-4 border transition-all ${
            isListening
              ? 'bg-rose-950/40 border-rose-600/60 shadow-lg shadow-rose-950/40'
              : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`relative flex h-11 w-11 items-center justify-center rounded-2xl ${
                  isListening ? 'bg-rose-600 text-white shadow-lg animate-pulse' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isListening ? <Radio className="w-5 h-5 animate-spin" /> : <MicOff className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {isListening ? 'Voice Guard Active' : 'Voice Guard Disarmed'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isListening
                      ? 'Actively listening for your secret trigger word...'
                      : 'Tap to arm discreet background audio surveillance'}
                  </p>
                </div>
              </div>

              <button
                id="btn-toggle-voice-guard"
                onClick={handleToggleListening}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shadow active:scale-95 ${
                  isListening
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                }`}
              >
                {isListening ? 'Disarm' : 'Arm Now'}
              </button>
            </div>

            {/* Error or Warning Banner */}
            {errorMessage && (
              <div className="mt-3 rounded-xl bg-amber-950/50 border border-amber-800/60 p-2.5 text-[11px] text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!isSupported && (
              <div className="mt-3 rounded-xl bg-rose-950/50 border border-rose-800/60 p-2.5 text-[11px] text-rose-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Your browser does not support the Web Speech API. Please open in Google Chrome or Safari.</span>
              </div>
            )}

            {/* Triggered Flash Banner */}
            {isTriggered && (
              <div className="mt-3 rounded-xl bg-rose-600 p-3 text-white font-bold flex items-center justify-between shadow-lg animate-bounce">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Silent Emergency SOS Activated!</span>
                </div>
                <button
                  onClick={clearStatus}
                  className="text-[10px] bg-white/20 px-2 py-0.5 rounded hover:bg-white/30"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Live Audio Transcription Feed */}
            {isListening && (
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-sky-400">
                    <Radio className="w-3 h-3 animate-ping" />
                    Live Speech Detection Feed:
                  </span>
                  <span className="text-[10px] text-slate-400">Speak naturally</span>
                </div>
                <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-2.5 min-h-[44px] flex items-center">
                  <p className="text-xs text-slate-200 italic font-mono">
                    {lastHeardText ? `"${lastHeardText}"` : 'Listening... (Speak your trigger phrase)'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Custom Secret Trigger Phrase Editor */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3">
            <div>
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Your Secret Trigger Safe Word / Phrase:
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                When you say this phrase aloud, Aegis triggers a silent emergency alert to your trusted contacts without making any noise.
              </p>
            </div>

            <form onSubmit={handleSavePhrase} className="flex gap-2">
              <input
                type="text"
                value={inputPhrase}
                onChange={(e) => setInputPhrase(e.target.value)}
                placeholder="e.g. red umbrella"
                className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition flex items-center gap-1"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : 'Save'}
              </button>
            </form>

            {/* Suggestions Chips */}
            <div>
              <p className="text-[10px] text-slate-400 mb-1.5">Discreet phrase suggestions:</p>
              <div className="flex flex-wrap gap-1.5">
                {presetPhrases.map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => {
                      setInputPhrase(phrase);
                      setTriggerPhrase(phrase);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                      triggerPhrase === phrase
                        ? 'bg-sky-500/20 border-sky-500/60 text-sky-300 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Screen Locked & Background Audio Architecture Controls */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Locked Screen & Background Surveillance Settings:
            </h4>

            <div className="space-y-2.5 pt-1">
              {/* Screen Wake Lock */}
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 cursor-pointer">
                <div className="flex items-start gap-2">
                  <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white text-xs">Screen Wake Lock API</p>
                    <p className="text-[10px] text-slate-400">
                      Prevents phone screen from sleeping while Voice Guard is armed.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={keepScreenAwake}
                  onChange={(e) => setKeepScreenAwake(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500"
                />
              </label>

              {/* Background Audio Hardware Keep-Alive */}
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 cursor-pointer">
                <div className="flex items-start gap-2">
                  <Volume2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white text-xs">Inaudible Background Audio Session</p>
                    <p className="text-[10px] text-slate-400">
                      Maintains audio hardware session to keep speech recognition active when screen dims.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={backgroundAudioActive}
                  onChange={(e) => setBackgroundAudioActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500"
                />
              </label>
            </div>

            {/* How it works info */}
            <div className="rounded-xl bg-sky-950/30 border border-sky-800/30 p-2.5 text-[11px] text-sky-300 space-y-1">
              <p className="font-semibold flex items-center gap-1">
                <Info className="w-3 h-3 text-sky-400" />
                How locked-screen voice activation operates:
              </p>
              <p className="text-slate-300 text-[10px] leading-relaxed">
                When Voice Guard is armed, the app acquires a Screen Wake Lock and initiates an inaudible audio context. If your screen dims, continuous recognition loop automatically restarts upon each speech pause. Saying <strong>"{triggerPhrase}"</strong> silently alerts your emergency circle with live GPS coordinates.
              </p>
            </div>
          </div>

          {/* Test Silent Trigger Button */}
          <div className="pt-1">
            <button
              onClick={testTrigger}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 p-3 text-xs font-semibold text-slate-200 transition"
            >
              <Play className="w-3.5 h-3.5 text-rose-400" />
              <span>Test Silent Emergency Alert (Simulation)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className={`h-2 w-2 rounded-full ${isListening ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
            <span>{isListening ? 'Voice Guard Armed' : 'Voice Guard Inactive'}</span>
          </div>
          <button
            onClick={() => {
              clearStatus();
              setIsModalOpen(false);
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
