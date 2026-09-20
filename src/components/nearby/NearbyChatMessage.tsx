import React, { useState } from 'react';
import { NearbyMessage } from '../../types/nearby';
import { getAliasColor, formatRelativeTime } from '../../lib/nearbyCategories';
import { MoreVertical, Flag, UserX } from 'lucide-react';

interface NearbyChatMessageProps {
  message: NearbyMessage;
  isMe: boolean;
  onReport?: (message: NearbyMessage) => void;
  onBlockUser?: (authorId: string, authorAlias: string) => void;
}

export const NearbyChatMessage: React.FC<NearbyChatMessageProps> = ({
  message,
  isMe,
  onReport,
  onBlockUser
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const aliasColors = getAliasColor(message.author_alias);
  const initial = message.author_alias.trim().charAt(0).toUpperCase() || 'A';

  // System line (e.g. room switched notice)
  if (message.kind === 'system') {
    return (
      <div className="py-2.5 flex justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--line)] text-xs text-[var(--muted)]">
          <span>{message.body}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`chat-msg-${message.id}`}
      className={`flex flex-col mb-3.5 group ${isMe ? 'items-end' : 'items-start'}`}
    >
      {/* Header: Alias + Initial (Others on left, mine on right) */}
      <div className={`flex items-center gap-1.5 mb-1 px-1 text-xs text-[var(--muted)] ${isMe ? 'flex-row-reverse' : ''}`}>
        <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold text-[9px] ${aliasColors.bg} ${aliasColors.text}`}>
          {initial}
        </div>
        <span className="font-medium text-[var(--text)] text-[12px]">
          {isMe ? 'You' : message.author_alias}
        </span>
        {message.isSample && (
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Sample
          </span>
        )}
        <span>•</span>
        <time dateTime={message.created_at} className="text-[11px]">
          {formatRelativeTime(message.created_at)}
        </time>
      </div>

      {/* Bubble + Menu wrapper */}
      <div className={`relative flex items-end gap-1.5 max-w-[85%] sm:max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Message Bubble: Plain escaped text without links */}
        <div
          className={`px-3.5 py-2.5 rounded-[16px] text-[14px] leading-relaxed break-words shadow-2xs whitespace-pre-wrap select-text ${
            isMe
              ? 'bg-[var(--primary)] text-[var(--primary-fg)] rounded-tr-xs'
              : 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] rounded-tl-xs'
          }`}
        >
          {message.body}
        </div>

        {/* Action Menu on others' messages */}
        {!isMe && onReport && onBlockUser && (
          <div className="relative shrink-0 opacity-80 group-hover:opacity-100 transition">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] cursor-pointer"
              aria-label="Options for this chat message"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                  aria-hidden="true"
                />
                <div className="absolute left-0 bottom-7 z-30 w-40 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] shadow-xl py-1 text-xs animate-in fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onReport(message);
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2 text-left hover:bg-[var(--surface-2)] text-[var(--text)] cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5 text-amber-500" />
                    <span>Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onBlockUser(message.author_id, message.author_alias);
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2 text-left hover:bg-[var(--surface-2)] text-red-500 cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Block</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
