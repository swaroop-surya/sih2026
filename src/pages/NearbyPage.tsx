import React, { useState, useRef, useEffect } from 'react';
import { useNearby } from '../context/NearbyContext';
import { useAuth } from '../context/AuthContext';
import { useAegis } from '../hooks/useAegisState';
import { useTranslation } from '../hooks/useTranslation';
import { NearbyMiniMap } from '../components/nearby/NearbyMiniMap';
import { NearbyAlertCard } from '../components/nearby/NearbyAlertCard';
import { NearbyChatMessage } from '../components/nearby/NearbyChatMessage';
import { NearbyReportSheet } from '../components/nearby/NearbyReportSheet';
import { NearbyCommunityRulesModal } from '../components/nearby/NearbyCommunityRulesModal';
import { NearbyModerationModal } from '../components/nearby/NearbyModerationModal';
import { NearbyMessage, NearbyAlertCategory } from '../types/nearby';
import {
  ArrowLeft,
  Phone,
  AlertTriangle,
  Send,
  PlusCircle,
  MapPin,
  Compass,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  X,
  Users
} from 'lucide-react';
import { useVolunteers } from '../context/VolunteerContext';
import { VolunteersListTab } from '../components/volunteers/VolunteersListTab';

export const NearbyPage: React.FC = () => {
  const {
    userCoords,
    userAreaId,
    activeRoomId,
    activeArea,
    neighborAreas,
    messages,
    isLoadingArea,
    isLoadingMessages,
    hasMoreMessages,
    loadOlderMessages,
    locationPermissionStatus,
    roomSwitchBanner,
    clearRoomSwitchBanner,
    showSampleActivity,
    setShowSampleActivity,
    hasAcceptedRules,
    acceptRules,
    postMessage,
    toggleConfirm,
    toggleFixed,
    reportMessage,
    blockUser,
    setActiveRoom,
    resetToUserArea,
    requestLocation,
    searchAndSelectArea,
    isReportSheetOpen,
    setIsReportSheetOpen,
    activeNearbyTab,
    setActiveNearbyTab
  } = useNearby();

  const {
    availableCount,
    volunteers,
    setSelectedVolunteer
  } = useVolunteers();
  const { communityProfile } = useAuth();
  const { setCurrentPage, profile } = useAegis();
  const { t } = useTranslation();

  const [chatInput, setChatInput] = useState('');
  const [isPostingChat, setIsPostingChat] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Modals & Sheets
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'chat' | 'alert' | null>(null);

  // Intercept if opened externally before rules are accepted
  useEffect(() => {
    if (isReportSheetOpen && !hasAcceptedRules) {
      setIsReportSheetOpen(false);
      setPendingAction('alert');
      setIsRulesModalOpen(true);
    }
  }, [isReportSheetOpen, hasAcceptedRules, setIsReportSheetOpen]);

  // Moderation modal
  const [moderationState, setModerationState] = useState<{
    isOpen: boolean;
    type: 'report' | 'block';
    message?: NearbyMessage | null;
    user?: { id: string; alias: string } | null;
  }>({
    isOpen: false,
    type: 'report'
  });

  // Search input for location denied mode
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showSearchBox, setShowSearchBox] = useState(false);

  // Mini map expansion toggle
  const [showMap, setShowMap] = useState(true);

  // Current user's alias
  const currentAlias = communityProfile?.alias || profile.name || 'Neighbour';

  // Read-only state: User is viewing an area outside their physical cell, or location is off
  const isReadOnly = Boolean(
    (userAreaId && activeRoomId !== userAreaId) || locationPermissionStatus === 'denied'
  );

  // Filter messages based on active tab
  const filteredMessages = messages.filter((m) => {
    if (activeNearbyTab === 'alerts') return m.kind === 'alert';
    if (activeNearbyTab === 'chat') return m.kind === 'chat' || m.kind === 'system';
    return true;
  });

  const alerts = messages.filter((m) => m.kind === 'alert');

  // Handle Chat Submit
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isPostingChat) return;

    if (!hasAcceptedRules) {
      setPendingAction('chat');
      setIsRulesModalOpen(true);
      return;
    }

    setIsPostingChat(true);
    setChatError(null);

    const res = await postMessage({
      kind: 'chat',
      body: chatInput.trim()
    });

    setIsPostingChat(false);
    if (res.success) {
      setChatInput('');
    } else {
      setChatError(res.error || 'Failed to send message.');
    }
  };

  const handleOpenReportSheet = () => {
    if (!hasAcceptedRules) {
      setPendingAction('alert');
      setIsRulesModalOpen(true);
      return;
    }
    setIsReportSheetOpen(true);
  };

  const handleRulesAccepted = () => {
    acceptRules();
    setIsRulesModalOpen(false);
    if (pendingAction === 'alert') {
      setIsReportSheetOpen(true);
    } else if (pendingAction === 'chat' && chatInput.trim()) {
      handleSendChat({ preventDefault: () => {} } as React.FormEvent);
    }
    setPendingAction(null);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    const res = await searchAndSelectArea(searchQuery);
    setIsSearching(false);
    if (!res.success) {
      setSearchError(res.error || 'Area not found');
    } else {
      setShowSearchBox(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] flex flex-col pb-24 animate-in fade-in duration-200">
      {/* 1. Header with Back Button and Area Title */}
      <header className="sticky top-0 z-30 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--line)] px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface-2)] transition cursor-pointer shrink-0"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-[var(--text)] truncate">
                  {isLoadingArea ? 'Locating area...' : activeArea?.name || `Area ${activeRoomId.toUpperCase()}`}
                </h1>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)] shrink-0">
                  {activeRoomId}
                </span>
              </div>
              <div className="text-xs text-[var(--muted)] truncate">
                {activeArea?.sw_label && activeArea?.ne_label
                  ? `From ${activeArea.sw_label} to ${activeArea.ne_label}`
                  : '5 km × 5 km physical room'}
              </div>
            </div>
          </div>

          {/* Quick controls: Map toggle & Search toggle */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setShowSearchBox((prev) => !prev)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition cursor-pointer"
              aria-label="Search an area"
              title="Search an area"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowMap((prev) => !prev)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                showMap
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
              }`}
              aria-label="Toggle map view"
              title="Toggle cell map"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar when expanded */}
        {showSearchBox && (
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto mt-2.5 pt-2 border-t border-[var(--line)]">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, neighborhood or ward (e.g. Indiranagar, Connaught Place)..."
                  className="w-full pl-9 pr-3 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--line)] text-xs text-[var(--text)] focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="min-h-[36px] px-3.5 rounded-full bg-[var(--primary)] text-[var(--primary-fg)] text-xs font-bold transition disabled:opacity-50 cursor-pointer"
              >
                {isSearching ? 'Searching...' : 'Go'}
              </button>
            </div>
            {searchError && (
              <p className="text-[11px] text-red-500 mt-1 pl-2">{searchError}</p>
            )}
          </form>
        )}
      </header>

      {/* 2. Pinned Emergency Disclaimer Line with Call 112 Button */}
      <div className="bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/25 px-4 py-2.5">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-xs font-medium text-amber-900 dark:text-amber-200 truncate">
              Volunteer community. For emergencies, call 112.
            </span>
          </div>
          <a
            href="tel:112"
            className="min-h-[36px] px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs transition"
          >
            <Phone className="w-3 h-3 fill-current" />
            <span>Call 112</span>
          </a>
        </div>
      </div>

      <main className="max-w-3xl mx-auto w-full px-4 pt-3 flex-1 flex flex-col gap-3">
        {/* 3. Room Switched Banner */}
        {roomSwitchBanner && (
          <div className="flex items-center justify-between p-3 rounded-[14px] bg-blue-500/10 border border-blue-500/25 text-xs text-blue-700 dark:text-blue-300 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <Compass className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="font-semibold truncate">{roomSwitchBanner}</span>
            </div>
            <button
              type="button"
              onClick={clearRoomSwitchBanner}
              className="p-1 rounded-full hover:bg-blue-500/20 text-blue-500 cursor-pointer shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 4. Read-Only Notice (if viewing another room or location is off) */}
        {isReadOnly && (
          <div className="flex items-center justify-between p-3 rounded-[14px] bg-[var(--surface-2)] border border-[var(--line)] text-xs text-[var(--muted)]">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <Info className="w-4 h-4 text-[var(--primary)] shrink-0" />
              <span className="truncate">
                {userAreaId && activeRoomId !== userAreaId
                  ? `You're viewing ${activeArea?.name || activeRoomId}. You can post only in the area you're in.`
                  : "Location is turned off. Viewing in read-only mode."}
              </span>
            </div>
            {userAreaId && activeRoomId !== userAreaId ? (
              <button
                type="button"
                onClick={resetToUserArea}
                className="px-2.5 py-1 rounded-full text-xs font-bold text-[var(--primary)] hover:bg-[var(--surface)] border border-[var(--line)] shrink-0 cursor-pointer"
              >
                Return to my area
              </button>
            ) : locationPermissionStatus === 'denied' ? (
              <button
                type="button"
                onClick={requestLocation}
                className="px-2.5 py-1 rounded-full text-xs font-bold text-[var(--primary)] hover:bg-[var(--surface)] border border-[var(--line)] shrink-0 cursor-pointer"
              >
                Enable location
              </button>
            ) : null}
          </div>
        )}

        {/* 5. Mini Map of Room Rectangle & Alert Pins & Available Volunteers */}
        {showMap && (
          <NearbyMiniMap
            areaId={activeRoomId}
            userCoords={userCoords}
            alerts={alerts}
            volunteers={volunteers}
            onVolunteerClick={(vol) => {
              setSelectedVolunteer(vol);
            }}
            className="h-36 sm:h-44 w-full"
          />
        )}

        {/* 6. Neighbouring Areas Chips (8 surrounding cells) */}
        {neighborAreas.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1 px-0.5">
              <span className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Nearby Areas
              </span>
              {userAreaId && activeRoomId !== userAreaId && (
                <button
                  type="button"
                  onClick={resetToUserArea}
                  className="text-[11px] font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                >
                  Back to my cell
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
              {neighborAreas.map((neighbor) => {
                const isActive = neighbor.id === activeRoomId;
                const isMyPhysicalArea = neighbor.id === userAreaId;
                return (
                  <button
                    key={neighbor.id}
                    type="button"
                    onClick={() => setActiveRoom(neighbor.id)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)] shadow-xs'
                        : 'bg-[var(--surface-2)] text-[var(--text)] border-[var(--line)] hover:bg-[var(--surface)]'
                    }`}
                  >
                    <span>{neighbor.name}</span>
                    {isMyPhysicalArea && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" title="Your physical cell" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. Tabs: Alerts | Chat | Volunteers */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pt-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveNearbyTab('alerts')}
              className={`min-h-[44px] px-3.5 sm:px-4 py-2 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeNearbyTab === 'alerts'
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              <span>Alerts</span>
              {alerts.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold">
                  {alerts.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveNearbyTab('chat')}
              className={`min-h-[44px] px-3.5 sm:px-4 py-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeNearbyTab === 'chat'
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Chat
            </button>
            <button
              type="button"
              onClick={() => setActiveNearbyTab('volunteers')}
              className={`min-h-[44px] px-3.5 sm:px-4 py-2 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeNearbyTab === 'volunteers'
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Volunteers</span>
              {availableCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                  {availableCount}
                </span>
              )}
            </button>
          </div>

          {/* Evaluator sample toggle */}
          <label className="flex items-center gap-1.5 text-[11px] text-[var(--muted)] cursor-pointer pr-1">
            <input
              type="checkbox"
              checked={showSampleActivity}
              onChange={(e) => setShowSampleActivity(e.target.checked)}
              className="accent-[var(--primary)] rounded-sm"
            />
            <span className="hidden sm:inline">Sample activity & volunteers</span>
            <span className="sm:hidden">Sample data</span>
          </label>
        </div>

        {/* 8. Content: Volunteers Tab OR Messages Feed */}
        {activeNearbyTab === 'volunteers' ? (
          <VolunteersListTab />
        ) : (
          <div
            className="flex-1 space-y-3.5 min-h-[220px]"
            role="region"
            aria-live="polite"
            aria-label="Area activity feed"
          >
          {isLoadingMessages ? (
            <div className="py-12 flex flex-col items-center justify-center text-[var(--muted)] gap-2">
              <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Loading area messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center mx-auto mb-3 text-[var(--muted)]">
                <Compass className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[var(--text)] mb-1">
                It's quiet here.
              </p>
              <p className="text-xs text-[var(--muted)] max-w-sm mx-auto mb-4">
                Be the first to tell your neighbours what's going on or report a safety condition.
              </p>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={handleOpenReportSheet}
                  className="min-h-[44px] px-5 py-2 rounded-full bg-[var(--primary)] text-[var(--primary-fg)] text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report an alert</span>
                </button>
              )}
            </div>
          ) : (
            filteredMessages.map((msg) => {
              if (msg.kind === 'alert') {
                return (
                  <NearbyAlertCard
                    key={msg.id}
                    alert={msg}
                    onToggleConfirm={toggleConfirm}
                    onToggleFixed={toggleFixed}
                    onReport={(alertItem) =>
                      setModerationState({
                        isOpen: true,
                        type: 'report',
                        message: alertItem
                      })
                    }
                    onBlockUser={(uid, uAlias) =>
                      setModerationState({
                        isOpen: true,
                        type: 'block',
                        user: { id: uid, alias: uAlias }
                      })
                    }
                  />
                );
              } else {
                return (
                  <NearbyChatMessage
                    key={msg.id}
                    message={msg}
                    isMe={msg.author_alias === currentAlias}
                    onReport={(chatItem) =>
                      setModerationState({
                        isOpen: true,
                        type: 'report',
                        message: chatItem
                      })
                    }
                    onBlockUser={(uid, uAlias) =>
                      setModerationState({
                        isOpen: true,
                        type: 'block',
                        user: { id: uid, alias: uAlias }
                      })
                    }
                  />
                );
              }
            })
          )}

          {/* Load older button */}
          {hasMoreMessages && (
            <div className="pt-2 pb-4 text-center">
              <button
                type="button"
                onClick={loadOlderMessages}
                className="min-h-[44px] px-4 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--line)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer"
              >
                Load older messages
              </button>
            </div>
          )}
        </div>
        )}
      </main>

      {/* 9. Fixed Bottom Composer */}
      {activeNearbyTab !== 'volunteers' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--line)] px-4 py-3">
        <div className="max-w-3xl mx-auto">
          {isReadOnly ? (
            <div className="p-2.5 rounded-[12px] bg-[var(--surface-2)] text-center text-xs text-[var(--muted)]">
              {userAreaId && activeRoomId !== userAreaId
                ? 'Posting is disabled because you are outside this area. Switch back to your physical cell to post.'
                : 'Posting is disabled because location is off. You can only view public alerts and chats.'}
            </div>
          ) : (
            <div className="space-y-2">
              {chatError && (
                <div className="p-2 rounded-[10px] bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center justify-between">
                  <span>{chatError}</span>
                  <button
                    type="button"
                    onClick={() => setChatError(null)}
                    className="p-1 text-red-500 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSendChat} className="flex items-center gap-2">
                {/* "Report something" alert sheet trigger */}
                <button
                  type="button"
                  onClick={handleOpenReportSheet}
                  className="min-h-[48px] px-3.5 rounded-full border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                  title="Report a safety alert with category & pin"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="hidden sm:inline">Report something</span>
                  <span className="sm:hidden">Report</span>
                </button>

                {/* Quick Chat Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Short message to neighbours..."
                    maxLength={280}
                    className="w-full min-h-[48px] px-4 rounded-full bg-[var(--surface-2)] border border-[var(--line)] text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-hidden focus:border-[var(--line-focus)]"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isPostingChat || !chatInput.trim()}
                  className="w-12 h-12 rounded-full bg-[var(--primary)] text-[var(--primary-fg)] flex items-center justify-center transition disabled:opacity-50 cursor-pointer shrink-0 shadow-xs"
                  aria-label="Send chat message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      )}

      {/* 10. Modals & Sheets */}
      <NearbyReportSheet
        isOpen={isReportSheetOpen}
        onClose={() => setIsReportSheetOpen(false)}
        onSubmit={async ({ category, body, addPin }) => {
          return await postMessage({
            kind: 'alert',
            category,
            body,
            addPin
          });
        }}
      />

      <NearbyCommunityRulesModal
        isOpen={isRulesModalOpen}
        onAccept={handleRulesAccepted}
        onClose={() => setIsRulesModalOpen(false)}
      />

      <NearbyModerationModal
        isOpen={moderationState.isOpen}
        type={moderationState.type}
        targetMessage={moderationState.message}
        targetUser={moderationState.user}
        onClose={() =>
          setModerationState({ isOpen: false, type: 'report' })
        }
        onSubmitReport={reportMessage}
        onSubmitBlock={blockUser}
      />
    </div>
  );
};
