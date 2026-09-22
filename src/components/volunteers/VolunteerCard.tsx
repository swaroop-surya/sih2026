import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { Volunteer } from '../../types/volunteer';
import { getAliasColor } from '../../lib/nearbyCategories';
import { getHelpTypeMeta } from '../../lib/volunteerUtils';
import { formatConfirmationAge } from '../../services/volunteerService';

interface VolunteerCardProps {
  volunteer: Volunteer;
  onSelect: (volunteer: Volunteer) => void;
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({ volunteer, onSelect }) => {
  const avatarColor = getAliasColor(volunteer.alias);
  const initialLetter = volunteer.alias.charAt(0).toUpperCase() || 'V';
  const confirmationText = formatConfirmationAge(volunteer.lastConfirmedAt);

  return (
    <button
      type="button"
      onClick={() => onSelect(volunteer)}
      className="w-full text-left rounded-[18px] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-2)] p-3.5 transition cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] active:scale-[0.99] group"
      aria-label={`View volunteer profile for ${volunteer.alias}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Avatar + Details */}
        <div className="flex items-start gap-3 min-w-0">
          {/* Avatar with Status Dot */}
          <div className="relative shrink-0 mt-0.5">
            <div
              className={`w-11 h-11 rounded-full ${avatarColor.bg} ${avatarColor.text} font-bold text-sm flex items-center justify-center shadow-xs select-none`}
            >
              {initialLetter}
            </div>
            {/* Status Dot */}
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[var(--surface)] ${
                volunteer.available ? 'bg-emerald-500' : 'bg-zinc-400 dark:bg-zinc-600'
              }`}
              title={volunteer.available ? 'Available' : 'Away'}
              aria-label={volunteer.available ? 'Available' : 'Away'}
            />
          </div>

          {/* Text Information */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading font-semibold text-[15px] text-[var(--text)] truncate">
                {volunteer.alias}
              </span>

              {volunteer.available ? (
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Available
                </span>
              ) : (
                <span className="text-[11px] font-medium text-[var(--muted)] bg-[var(--surface-2)] px-2 py-0.5 rounded-full border border-[var(--line)]">
                  Away
                </span>
              )}

              {volunteer.isSample && (
                <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded-md bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]">
                  Sample
                </span>
              )}
            </div>

            {/* Note preview if present */}
            {volunteer.note && (
              <p className="text-xs text-[var(--muted)] line-clamp-1 mt-1 font-normal">
                "{volunteer.note}"
              </p>
            )}

            {/* Help Type Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {volunteer.helpTypes.map((type) => {
                const meta = getHelpTypeMeta(type);
                const IconComponent = meta.icon;
                return (
                  <span
                    key={type}
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${meta.color}`}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span>{meta.label}</span>
                  </span>
                );
              })}
            </div>

            {/* Last confirmed freshness */}
            <div className="flex items-center gap-1 text-[11px] text-[var(--muted)] mt-2">
              <Clock className="w-3 h-3" />
              <span>{confirmationText}</span>
            </div>
          </div>
        </div>

        {/* Right: Chevron */}
        <ChevronRight className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--text)] group-hover:translate-x-0.5 transition shrink-0 mt-3" />
      </div>
    </button>
  );
};
