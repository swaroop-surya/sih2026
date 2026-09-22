import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Volunteer } from '../../types/volunteer';

interface VolunteerReportModalProps {
  isOpen: boolean;
  volunteer: Volunteer | null;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}

const REPORT_REASONS = [
  'Inappropriate or unsafe behaviour',
  'Demanded money or personal contact outside app',
  'Unresponsive or fake listing',
  'Harassment or disrespectful language',
  'Other safety concern'
];

export const VolunteerReportModal: React.FC<VolunteerReportModalProps> = ({
  isOpen,
  volunteer,
  onClose,
  onSubmit
}) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [customDetail, setCustomDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !volunteer) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason =
      customDetail.trim().length > 0 ? `${selectedReason}: ${customDetail.trim()}` : selectedReason;

    setIsSubmitting(true);
    try {
      await onSubmit(finalReason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-volunteer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h2 id="report-volunteer-title" className="font-heading font-semibold text-base text-[var(--text)]">
              Report {volunteer.alias}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition cursor-pointer"
            aria-label="Close report dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[var(--muted)]">
          Abhaya relies on community reports to keep everyone safe. If a volunteer receives 3 reports, they
          are immediately removed from all listings pending moderation review.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text)] block">Reason for report</label>
            <div className="space-y-1.5">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedReason === r
                      ? 'border-rose-500 bg-rose-500/10 text-[var(--text)] font-semibold'
                      : 'border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="volunteer_report_reason"
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className="accent-rose-600"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text)] block mb-1">
              Additional details (optional)
            </label>
            <textarea
              value={customDetail}
              onChange={(e) => setCustomDetail(e.target.value)}
              placeholder="Provide any context that will assist moderation..."
              rows={3}
              maxLength={280}
              className="w-full text-xs p-3 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-hidden focus:ring-2 focus:ring-rose-500 placeholder-[var(--muted)]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[48px] flex-1 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
