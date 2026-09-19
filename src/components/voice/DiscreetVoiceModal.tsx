import React, { useState } from 'react';
import { useVoiceTrigger } from '../../context/VoiceTriggerContext';
import { useTranslation } from '../../hooks/useTranslation';
import {
  Mic,
  MicOff,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  Volume2,
  ShieldCheck
} from 'lucide-react';

interface DiscreetVoiceModalProps {
  onClose: () => void;
}

export const DiscreetVoiceModal: React.FC<DiscreetVoiceModalProps> = ({ onClose }) => {
  const {
    isSupported,
    isListening,
    triggerPhrase,
    setTriggerPhrase,
    startListening,
    stopListening,
    testTrigger,
    lastHeardText,
    isTriggered,
    keepScreenAwake,
    setKeepScreenAwake,
    backgroundAudioActive,
    setBackgroundAudioActive,
    errorMessage
  } = useVoiceTrigger();

  const { t } = useTranslation();

  const [phraseInput, setPhraseInput] = useState(triggerPhrase);
  const [showPhrase, setShowPhrase] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phraseInput.trim()) return;
    setTriggerPhrase(phraseInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="soft-card w-full max-w-sm p-5 space-y-4 bg-[var(--surface)] border border-[var(--line)] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--safe)]/15 text-[var(--safe)] flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="section-title text-base">{t.voiceSafeWordTitle || 'Voice safe word'}</h3>
              <p className="text-caption text-xs">Hands-free emergency activation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--muted)] hover:text-[var(--text)] transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Browser capability banner */}
        {!isSupported ? (
          <div className="p-3 rounded-[12px] bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500">
            Microphone voice recognition is not supported in this browser. You can still use the 1.5s SOS hold button.
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-[14px] bg-[var(--surface-2)]">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-emerald-500 animate-pulse' : 'bg-[var(--muted)]'}`} />
              <span className="text-xs font-semibold text-[var(--text)]">
                {isListening ? 'Voice detection active' : 'Voice detection off'}
              </span>
            </div>
            <button
              onClick={() => {
                if (isListening) stopListening();
                else startListening();
              }}
              className={`soft-btn h-8 px-3 text-xs ${
                isListening ? 'soft-btn-secondary text-rose-500' : 'soft-btn-primary'
              }`}
            >
              {isListening ? 'Turn off' : 'Turn on'}
            </button>
          </div>
        )}

        {/* Change Safe Word Form */}
        <form onSubmit={handleSavePhrase} className="space-y-2">
          <label className="text-xs font-semibold text-[var(--text)] block">
            Emergency Phrase
          </label>
          <div className="relative flex items-center">
            <input
              type={showPhrase ? 'text' : 'password'}
              value={phraseInput}
              onChange={(e) => setPhraseInput(e.target.value)}
              placeholder="e.g. red umbrella"
              className="soft-input w-full pr-10 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPhrase(!showPhrase)}
              className="absolute right-3 text-[var(--muted)] hover:text-[var(--text)] p-1"
              aria-label={showPhrase ? 'Hide phrase' : 'Show phrase'}
            >
              {showPhrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-caption text-[11px]">
            Choose a common, casual phrase you can speak without raising suspicion.
          </p>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className="soft-btn soft-btn-primary h-8 px-3 text-xs"
            >
              Save phrase
            </button>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Updated
              </span>
            )}
          </div>
        </form>

        {/* Hearing status & test trigger */}
        {isListening && (
          <div className="p-3 rounded-[14px] bg-[var(--surface-2)] space-y-1 text-xs">
            <span className="text-[11px] font-semibold text-[var(--muted)] block">Last heard audio:</span>
            <p className="font-mono text-xs text-[var(--text)] truncate">
              {lastHeardText || 'Listening for phrase in background...'}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="p-2.5 rounded-[12px] bg-rose-500/10 text-rose-500 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Discreet Settings */}
        <div className="space-y-3 pt-2 border-t border-[var(--line)]">
          <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
            Detection Settings
          </h4>

          {/* Screen active switch */}
          <div className="flex items-center justify-between">
            <div className="pr-2">
              <span className="text-xs font-semibold text-[var(--text)] block">
                Keep screen active
              </span>
              <span className="text-caption text-[11px] block">
                Prevents phone lock while voice detection is running
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={keepScreenAwake}
                onChange={(e) => setKeepScreenAwake(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--surface-2)] border border-[var(--line)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--safe)]" />
            </label>
          </div>

          {/* Background audio switch */}
          <div className="flex items-center justify-between">
            <div className="pr-2">
              <span className="text-xs font-semibold text-[var(--text)] block">
                Continuous listening
              </span>
              <span className="text-caption text-[11px] block">
                Keeps listening in background during commutes
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={backgroundAudioActive}
                onChange={(e) => setBackgroundAudioActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--surface-2)] border border-[var(--line)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--safe)]" />
            </label>
          </div>
        </div>

        {/* Test voice trigger button */}
        <div className="pt-2 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={testTrigger}
            className="soft-btn soft-btn-secondary w-full text-xs"
          >
            <Volume2 className="w-3.5 h-3.5 mr-1.5 text-[var(--safe)]" />
            Simulate safe word detection
          </button>
        </div>
      </div>
    </div>
  );
};
