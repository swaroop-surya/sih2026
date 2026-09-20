import React, { useState } from 'react';
import { NearbyMessage } from '../../types/nearby';
import { getCategoryMeta, getAliasColor, formatRelativeTime } from '../../lib/nearbyCategories';
import { MapPin, CheckCircle2, ThumbsUp, MoreVertical, Flag, UserX } from 'lucide-react';

interface NearbyAlertCardProps {
  alert: NearbyMessage;
  onToggleConfirm: (id: string) => void;
  onToggleFixed: (id: string) => void;
  onReport: (alert: NearbyMessage) => void;
  onBlockUser: (authorId: string, authorAlias: string) => void;
  onViewPin?: (pinGeohash: string) => void;
}

export const NearbyAlertCard: React.FC<NearbyAlertCardProps> = ({
  alert,
  onToggleConfirm,
  onToggleFixed,
  onReport,
  onBlockUser,
  onViewPin
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const meta = getCategoryMeta(alert.category);
  const Icon = meta.icon;
  const aliasColors = getAliasColor(alert.author_alias);
  const initial = alert.author_alias.trim().charAt(0).toUpperCase() || 'A';

  // Fixed Tag: 2 or more fixed votes
  const isFixed = alert.fixed_count >= 2;

  // Old Tag: older than 48h with no confirmation in last 24h
  const now = Date.now();
  const alertTime = new Date(alert.created_at).getTime();
  const ageHours = (now - alertTime) / (1000 * 60 * 60);
  const isOld = ageHours > 48 && alert.confirm_count === 0;

  return (
    <article
      id={`alert-card-${alert.id}`}
      className={`rounded-[16px] border p-4 transition-all bg-[var(--surface)] text-[var(--text)] shadow-xs ${
        isFixed
          ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
          : isOld
          ? 'border-[var(--line)] opacity-80'
          : 'border-[var(--line)] hover:border-[var(--line-focus)]'
      }`}
    >
      {/* Header: Category Badge + Status Tags + Overflow Menu */}
      <div className="flex items-center justify-between gap-2 pb-2.5">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          {/* Category Chip */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border ${meta.color}`}>
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{meta.label}</span>
          </div>

          {/* Fixed Tag */}
          {isFixed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
              <CheckCircle2 className="w-3 h-3" />
              Fixed
            </span>
          )}

          {/* Old Tag */}
          {isOld && !isFixed && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]">
              Old
            </span>
          )}

          {/* Sample Tag */}
          {alert.isSample && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25">
              Sample
            </span>
          )}
        </div>

        {/* Action Menu (Report / Block) */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition cursor-pointer"
            aria-label="More options for this alert"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowMenu(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-9 z-30 w-44 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] shadow-xl py-1 text-xs animate-in fade-in">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onReport(alert);
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2 text-left hover:bg-[var(--surface-2)] text-[var(--text)] transition cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Report alert</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onBlockUser(alert.author_id, alert.author_alias);
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2 text-left hover:bg-[var(--surface-2)] text-red-500 transition cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Block user</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body: Plain escaped text without clickable links or phone numbers */}
      <p className="text-[14.5px] leading-relaxed text-[var(--text)] font-normal whitespace-pre-wrap break-words select-text">
        {alert.body}
      </p>

      {/* Metadata Row: Author Alias Initial + Time + Approximate Pin link */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-xs text-[var(--muted)] border-t border-[var(--line)]/50 mt-3">
        <div className="flex items-center gap-2">
          {/* Alias badge */}
          <div className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${aliasColors.bg} ${aliasColors.text}`}>
              {initial}
            </div>
            <span className="font-medium text-[var(--text)] text-[12px]">
              {alert.author_alias}
            </span>
          </div>

          <span>•</span>
          <time dateTime={alert.created_at} className="text-[12px]">
            {formatRelativeTime(alert.created_at)}
          </time>
        </div>

        {/* Approximate Pin Link */}
        {alert.pin_geohash && (
          <button
            type="button"
            onClick={() => onViewPin && onViewPin(alert.pin_geohash!)}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--primary)] hover:underline cursor-pointer min-h-[32px] px-1"
            title="Approximate location (~150m privacy radius)"
          >
            <MapPin className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Approx pin (~150 m)</span>
          </button>
        )}
      </div>

      {/* Action Buttons: "I see this too" and "It's fixed" (Min 48px touch targets) */}
      <div className="grid grid-cols-2 gap-2 pt-3 mt-1">
        <button
          type="button"
          onClick={() => onToggleConfirm(alert.id)}
          className={`min-h-[44px] px-3 py-2 rounded-full border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer active:scale-98 ${
            alert.userConfirmed
              ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)] shadow-xs'
              : 'bg-[var(--surface-2)] text-[var(--text)] border-[var(--line)] hover:bg-[var(--surface)]'
          }`}
          aria-label={`I see this too, ${alert.confirm_count} confirmations`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${alert.userConfirmed ? 'fill-current' : ''}`} />
          <span>I see this too</span>
          {alert.confirm_count > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[11px] bg-black/10 dark:bg-white/10 font-bold">
              {alert.confirm_count}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onToggleFixed(alert.id)}
          className={`min-h-[44px] px-3 py-2 rounded-full border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer active:scale-98 ${
            alert.userFixed
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-[var(--surface-2)] text-[var(--text)] border-[var(--line)] hover:bg-[var(--surface)]'
          }`}
          aria-label={`It's fixed, ${alert.fixed_count} fixed votes`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${alert.userFixed ? 'fill-current' : ''}`} />
          <span>It's fixed</span>
          {alert.fixed_count > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[11px] bg-black/10 dark:bg-white/10 font-bold">
              {alert.fixed_count}
            </span>
          )}
        </button>
      </div>
    </article>
  );
};
