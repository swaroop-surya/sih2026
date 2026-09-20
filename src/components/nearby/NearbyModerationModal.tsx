import React, { useState } from 'react';
import { NearbyMessage } from '../../types/nearby';
import { Flag, UserX, X, AlertTriangle } from 'lucide-react';

interface NearbyModerationModalProps {
  type: 'report' | 'block';
  targetMessage?: NearbyMessage | null;
  targetUser?: { id: string; alias: string } | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (messageId: string, reason: string) => Promise<void>;
  onSubmitBlock: (authorId: string) => Promise<void>;
}

export const NearbyModerationModal: React.FC<NearbyModerationModalProps> = ({
  type,
  targetMessage,
  targetUser,
  isOpen,
  onClose,
  onSubmitReport,
  onSubmitBlock
}) => {
  const [selectedReason, setSelectedReason] = useState('Inaccurate information');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    'Inaccurate or misleading information',
    'Inappropriate language or tone',
    'Contains phone number, email, or link',
    'Names or singles out a private person',
    'Harassment, trolling, or spam',
    'Other safety concern'
  ];

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMessage) return;
    setIsSubmitting(true);
    const reasonToSend = selectedReason === 'Other safety concern' && customReason.trim()
      ? customReason.trim()
      : selectedReason;
    await onSubmitReport(targetMessage.id, reasonToSend);
    setIsSubmitting(false);
    onClose();
  };

  const handleBlock = async () => {
    const uid = targetUser?.id || targetMessage?.author_id;
    if (!uid) return;
    setIsSubmitting(true);
    await onSubmitBlock(uid);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-[24px] bg-[var(--surface)] border border-[var(--line)] shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            {type === 'report' ? (
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Flag className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                <UserX className="w-4 h-4" />
              </div>
            )}
            <h3 className="text-base font-bold text-[var(--text)]">
              {type === 'report' ? 'Report Message' : 'Block User'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {type === 'report' ? (
          <form onSubmit={handleReport} className="mt-4 space-y-4">
            <p className="text-xs text-[var(--muted)]">
              Reports help keep our community safe. Messages with 3 community reports are automatically hidden.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Select Reason
              </label>
              {reasons.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2.5 p-2.5 rounded-[12px] border border-[var(--line)] hover:bg-[var(--surface-2)] cursor-pointer text-xs text-[var(--text)]"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={r}
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className="accent-[var(--primary)]"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            {selectedReason === 'Other safety concern' && (
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Briefly explain the issue..."
                className="w-full px-3 py-2 text-xs rounded-[10px] bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)]"
              />
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[48px] rounded-full border border-[var(--line)] text-xs font-semibold text-[var(--text)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 min-h-[48px] rounded-full bg-amber-600 text-white text-xs font-bold transition hover:bg-amber-700 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="p-3.5 rounded-[14px] bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">
                  Block {targetUser?.alias || targetMessage?.author_alias || 'this user'}?
                </p>
                <p className="leading-relaxed">
                  You will no longer see any messages or alerts posted by this user in any area room. You can manage blocks in your privacy settings.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[48px] rounded-full border border-[var(--line)] text-xs font-semibold text-[var(--text)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlock}
                disabled={isSubmitting}
                className="flex-1 min-h-[48px] rounded-full bg-red-600 text-white text-xs font-bold transition hover:bg-red-700 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Blocking...' : 'Confirm Block'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
