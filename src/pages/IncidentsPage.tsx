import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { IncidentRecord, IncidentCategory } from '../types';
import {
  FileText,
  Plus,
  Filter,
  Calendar,
  MapPin,
  AlertCircle,
  Download,
  Trash2,
  Paperclip,
  Share2,
  Shield,
  ChevronDown,
  X
} from 'lucide-react';
import { formatDate } from '../lib/utils';

const formatListOrString = (val?: string | string[]): string => {
  if (!val) return '';
  if (Array.isArray(val)) return val.filter(Boolean).join(', ');
  if (typeof val === 'string') return val.trim();
  return String(val);
};

export const IncidentsPage: React.FC = () => {
  const {
    incidents,
    addIncident,
    deleteIncident,
    evidence,
    setCurrentPage
  } = useAegis();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [minSeverity, setMinSeverity] = useState<number>(0);

  // Form fields
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [category, setCategory] = useState<IncidentCategory>('stalking');
  const [severity, setSeverity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [peopleInvolved, setPeopleInvolved] = useState('');
  const [witnesses, setWitnesses] = useState('');
  const [impact, setImpact] = useState('');
  const [notes, setNotes] = useState('');
  const [reportedToPolice, setReportedToPolice] = useState(false);

  const filteredIncidents = incidents.filter(inc => {
    if (selectedCategory !== 'ALL' && inc.category !== selectedCategory) return false;
    if (inc.severity < minSeverity) return false;
    return true;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) return;

    addIncident({
      date,
      time,
      category,
      severity,
      location,
      description,
      peopleInvolved: peopleInvolved.trim() || undefined,
      witnesses: witnesses.trim() || undefined,
      impact: impact.trim() || undefined,
      notes: notes.trim() || undefined,
      reportedToPolice,
      evidenceIds: []
    });

    setShowAddModal(false);
    // Reset
    setDescription('');
    setLocation('');
    setPeopleInvolved('');
    setWitnesses('');
    setImpact('');
    setNotes('');
  };

  const exportIncidentReport = () => {
    const textData = `=== AEGIS INCIDENT DOCUMENTATION REPORT ===\nGenerated on: ${new Date().toLocaleString('en-IN')}\nTotal Documented Records: ${filteredIncidents.length}\n\n` +
      filteredIncidents.map((inc, i) => {
        const involvedText = formatListOrString(inc.peopleInvolved);
        const witnessesText = formatListOrString(inc.witnesses);
        return (
          `[RECORD #${i + 1}] ID: ${inc.id}\n` +
          `Date & Time: ${inc.date} ${inc.time}\n` +
          `Category: ${inc.category.toUpperCase()}\n` +
          `Severity Level: ${inc.severity}/5\n` +
          `Location: ${inc.location}\n` +
          `Description:\n${inc.description}\n` +
          (involvedText ? `People Involved: ${involvedText}\n` : '') +
          (witnessesText ? `Witnesses: ${witnessesText}\n` : '') +
          (inc.impact ? `Impact / Distress: ${inc.impact}\n` : '') +
          `Reported to Police: ${inc.reportedToPolice ? 'YES' : 'NO'}\n` +
          `Linked Evidence Files: ${inc.evidenceIds?.length || 0}\n` +
          `-----------------------------------------------------\n`
        );
      }).join('\n');

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aegis-incident-timeline-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            Incident Journal & Timeline
          </h2>
          <p className="text-xs text-slate-400">
            Chronological evidence documentation for legal & safety preservation.
          </p>
        </div>
        <button
          id="btn-add-incident-modal"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Log</span>
        </button>
      </div>

      {/* Filter and Export Bar */}
      <div className="flex items-center justify-between gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 flex-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 text-xs focus:outline-none"
          >
            <option value="ALL">All Categories ({incidents.length})</option>
            <option value="domestic_abuse">Domestic Abuse</option>
            <option value="stalking">Stalking</option>
            <option value="sexual_harassment">Sexual Harassment</option>
            <option value="cyber_harassment">Cyber Harassment</option>
            <option value="trafficking_exploitation">Exploitation</option>
            <option value="workplace_harassment">Workplace</option>
            <option value="forced_marriage">Forced Marriage</option>
            <option value="blackmail">Blackmail</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          onClick={exportIncidentReport}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          title="Download formatted text report"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>Export Summary</span>
        </button>
      </div>

      {/* Navigation to Evidence Vault */}
      <div
        onClick={() => setCurrentPage('evidence')}
        className="cursor-pointer p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:bg-slate-900 transition"
      >
        <div className="flex items-center gap-2.5 text-xs">
          <Paperclip className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="font-semibold text-white block">Cryptographic Evidence Vault</span>
            <span className="text-[11px] text-slate-400">{evidence.length} files secured with SHA-256 integrity hashes</span>
          </div>
        </div>
        <span className="text-xs font-semibold text-sky-400">Open Vault →</span>
      </div>

      {/* Chronological Timeline List */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400 space-y-2">
            <p>No incidents recorded matching the current filter.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium"
            >
              Record First Incident
            </button>
          </div>
        ) : (
          filteredIncidents.map((inc) => {
            const linkedEvidence = evidence.filter(e => inc.evidenceIds?.includes(e.id));

            return (
              <div
                key={inc.id}
                className="relative pl-4 border-l-2 border-slate-800 space-y-2 pb-2"
              >
                {/* Timeline node */}
                <span className={`absolute -left-1.5 top-1.5 h-3 w-3 rounded-full ${
                  inc.severity >= 4 ? 'bg-rose-500' : inc.severity === 3 ? 'bg-amber-400' : 'bg-sky-400'
                }`} />

                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2.5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm capitalize">
                          {inc.category.replace('_', ' ')}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                          inc.severity >= 4
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}>
                          Severity {inc.severity}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {inc.date} at {inc.time}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {inc.location}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteIncident(inc.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition"
                      title="Delete Incident Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    {inc.description}
                  </p>

                  {/* Supplemental Metadata */}
                  {(() => {
                    const involvedText = formatListOrString(inc.peopleInvolved);
                    const witnessesText = formatListOrString(inc.witnesses);
                    if (!involvedText && !witnessesText && !inc.impact) return null;
                    return (
                      <div className="text-[11px] space-y-1 text-slate-400 pt-1 border-t border-slate-800/60">
                        {involvedText ? (
                          <div><strong>Involved:</strong> {involvedText}</div>
                        ) : null}
                        {witnessesText ? (
                          <div><strong>Witnesses:</strong> {witnessesText}</div>
                        ) : null}
                        {inc.impact && (
                          <div><strong>Impact:</strong> {inc.impact}</div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Linked Evidence Files */}
                  {linkedEvidence.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Secured Attachments ({linkedEvidence.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {linkedEvidence.map(ev => (
                          <span
                            key={ev.id}
                            className="inline-flex items-center gap-1 text-[10px] font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800 text-emerald-400"
                          >
                            <Paperclip className="w-2.5 h-2.5" />
                            {ev.filename}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                    <span>
                      Police Complaint: {inc.reportedToPolice ? 'Filed' : 'Not filed'}
                    </span>
                    <span className="font-mono">ID: {inc.id.slice(0, 12)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Incident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl text-slate-100 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white">Log Incident Details</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                >
                  <option value="domestic_abuse">Domestic Abuse / Coercion</option>
                  <option value="stalking">Stalking / Following</option>
                  <option value="sexual_harassment">Sexual Harassment</option>
                  <option value="cyber_harassment">Cyber Harassment / Doxxing</option>
                  <option value="trafficking_exploitation">Trafficking / Exploitation</option>
                  <option value="workplace_harassment">Workplace Harassment</option>
                  <option value="forced_marriage">Forced Marriage Coercion</option>
                  <option value="blackmail">Blackmail / Extortion</option>
                  <option value="other">Other Incident</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Severity Rating (1 to 5)</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {([1, 2, 3, 4, 5] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeverity(s)}
                      className={`py-1.5 rounded-lg font-bold border transition ${
                        severity === s
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Location / Landmark *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bus stop near metro station, office hallway"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Factual Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide concrete facts: who said what, exact words, physical actions taken..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">People Involved (Optional)</label>
                <input
                  type="text"
                  value={peopleInvolved}
                  onChange={(e) => setPeopleInvolved(e.target.value)}
                  placeholder="Comma-separated names or descriptions"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Witnesses (Optional)</label>
                <input
                  type="text"
                  value={witnesses}
                  onChange={(e) => setWitnesses(e.target.value)}
                  placeholder="Names or contacts of witnesses"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={reportedToPolice}
                  onChange={(e) => setReportedToPolice(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-0"
                />
                <span className="text-slate-300">Officially reported to police / 112</span>
              </label>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-800 py-2.5 font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-sky-600 hover:bg-sky-500 py-2.5 font-bold text-white shadow"
                >
                  Save to Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
