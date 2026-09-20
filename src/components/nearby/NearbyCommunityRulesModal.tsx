import React from 'react';
import { ShieldCheck, HeartHandshake, PhoneOff, UserCheck, AlertOctagon } from 'lucide-react';

interface NearbyCommunityRulesModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export const NearbyCommunityRulesModal: React.FC<NearbyCommunityRulesModalProps> = ({
  isOpen,
  onAccept,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-title"
    >
      <div
        className="w-full max-w-md rounded-[24px] bg-[var(--surface)] border border-[var(--line)] shadow-2xl p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-4 mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h2 id="rules-title" className="text-xl font-bold text-[var(--text)] text-center mb-1.5">
          Community Rules
        </h2>
        <p className="text-xs text-[var(--muted)] text-center mb-5">
          Abhaya Nearby connects you with neighbours in your physical area. To keep everyone safe and trusted, please follow these community commitments:
        </p>

        <div className="space-y-3.5 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-[14px] bg-[var(--surface-2)] border border-[var(--line)]">
            <HeartHandshake className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[var(--text)]">Be kind & supportive</div>
              <div className="text-[11.5px] text-[var(--muted)] leading-relaxed">
                Treat neighbours with respect and care. No harassment, hate speech, or abuse.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-[14px] bg-[var(--surface-2)] border border-[var(--line)]">
            <PhoneOff className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[var(--text)]">No phone numbers or web links</div>
              <div className="text-[11.5px] text-[var(--muted)] leading-relaxed">
                For everyone's safety, never share phone numbers, emails, or external links.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-[14px] bg-[var(--surface-2)] border border-[var(--line)]">
            <UserCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[var(--text)]">No names of private individuals</div>
              <div className="text-[11.5px] text-[var(--muted)] leading-relaxed">
                Describe situations and locations, never name or single out private individuals.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-[14px] bg-red-500/10 border border-red-500/20">
            <AlertOctagon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-red-600 dark:text-red-400">Call 112 for emergencies</div>
              <div className="text-[11.5px] text-red-600/90 dark:text-red-400/90 leading-relaxed">
                This is a volunteer community board. In life-threatening emergencies, always dial 112 directly.
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="w-full min-h-[48px] rounded-full bg-[var(--primary)] text-[var(--primary-fg)] text-xs font-bold transition hover:opacity-95 cursor-pointer shadow-sm active:scale-98"
          >
            I Agree & Continue
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] rounded-full text-xs font-medium text-[var(--muted)] hover:text-[var(--text)] transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
