import React, { useState } from 'react';
import { NEARBY_CATEGORIES } from '../../lib/nearbyCategories';
import { NearbyAlertCategory } from '../../types/nearby';
import { X, MapPin, AlertTriangle, Send } from 'lucide-react';

interface NearbyReportSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: {
    category: NearbyAlertCategory;
    body: string;
    addPin: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
}

export const NearbyReportSheet: React.FC<NearbyReportSheetProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NearbyAlertCategory>('no_street_light');
  const [body, setBody] = useState('');
  const [addPin, setAddPin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      setErrorMessage('Please describe what you observed.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await onSubmit({
      category: selectedCategory,
      body: body.trim(),
      addPin
    });

    setIsSubmitting(false);
    if (res.success) {
      setBody('');
      onClose();
    } else {
      setErrorMessage(res.error || 'Failed to post alert. Please try again.');
    }
  };

  const charsLeft = 280 - body.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-sheet-title"
    >
      <div
        className="w-full max-w-lg rounded-t-[24px] sm:rounded-[24px] bg-[var(--surface)] border border-[var(--line)] shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <div>
            <h2 id="report-sheet-title" className="text-lg font-bold text-[var(--text)]">
              Report something to neighbours
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Notify people in this 5 km × 5 km area of a safety condition
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
              Select Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NEARBY_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`min-h-[48px] px-3 py-2 rounded-[12px] border text-left flex items-center gap-2 transition cursor-pointer text-xs ${
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text)] font-bold shadow-xs'
                        : 'border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[var(--primary)]' : ''}`} />
                    <span className="truncate leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="alert-body-input" className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                What's going on?
              </label>
              <span className={`text-[11px] font-mono ${charsLeft < 20 ? 'text-red-500 font-bold' : 'text-[var(--muted)]'}`}>
                {charsLeft} / 280
              </span>
            </div>
            <textarea
              id="alert-body-input"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="e.g. No street lights on this road between 4th Cross and the bus shelter..."
              maxLength={280}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-hidden focus:border-[var(--line-focus)] resize-none"
            />
          </div>

          {/* Approximate Pin Switch */}
          <div className="flex items-center justify-between p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)]">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <MapPin className="w-4 h-4 text-[var(--primary)] shrink-0" />
              <div>
                <div className="text-xs font-semibold text-[var(--text)]">
                  Add an approximate pin (about 150 m)
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  Exact location is never stored or shown (precision 7 geohash)
                </div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={addPin}
              onClick={() => setAddPin((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                addPin ? 'bg-[var(--primary)]' : 'bg-[var(--line)]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  addPin ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="p-3 rounded-[12px] bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[48px] rounded-full border border-[var(--line)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !body.trim()}
              className="flex-1 min-h-[48px] rounded-full bg-[var(--primary)] text-[var(--primary-fg)] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? (
                <span>Posting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Alert</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
