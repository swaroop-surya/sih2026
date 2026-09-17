import React, { useState, useEffect } from 'react';
import { useAegis } from '../hooks/useAegisState';
import {
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldCheck,
  AlertOctagon,
  Calendar
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
  const [purpose, setPurpose] = useState('Late night cab commute');
  const [destination, setDestination] = useState('Home (Indiranagar)');
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

  const activeCheckin = checkins.find(c => c.status === 'ACTIVE');
  const pastCheckins = checkins.filter(c => c.status !== 'ACTIVE');

  const handleStartCheckin = () => {
    if (!purpose.trim() || !destination.trim()) return;
    createCheckin({
      purpose,
      destination,
      durationMinutes,
      isRecurring,
      notifyContactIds: selectedContactIds.length ? selectedContactIds : contacts.map(c => c.id)
    });
  };

  const toggleContact = (id: string) => {
    setSelectedContactIds(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          Safety Check-Ins
        </h2>
        <p className="text-xs text-slate-400">
          Automated countdown timers for commutes, late travel, or meetings with unfamiliar people.
        </p>
      </div>

      {/* ACTIVE CHECKIN CARD */}
      {activeCheckin ? (
        <div className="rounded-2xl bg-gradient-to-br from-amber-950/70 to-slate-900 border-2 border-amber-600/70 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              Active Check-In In Progress
            </span>
            <span className="text-xs font-mono font-bold bg-amber-900/50 text-amber-200 px-2 py-0.5 rounded border border-amber-700">
              {activeCheckin.isRecurring ? 'Recurring' : 'Single Trip'}
            </span>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="text-4xl font-extrabold text-white font-mono tracking-tight">
              {formatTimeRemaining(activeCheckin.expiresAt)}
            </div>
            <p className="text-xs text-slate-300">
              Time remaining before alert is dispatched
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Purpose:</span>
              <span className="font-semibold text-white">{activeCheckin.purpose}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Destination:</span>
              <span className="font-semibold text-white">{activeCheckin.destination}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Contacts on Watch:</span>
              <span className="font-semibold text-emerald-400">{activeCheckin.notifyContactIds.length} Trusted</span>
            </div>
          </div>

          {/* TWO PRIMARY ACTION BUTTONS: I'M SAFE / I NEED HELP */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              id="btn-checkin-safe"
              onClick={() => resolveCheckinSafe(activeCheckin.id)}
              className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <CheckCircle className="w-4 h-4" />
              <span>I'M SAFE (Complete)</span>
            </button>

            <button
              id="btn-checkin-danger"
              onClick={() => triggerCheckinHelp(activeCheckin.id)}
              className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>I NEED HELP (SOS)</span>
            </button>
          </div>
        </div>
      ) : (
        /* CREATE NEW CHECKIN FORM */
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3.5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-amber-400" />
            Start a New Safety Timer
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Where are you going / Activity
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Cab ride from office, meeting with client, evening run"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Destination / Safe Endpoint
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Indiranagar home, hostel room 204"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Duration presets */}
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Expected Travel / Duration
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${
                      durationMinutes === mins
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Recurring toggle */}
            <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-200 block">Daily Commute Schedule</span>
                <span className="text-[11px] text-slate-400">Automatically prompt check-in for daily return journey</span>
              </div>
            </label>

            {/* Contacts selection */}
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Contacts to alert if overdue ({selectedContactIds.length} selected)
              </label>
              <div className="space-y-1.5">
                {contacts.map(c => {
                  const isChecked = selectedContactIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleContact(c.id)}
                      className={`cursor-pointer p-2 rounded-xl border text-xs flex items-center justify-between transition ${
                        isChecked
                          ? 'bg-amber-950/30 border-amber-700/60 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{c.name} ({c.relationship})</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              id="btn-start-checkin"
              onClick={handleStartCheckin}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <Clock className="w-4 h-4" />
              <span>Start Active Safety Timer</span>
            </button>
          </div>
        </div>
      )}

      {/* PAST CHECK-IN HISTORY */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-sky-400" />
          Recent Check-in Records
        </h3>

        {pastCheckins.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400">
            No past check-ins recorded.
          </div>
        ) : (
          <div className="space-y-2">
            {pastCheckins.map(chk => (
              <div
                key={chk.id}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{chk.purpose}</div>
                  <div className="text-[11px] text-slate-400">Destination: {chk.destination}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(chk.startedAt).toLocaleDateString('en-IN')} • Duration: {chk.durationMinutes} min
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  chk.status === 'SAFE'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : chk.status === 'EXPIRED'
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
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
