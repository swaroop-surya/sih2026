import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import {
  ShieldAlert,
  AlertOctagon,
  Clock,
  CheckCircle,
  MapPin,
  PhoneCall,
  UserCheck,
  Filter,
  Users,
  MessageSquare
} from 'lucide-react';

interface MockCase {
  id: string;
  victimAlias: string;
  category: string;
  priority: 'P1_IMMEDIATE' | 'P2_URGENT' | 'P3_FOLLOWUP';
  status: 'NEW' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED';
  timeReceived: string;
  location: string;
  notes: string;
  assignedWorker: string;
}

export const ResponderDashboardPage: React.FC = () => {
  const { profile, setUserRole } = useAegis();

  const [cases, setCases] = useState<MockCase[]>([
    {
      id: 'CASE-2026-081',
      victimAlias: 'Ananya S. (Ref #8812)',
      category: 'Immediate SOS / Physical Following',
      priority: 'P1_IMMEDIATE',
      status: 'NEW',
      timeReceived: '3 mins ago',
      location: 'Near Metro Pillar 44, Bengaluru 560103',
      notes: 'GPS breadcrumb transmitted. 2 trusted contacts alerted via SMS gateway.',
      assignedWorker: 'Unassigned'
    },
    {
      id: 'CASE-2026-074',
      victimAlias: 'Meera K. (Ref #4190)',
      category: 'Overdue Commute Check-In',
      priority: 'P2_URGENT',
      status: 'ACKNOWLEDGED',
      timeReceived: '28 mins ago',
      location: 'Outer Ring Rd, Koramangala',
      notes: 'Check-in timer expired without confirmation. Contacting emergency primary guardian.',
      assignedWorker: 'Officer Rekha V.'
    },
    {
      id: 'CASE-2026-062',
      victimAlias: 'Sneha D. (Ref #2201)',
      category: 'Cyber Extortion & Blackmail',
      priority: 'P3_FOLLOWUP',
      status: 'IN_PROGRESS',
      timeReceived: '3 hours ago',
      location: 'Electronic City, Phase 1',
      notes: 'Cryptographic SHA-256 evidence package received. Assisting with cybercrime.gov.in docket.',
      assignedWorker: 'Advocate Radhika P.'
    }
  ]);

  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0].id);
  const [newNote, setNewNote] = useState('');

  const activeCase = cases.find(c => c.id === selectedCaseId);

  const updateCaseStatus = (id: string, status: MockCase['status']) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const addCaseNote = () => {
    if (!newNote.trim() || !activeCase) return;
    setCases(prev => prev.map(c => {
      if (c.id === activeCase.id) {
        return {
          ...c,
          notes: `${c.notes}\n[${new Date().toLocaleTimeString('en-IN')}]: ${newNote.trim()}`
        };
      }
      return c;
    }));
    setNewNote('');
  };

  return (
    <div className="space-y-4">
      {/* Header with Role Switcher */}
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            Responder & Caseworker Dashboard
          </h2>
          <p className="text-xs text-slate-400">
            Authorized triage console for Sakhi One Stop staff and verified responders.
          </p>
        </div>

        {/* Role Switcher */}
        <select
          value={profile.role}
          onChange={(e) => setUserRole(e.target.value as any)}
          className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-indigo-300 font-semibold focus:outline-none"
        >
          <option value="USER">User View</option>
          <option value="RESPONDER">Responder View</option>
          <option value="ADMIN">Admin View</option>
        </select>
      </div>

      {/* Cases Queue */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Live Triage Queue ({cases.length} Active)
        </span>

        {cases.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedCaseId(item.id)}
            className={`cursor-pointer p-3.5 rounded-2xl border transition text-xs space-y-2 select-none ${
              selectedCaseId === item.id
                ? 'bg-slate-900 border-indigo-500 shadow-md'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  item.priority === 'P1_IMMEDIATE'
                    ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
                    : item.priority === 'P2_URGENT'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-sky-950 text-sky-300 border-sky-800'
                }`}>
                  {item.priority.replace('_', ' ')}
                </span>
                <span className="font-bold text-white">{item.victimAlias}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{item.timeReceived}</span>
            </div>

            <div className="text-slate-300 font-medium">{item.category}</div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
              <span>{item.location}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Case Triage Card */}
      {activeCase && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">{activeCase.id} Details</span>
            <div className="flex gap-1.5">
              {(['NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => updateCaseStatus(activeCase.id, st)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition ${
                    activeCase.status === st
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div><strong>Assigned Worker:</strong> {activeCase.assignedWorker}</div>
            <div><strong>Dispatch Log:</strong></div>
            <p className="text-slate-300 whitespace-pre-line text-[11px] font-mono leading-relaxed">
              {activeCase.notes}
            </p>
          </div>

          {/* Append note */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add responder triage update note..."
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={addCaseNote}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              Add Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
