import React, { useState, useEffect, useRef } from 'react';
import { X, Send, AlertTriangle, Shield, Clock } from 'lucide-react';
import { useVolunteers } from '../../context/VolunteerContext';
import { useAuth } from '../../context/AuthContext';
import { getAliasColor, formatRelativeTime } from '../../lib/nearbyCategories';

export const DirectChatModal: React.FC = () => {
  const {
    activeDirectThread,
    activeChatVolunteer,
    directMessages,
    closeDirectChat,
    sendDirectMsg
  } = useVolunteers();

  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUserId = user?.id || 'demo-user-me';

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [directMessages]);

  // Focus input on open
  useEffect(() => {
    if (activeDirectThread) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [activeDirectThread]);

  if (!activeDirectThread || !activeChatVolunteer) return null;

  const volunteerColor = getAliasColor(activeChatVolunteer.alias);
  const volunteerInitial = activeChatVolunteer.alias.charAt(0).toUpperCase() || 'V';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || isSending) return;

    setErrorMsg(null);
    setIsSending(true);

    try {
      const result = await sendDirectMsg(text);
      if (!result.success) {
        setErrorMsg(result.error || 'Failed to send message.');
      } else {
        setInputText('');
      }
    } catch {
      setErrorMsg('Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="direct-chat-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
    >
      <div className="w-full max-w-lg bg-[var(--surface)] border-t sm:border border-[var(--line)] rounded-t-3xl sm:rounded-3xl shadow-2xl h-[92vh] sm:h-[600px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="p-3.5 px-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--surface)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full ${volunteerColor.bg} ${volunteerColor.text} font-bold text-sm flex items-center justify-center shadow-xs select-none`}
              >
                {volunteerInitial}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--surface)] ${
                  activeChatVolunteer.available ? 'bg-emerald-500' : 'bg-zinc-400 dark:bg-zinc-600'
                }`}
                title={activeChatVolunteer.available ? 'Available' : 'Away'}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 id="direct-chat-title" className="font-heading font-semibold text-sm text-[var(--text)] truncate">
                  {activeChatVolunteer.alias}
                </h2>
                {activeChatVolunteer.isSample && (
                  <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.2 rounded-md bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]">
                    Sample
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--muted)] flex items-center gap-1">
                <span>Community volunteer</span>
                <span>•</span>
                <span>Direct message</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDirectChat}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition cursor-pointer"
            aria-label="Close direct chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pinned Safety Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-3.5 py-2 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2 shrink-0">
          <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="leading-snug">
            For personal privacy, messages cannot contain links, emails, or phone numbers. In danger, dial 112.
          </span>
        </div>

        {/* Messages Feed */}
        <div
          aria-live="polite"
          className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[var(--surface-2)]/40"
        >
          {directMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--muted)] space-y-2">
              <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)] border border-[var(--line)]">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-xs text-[var(--text)]">Direct chat started</h3>
              <p className="text-xs max-w-xs leading-relaxed">
                Send a message to coordinate route accompaniment, check safe spots, or ask for guidance.
              </p>
            </div>
          ) : (
            directMessages.map((msg) => {
              const isMe = msg.authorId === currentUserId;
              const authorAlias = isMe ? 'You' : msg.authorAlias || activeChatVolunteer.alias;
              const colors = getAliasColor(authorAlias);
              const initial = authorAlias.charAt(0).toUpperCase() || 'A';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col mb-3 group ${isMe ? 'items-end' : 'items-start'}`}
                >
                  {/* Message Meta Header */}
                  <div
                    className={`flex items-center gap-1.5 mb-1 px-1 text-xs text-[var(--muted)] ${
                      isMe ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] ${colors.bg} ${colors.text}`}
                    >
                      {initial}
                    </div>
                    <span className="font-medium text-[var(--text)] text-[11px]">{authorAlias}</span>
                    <span>•</span>
                    <time dateTime={msg.createdAt} className="text-[10px]">
                      {formatRelativeTime(msg.createdAt)}
                    </time>
                  </div>

                  {/* Speech Bubble */}
                  <div
                    className={`px-3.5 py-2.5 rounded-[16px] text-xs leading-relaxed break-words shadow-2xs whitespace-pre-wrap max-w-[85%] sm:max-w-[75%] ${
                      isMe
                        ? 'bg-[var(--primary)] text-white dark:text-[#1A1F45] rounded-tr-xs font-medium'
                        : 'bg-[var(--surface)] text-[var(--text)] border border-[var(--line)] rounded-tl-xs'
                    }`}
                  >
                    {msg.body}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="px-4 py-2 bg-rose-500/10 border-t border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{errorMsg}</span>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="text-xs hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-[var(--surface)] border-t border-[var(--line)] flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message (no phones, emails or links)..."
            maxLength={280}
            disabled={isSending}
            className="flex-1 min-h-[48px] px-3.5 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] placeholder-[var(--muted)]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="min-h-[48px] min-w-[48px] px-4 rounded-xl bg-[var(--primary)] text-white dark:text-[#1A1F45] flex items-center justify-center transition disabled:opacity-40 cursor-pointer shadow-xs active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
