import React, { useState, useEffect } from 'react';
import { useAegis } from '../hooks/useAegisState';
import {
  Clock,
  CheckCircle,
  AlertOctagon,
  Play
} from 'lucide-react';
import { formatTimeRemaining } from '../lib/utils';

export const SafetyCheckinPage: React.FC = () => {
  const {
    checkins,
    createCheckin,
    resolveCheckinSafe,
    triggerCheckinHelp,
    contacts
  } = useAegis();

  // New checkin form
  const [purpose, setPurpose] = useState('Late night commute');
  const [destination, setDestination] = useState('Home');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(() =>
    contacts.filter(c => c.notifyOnCheckinMiss).map(c => c.id)
  );

  // Time ticker state to update countdowns smoothly
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCheckin = (checkins || []).find(c => c.status === 'ACTIVE');
  const pastCheckins = (checkins || []).filter(c => c.status !== 'ACTIVE');

  const handleStartCheckin = () => {
    if (!purpose.trim() || !destination.trim()) return;
    const safeContacts = contacts || [];
    createCheckin({
      purpose,
      destination,
      durationMinutes,
      isRecurring,
      contactId: selectedContactIds[0] || safeContacts[0]?.id || 'tc_1',
      notifyContactIds: selectedContactIds.length ? selectedContactIds : safeContacts.map(c => c.id)
    });
  };

  const toggleContact = (id: string) => {
    setSelectedContactIds(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="page-title">Safety Check-ins</h1>
        <p className="text-caption text-[14px] mt-1">
          Automated countdown timers for commutes, travel, or meetings with new people.
        </p>
      </div>

      {/* ACTIVE CHECKIN CARD */}
      {activeCheckin ? (
        <div className="p-5 rounded-[16px] bg-[var(--surface)] border border-[var(--line)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--accent)] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-ping" />
              Active check-in running
            </span>
            <span className="text-[11px] font-medium bg-[var(--surface-2)] text-[var(--muted)] px-2.5 py-0.5 rounded-full border border-[var(--line)]">
              {activeCheckin.isRecurring ? 'Daily' : 'Single trip'}
            </span>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="text-[36px] font-heading font-semibold text-[var(--text)] font-mono tracking-tight">
              {formatTimeRemaining(activeCheckin.expiresAt)}
            </div>
            <p className="text-caption text-[12px]">
              Time remaining before an alert is dispatched
            </p>
          </div>

          <div className="p-3 rounded-[12px] bg-[var(--surface-2)] space-y-1.5 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Purpose:</span>
              <span className="font-medium text-[var(--text)]">{activeCheckin.purpose}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Destination:</span>
              <span className="font-medium text-[var(--text)]">{activeCheckin.destination}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Watching:</span>
              <span className="font-medium text-[var(--safe)]">
                {(activeCheckin.notifyContactIds?.length ?? (activeCheckin.contactId ? 1 : 0))} Contacts
              </span>
            </div>
          </div>

          {/* TWO PRIMARY ACTION BUTTONS: I'M SAFE / I NEED HELP */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              id="btn-checkin-safe"
              onClick={() => resolveCheckinSafe(activeCheckin.id)}
              className="soft-btn soft-btn-primary text-[13px] h-10"
            >
              <CheckCircle className="w-4 h-4 mr-1.5 stroke-[1.75]" />
              <span>I am safe</span>
            </button>

            <button
              id="btn-checkin-danger"
              onClick={() => triggerCheckinHelp(activeCheckin.id)}
              className="soft-btn soft-btn-sos text-[13px] h-10"
            >
              <AlertOctagon className="w-4 h-4 mr-1.5 stroke-[1.75]" />
              <span>I need help</span>
            </button>
          </div>
        </div>
      ) : (
        /* CREATE NEW CHECKIN FORM */
        <div className="p-5 rounded-[16px] bg-[var(--surface)] border border-[var(--line)] space-y-4">
          <h3 className="section-title text-[16px]">
            Start a new timer
          </h3>

          <div className="space-y-3 text-[13px]">
            <div>
              <label className="block font-medium text-[var(--text)] mb-1">
                Where are you going / Activity
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Cab ride from office, meeting, evening walk"
                className="soft-input w-full text-[13px]"
              />
            </div>

            <div>
              <label className="block font-medium text-[var(--text)] mb-1">
                Destination / Safe Endpoint
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Home, hostel, metro station"
                className="soft-input w-full text-[13px]"
              />
            </div>

            {/* Duration presets */}
            <div>
              <label className="block font-medium text-[var(--text)] mb-1">
                Expected Travel Time
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`h-9 rounded-full text-[12px] font-medium border transition cursor-pointer ${
                      durationMinutes === mins
                        ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)]'
                        : 'bg-[var(--surface-2)] border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Recurring toggle */}
            <label className="flex items-center gap-2.5 p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-[var(--line)] bg-[var(--surface)] text-[var(--primary)]"
              />
              <div className="text-[12px]">
                <span className="font-medium text-[var(--text)] block">Daily commute schedule</span>
                <span className="text-caption text-[11px]">Prompt automatically for this return journey daily</span>
              </div>
            </label>

            {/* Contacts selection */}
            <div>
              <label className="block font-medium text-[var(--text)] mb-1">
                Contacts to alert if overdue ({selectedContactIds.length} selected)
              </label>
              <div className="space-y-1.5">
                {contacts.map(c => {
                  const isChecked = selectedContactIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleContact(c.id)}
                      className={`cursor-pointer p-2.5 rounded-[12px] border text-[13px] flex items-center justify-between transition ${
                        isChecked
                          ? 'bg-[var(--surface-2)] border-[var(--primary)] text-[var(--text)]'
                          : 'bg-[var(--surface)] border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      <span>{c.name} ({c.relationship})</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-[var(--line)]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              id="btn-start-checkin"
              onClick={handleStartCheckin}
              className="soft-btn soft-btn-primary w-full text-[14px] h-10"
            >
              <Clock className="w-4 h-4 mr-1.5 stroke-[1.75]" />
              <span>Start safety timer</span>
            </button>
          </div>
        </div>
      )}

      {/* PAST CHECK-IN HISTORY */}
      <div className="space-y-2">
        <h3 className="section-title text-[16px]">
          Recent check-in records
        </h3>

        {pastCheckins.length === 0 ? (
          <div className="p-5 rounded-[12px] bg-[var(--surface-2)] text-center text-caption text-[13px]">
            No past check-ins recorded.
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
            {pastCheckins.map(chk => (
              <div
                key={chk.id}
                className="py-3 flex items-start justify-between text-[13px] px-1"
              >
                <div>
                  <div className="font-medium text-[var(--text)]">{chk.purpose}</div>
                  <div className="text-caption text-[12px]">Destination: {chk.destination}</div>
                  <div className="text-caption text-[11px] mt-0.5">
                    {new Date(chk.startedAt).toLocaleDateString('en-IN')} • Duration: {chk.durationMinutes} min
                  </div>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  chk.status === 'SAFE'
                    ? 'bg-[var(--safe)]/15 text-[var(--safe)]'
                    : chk.status === 'EXPIRED'
                    ? 'bg-[var(--sos)] text-white'
                    : 'bg-[var(--accent)] text-[#1A1F45]'
                }`}>
                  {chk.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
