import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import {
  MapPin,
  UserCheck
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
    <div className="space-y-5 pb-8">
      {/* Header with Role Switcher */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Responder Console</h1>
          <p className="text-caption text-[14px] mt-1">
            Authorized triage console for Sakhi One Stop staff and verified responders.
          </p>
        </div>

        {/* Role Switcher */}
        <select
          value={profile.role}
          onChange={(e) => setUserRole(e.target.value as any)}
          className="soft-input text-[12px] h-8 px-2 py-0 cursor-pointer"
        >
          <option value="USER">User</option>
          <option value="RESPONDER">Responder</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Cases Queue */}
      <div className="space-y-2">
        <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider block">
          Live Triage Queue ({cases.length} Active)
        </span>

        <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
          {cases.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedCaseId(item.id)}
              className={`py-3.5 px-1 cursor-pointer transition select-none ${
                selectedCaseId === item.id
                  ? 'bg-[var(--surface-2)]/60'
                  : 'hover:bg-[var(--surface-2)]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    item.priority === 'P1_IMMEDIATE'
                      ? 'bg-[var(--sos)] text-white'
                      : item.priority === 'P2_URGENT'
                      ? 'bg-[var(--accent)] text-[#1A1F45]'
                      : 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)]'
                  }`}>
                    {item.priority.replace('_', ' ')}
                  </span>
                  <span className="font-medium text-[13px] text-[var(--text)]">{item.victimAlias}</span>
                </div>
                <span className="text-[11px] text-[var(--muted)] font-mono">{item.timeReceived}</span>
              </div>

              <div className="text-[13px] text-[var(--text)] font-medium mt-1">{item.category}</div>
              <div className="flex items-center gap-1.5 text-caption text-[11px] mt-0.5">
                <MapPin className="w-3 h-3 text-[var(--muted)] shrink-0 stroke-[1.75]" />
                <span>{item.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Case Triage Card */}
      {activeCase && (
        <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-3 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[14px] text-[var(--text)]">{activeCase.id} Details</span>
            <div className="flex gap-1">
              {(['NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => updateCaseStatus(activeCase.id, st)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition cursor-pointer ${
                    activeCase.status === st
                      ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)]'
                      : 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--line)]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 bg-[var(--surface-2)] p-3 rounded-[8px] text-[12px]">
            <div><strong>Assigned worker:</strong> {activeCase.assignedWorker}</div>
            <div><strong>Dispatch log:</strong></div>
            <p className="text-caption whitespace-pre-line text-[11px] font-mono leading-relaxed mt-1">
              {activeCase.notes}
            </p>
          </div>

          {/* Append note */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add responder note..."
              className="soft-input flex-1 text-[12px]"
            />
            <button
              onClick={addCaseNote}
              className="soft-btn soft-btn-primary text-[12px] px-3 h-8"
            >
              Add note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
