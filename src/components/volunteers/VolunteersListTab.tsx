import React, { useState } from 'react';
import { HeartHandshake, Filter, Plus, ShieldAlert, Sparkles } from 'lucide-react';
import { Volunteer, VolunteerHelpType } from '../../types/volunteer';
import { useVolunteers } from '../../context/VolunteerContext';
import { useNearby } from '../../context/NearbyContext';
import { VolunteerCard } from './VolunteerCard';
import { VolunteerSignUpModal } from './VolunteerSignUpModal';
import { VolunteerReconfirmBanner } from './VolunteerReconfirmBanner';
import { VOLUNTEER_HELP_TYPES } from '../../lib/volunteerUtils';

export const VolunteersListTab: React.FC = () => {
  const {
    volunteers,
    availableCount,
    isLoadingVolunteers,
    isMyVolunteerActive,
    isVolunteerFormOpen,
    setIsVolunteerFormOpen,
    setSelectedVolunteer
  } = useVolunteers();

  const { activeArea, activeRoomId } = useNearby();

  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Filter volunteers based on chip
  const filteredVolunteers = volunteers.filter((vol) => {
    if (selectedFilter === 'all') return true;
    return vol.helpTypes.includes(selectedFilter as VolunteerHelpType);
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* 7-Day Reconfirmation Banner if user is volunteer nearing expiry */}
      <VolunteerReconfirmBanner />

      {/* Pinned Safety Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
        <div className="flex items-center gap-1.5 font-semibold">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Community Volunteers Disclaimer</span>
        </div>
        <p className="text-[11px] leading-relaxed opacity-95">
          Volunteers are community members who've opted in to help. They are not police or emergency
          responders. For danger, use SOS or call 112.
        </p>
      </div>

      {/* Area & Availability Summary Bar */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div>
          <h3 className="font-heading font-bold text-sm text-[var(--text)]">
            Volunteers in {activeArea?.name || `Area ${activeRoomId.toUpperCase()}`}
          </h3>
          <p className="text-xs text-[var(--muted)]">
            {availableCount} volunteer{availableCount === 1 ? '' : 's'} currently available
          </p>
        </div>

        {/* Join as Volunteer button */}
        {!isMyVolunteerActive && (
          <button
            type="button"
            onClick={() => setIsVolunteerFormOpen(true)}
            className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] text-xs font-semibold text-[var(--text)] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Join directory</span>
          </button>
        )}
      </div>

      {/* Help Type Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          type="button"
          onClick={() => setSelectedFilter('all')}
          className={`min-h-[38px] px-3 py-1.5 rounded-full border transition cursor-pointer shrink-0 font-medium ${
            selectedFilter === 'all'
              ? 'bg-[var(--primary)] text-white dark:text-[#1A1F45] border-[var(--primary)] shadow-xs'
              : 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--line)] hover:text-[var(--text)]'
          }`}
        >
          All ({volunteers.length})
        </button>

        {VOLUNTEER_HELP_TYPES.map((type) => {
          const isSelected = selectedFilter === type.key;
          const count = volunteers.filter((v) => v.helpTypes.includes(type.key)).length;
          return (
            <button
              key={type.key}
              type="button"
              onClick={() => setSelectedFilter(type.key)}
              className={`min-h-[38px] px-3 py-1.5 rounded-full border transition cursor-pointer shrink-0 font-medium flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[var(--primary)] text-white dark:text-[#1A1F45] border-[var(--primary)] shadow-xs'
                  : 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--line)] hover:text-[var(--text)]'
              }`}
            >
              <span>{type.label}</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Volunteers List */}
      {isLoadingVolunteers ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="w-full h-24 rounded-[18px] bg-[var(--surface-2)] animate-pulse border border-[var(--line)]"
            />
          ))}
        </div>
      ) : filteredVolunteers.length === 0 ? (
        /* Empty State */
        <div className="p-8 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[var(--surface)] text-[var(--muted)] mx-auto flex items-center justify-center border border-[var(--line)]">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-[var(--text)]">
              No volunteers nearby yet
            </h4>
            <p className="text-xs text-[var(--muted)] max-w-sm mx-auto mt-1 leading-relaxed">
              You can be the first to opt in and help neighbours walk home or stay safe. See your Profile to sign up.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsVolunteerFormOpen(true)}
            className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white dark:text-[#1A1F45] font-semibold text-xs transition cursor-pointer shadow-xs inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Sign Up as a Volunteer</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredVolunteers.map((vol) => (
            <VolunteerCard
              key={vol.userId}
              volunteer={vol}
              onSelect={(v) => setSelectedVolunteer(v)}
            />
          ))}
        </div>
      )}

      {/* Volunteer Sign-up / Settings Modal */}
      <VolunteerSignUpModal
        isOpen={isVolunteerFormOpen}
        onClose={() => setIsVolunteerFormOpen(false)}
      />
    </div>
  );
};
