import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Phone,
  Clock,
  Shield,
  Flag,
  UserX,
  MapPin,
  Calendar
} from 'lucide-react';
import { Volunteer } from '../../types/volunteer';
import { getAliasColor } from '../../lib/nearbyCategories';
import { getHelpTypeMeta, VOLUNTEER_SCHEDULE_SLOTS } from '../../lib/volunteerUtils';
import { formatConfirmationAge } from '../../services/volunteerService';
import { VolunteerReportModal } from './VolunteerReportModal';

interface VolunteerDetailSheetProps {
  volunteer: Volunteer | null;
  onClose: () => void;
  onOpenMessage: (volunteer: Volunteer) => void;
  onReport: (volunteerId: string, reason: string) => Promise<void>;
  onBlock: (volunteerId: string) => Promise<void>;
}

export const VolunteerDetailSheet: React.FC<VolunteerDetailSheetProps> = ({
  volunteer,
  onClose,
  onOpenMessage,
  onReport,
  onBlock
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  if (!volunteer) return null;

  const avatarColor = getAliasColor(volunteer.alias);
  const initialLetter = volunteer.alias.charAt(0).toUpperCase() || 'V';
  const confirmationText = formatConfirmationAge(volunteer.lastConfirmedAt);

  const handleBlock = async () => {
    setIsBlocking(true);
    try {
      await onBlock(volunteer.userId);
      setShowBlockConfirm(false);
      onClose();
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="volunteer-detail-title"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
      >
        <div className="w-full max-w-lg bg-[var(--surface)] border-t sm:border border-[var(--line)] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom-4 duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--muted)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Community volunteer
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition cursor-pointer"
              aria-label="Close volunteer details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pinned Disclaimer */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <p className="font-semibold">Important Community Notice</p>
            <p className="text-[11px] leading-relaxed opacity-90">
              Volunteers are community members who've opted in to help. They are not police or emergency
              responders. For danger, use SOS or call 112.
            </p>
          </div>

          {/* Volunteer Identity Card */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)]">
            <div className="relative shrink-0">
              <div
                className={`w-14 h-14 rounded-full ${avatarColor.bg} ${avatarColor.text} font-bold text-lg flex items-center justify-center shadow-xs select-none`}
              >
                {initialLetter}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[var(--surface-2)] ${
                  volunteer.available ? 'bg-emerald-500' : 'bg-zinc-400 dark:bg-zinc-600'
                }`}
                title={volunteer.available ? 'Available' : 'Away'}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="volunteer-detail-title" className="font-heading font-bold text-lg text-[var(--text)] truncate">
                  {volunteer.alias}
                </h2>
                {volunteer.available ? (
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Available now
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-[var(--muted)] bg-[var(--surface)] px-2 py-0.5 rounded-full border border-[var(--line)]">
                    Currently away
                  </span>
                )}
                {volunteer.isSample && (
                  <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded-md bg-[var(--surface)] text-[var(--muted)] border border-[var(--line)]">
                    Sample
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[var(--muted)] mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{confirmationText}</span>
              </div>

              {/* Areas Covered */}
              <div className="flex items-center gap-1.5 text-xs text-[var(--muted)] mt-1">
                <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Covers {volunteer.areas.length} nearby area{volunteer.areas.length > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Volunteer Note */}
          {volunteer.note && (
            <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] space-y-1">
              <span className="text-xs font-semibold text-[var(--muted)] block">Volunteer note</span>
              <p className="text-xs text-[var(--text)] leading-relaxed italic">
                "{volunteer.note}"
              </p>
            </div>
          )}

          {/* How they can help */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block">
              How they can help
            </span>
            <div className="space-y-2">
              {volunteer.helpTypes.map((type) => {
                const meta = getHelpTypeMeta(type);
                const IconComponent = meta.icon;
                return (
                  <div
                    key={type}
                    className={`p-3 rounded-2xl border ${meta.color} flex items-start gap-3`}
                  >
                    <div className="p-2 rounded-xl bg-[var(--surface)] shadow-2xs mt-0.5">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs block text-[var(--text)]">{meta.label}</span>
                      <p className="text-[11px] text-[var(--muted)] mt-0.5">{meta.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Availability Schedule */}
          {volunteer.availabilitySlots && volunteer.availabilitySlots.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Typical available hours</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {volunteer.availabilitySlots.map((slotKey) => {
                  const slot = VOLUNTEER_SCHEDULE_SLOTS.find((s) => s.key === slotKey);
                  return (
                    <span
                      key={slotKey}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-xl bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)]"
                    >
                      {slot ? `${slot.label} (${slot.period})` : slotKey}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons: Message & Call */}
          <div className="pt-2 space-y-2">
            <div className="flex gap-2.5">
              {/* Message Button: Always available */}
              <button
                type="button"
                onClick={() => {
                  onOpenMessage(volunteer);
                  onClose();
                }}
                className="min-h-[48px] flex-1 rounded-2xl bg-[var(--primary)] text-white dark:text-[#1A1F45] text-xs font-bold flex items-center justify-center gap-2 hover:opacity-95 transition cursor-pointer shadow-xs focus:ring-2 focus:ring-[var(--primary)] active:scale-[0.99]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message In-App</span>
              </button>

              {/* Call Button: ONLY if volunteer explicitly agreed to show phone */}
              {volunteer.showPhone && volunteer.phoneDisplay && (
                <a
                  href={`tel:${volunteer.phoneDisplay.replace(/\s+/g, '')}`}
                  className="min-h-[48px] px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-[0.99]"
                  aria-label={`Call ${volunteer.alias} at ${volunteer.phoneDisplay}`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </a>
              )}
            </div>

            {!volunteer.showPhone && (
              <p className="text-[11px] text-center text-[var(--muted)]">
                This volunteer preferred in-app messaging first. Phone numbers are kept private.
              </p>
            )}
          </div>

          {/* Footer Moderation: Report & Block */}
          <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--muted)]">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 p-2 rounded-xl hover:text-rose-600 hover:bg-rose-500/10 transition cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report volunteer</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBlockConfirm(true)}
              className="flex items-center gap-1.5 p-2 rounded-xl hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition cursor-pointer"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Block from list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <VolunteerReportModal
        isOpen={isReportModalOpen}
        volunteer={volunteer}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={async (reason) => {
          await onReport(volunteer.userId, reason);
        }}
      />

      {/* Block Confirmation Modal */}
      {showBlockConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-heading font-semibold text-sm text-[var(--text)]">
              Block {volunteer.alias}?
            </h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              They will be removed from your volunteers list and won't be able to see or contact you.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBlockConfirm(false)}
                className="min-h-[44px] flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlock}
                disabled={isBlocking}
                className="min-h-[44px] flex-1 rounded-xl bg-[var(--primary)] text-white dark:text-[#1A1F45] text-xs font-semibold hover:opacity-95 transition cursor-pointer shadow-xs"
              >
                {isBlocking ? 'Blocking...' : 'Block Volunteer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
