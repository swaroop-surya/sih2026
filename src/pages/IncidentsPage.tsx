import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { useTheme } from '../context/ThemeContext';
import { IncidentRecord, IncidentCategory } from '../types';
import { IncidentMapView } from '../components/incidents/IncidentMapView';
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
  X,
  Map as MapIcon,
  List,
  Crosshair,
  Compass
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
  const { isCream } = useTheme();

  const [viewMode, setViewMode] = useState<'map' | 'timeline'>('map');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [minSeverity, setMinSeverity] = useState<number>(0);

  // Form fields
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [category, setCategory] = useState<IncidentCategory>('stalking');
  const [severity, setSeverity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
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

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        const acc = Math.round(pos.coords.accuracy);
        setLatitude(String(lat));
        setLongitude(String(lng));
        setGpsAccuracy(acc);
        if (!location.trim()) {
          setLocation(`GPS (${lat}, ${lng})`);
        }
      },
      (err) => {
        setIsDetectingGps(false);
        console.warn('Geolocation failed:', err.message);
        // Fallback demo coordinate
        setLatitude('12.9784');
        setLongitude('77.6408');
        setGpsAccuracy(15);
        if (!location.trim()) {
          setLocation('Indiranagar Metro Vicinity');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleAddNewIncidentAt = (coords: { lat: number; lng: number }) => {
    setLatitude(String(coords.lat));
    setLongitude(String(coords.lng));
    setLocation(`Point (${coords.lat}, ${coords.lng})`);
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) return;

    const latNum = latitude ? parseFloat(latitude) : undefined;
    const lngNum = longitude ? parseFloat(longitude) : undefined;

    addIncident({
      date,
      time,
      category,
      severity,
      location,
      latitude: !isNaN(latNum as number) ? latNum : undefined,
      longitude: !isNaN(lngNum as number) ? lngNum : undefined,
      accuracy: gpsAccuracy || undefined,
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
    setLatitude('');
    setLongitude('');
    setGpsAccuracy(null);
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
        const gpsText = inc.latitude && inc.longitude ? `GPS: ${inc.latitude}, ${inc.longitude} (±${inc.accuracy || 0}m)\n` : '';
        return (
          `[RECORD #${i + 1}] ID: ${inc.id}\n` +
          `Date & Time: ${inc.date} ${inc.time}\n` +
          `Category: ${inc.category.toUpperCase()}\n` +
          `Severity Level: ${inc.severity}/5\n` +
          `Location: ${inc.location}\n` +
          gpsText +
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
      <div className={`flex items-center justify-between border-b pb-3 ${isCream ? 'border-black/20' : 'border-slate-800'}`}>
        <div>
          <h2 className={`text-lg font-bold flex items-center gap-2 ${isCream ? 'text-[#0D0D0D]' : 'text-white'}`}>
            <FileText className={`w-5 h-5 ${isCream ? 'text-[#0D0D0D]' : 'text-sky-400'}`} />
            Incident Journal & Geo-Map
          </h2>
          <p className={`text-xs ${isCream ? 'text-[#242424]' : 'text-slate-400'}`}>
            Spatial hazard mapping and timestamped evidentiary documentation.
          </p>
        </div>
        <button
          id="btn-add-incident-modal"
          onClick={() => {
            setLatitude('');
            setLongitude('');
            setGpsAccuracy(null);
            setShowAddModal(true);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow transition ${
            isCream
              ? 'bg-[#0D0D0D] hover:bg-black text-[#FDFBD4] border border-black shadow-[2px_2px_0px_0px_#000]'
              : 'bg-sky-600 hover:bg-sky-500 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Log Incident</span>
        </button>
      </div>

      {/* View Mode Toggle & Filter Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl border text-xs ${
        isCream
          ? 'bg-white border-black/20 shadow-sm'
          : 'bg-slate-900/80 border-slate-800'
      }`}>
        {/* View Switcher Tabs */}
        <div className={`flex items-center p-0.5 rounded-xl border ${
          isCream ? 'bg-black/5 border-black/20' : 'bg-slate-950 border-slate-800'
        }`}>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === 'map'
                ? isCream
                  ? 'bg-white text-[#0D0D0D] shadow-[1px_1px_0px_0px_#000] border border-black'
                  : 'bg-slate-800 text-white shadow-sm'
                : isCream
                ? 'text-[#242424]/70 hover:text-[#0D0D0D]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>Safety Map</span>
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === 'timeline'
                ? isCream
                  ? 'bg-white text-[#0D0D0D] shadow-[1px_1px_0px_0px_#000] border border-black'
                  : 'bg-slate-800 text-white shadow-sm'
                : isCream
                ? 'text-[#242424]/70 hover:text-[#0D0D0D]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5 text-sky-400" />
            <span>Timeline Log ({filteredIncidents.length})</span>
          </button>
        </div>

        {/* Filters and Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className={`w-3.5 h-3.5 shrink-0 ${isCream ? 'text-[#242424]' : 'text-slate-400'}`} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`rounded-lg px-2 py-1 text-xs focus:outline-none border ${
                isCream
                  ? 'bg-white border-black text-[#0D0D0D]'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <option value="ALL">All Types ({incidents.length})</option>
              <option value="stalking">Stalking</option>
              <option value="harassment">Harassment</option>
              <option value="domestic_violence">Domestic Abuse</option>
              <option value="cyber_abuse">Cyber Abuse</option>
              <option value="trafficking_exploitation">Exploitation</option>
              <option value="workplace_incident">Workplace</option>
              <option value="blackmail">Blackmail</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            onClick={exportIncidentReport}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
              isCream
                ? 'bg-white border-black text-[#0D0D0D] hover:bg-black/5 shadow-[1px_1px_0px_0px_#000]'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Download formatted text report"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Navigation to Evidence Vault Card */}
      <div
        onClick={() => setCurrentPage('evidence')}
        className={`cursor-pointer p-3 rounded-2xl border flex items-center justify-between transition ${
          isCream
            ? 'bg-white border-2 border-black hover:bg-[#FAF8F5] shadow-[2px_2px_0px_0px_#000]'
            : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
        }`}
      >
        <div className="flex items-center gap-2.5 text-xs">
          <Paperclip className="w-4 h-4 text-emerald-500" />
          <div>
            <span className={`font-bold block ${isCream ? 'text-[#0D0D0D]' : 'text-white'}`}>
              Cryptographic Evidence Vault
            </span>
            <span className={`text-[11px] ${isCream ? 'text-[#242424]' : 'text-slate-400'}`}>
              {evidence.length} files secured with SHA-256 integrity hashes
            </span>
          </div>
        </div>
        <span className={`text-xs font-bold ${isCream ? 'text-[#0D0D0D]' : 'text-sky-400'}`}>
          Open Vault →
        </span>
      </div>

      {/* MAP VIEW */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <IncidentMapView
            incidents={filteredIncidents}
            onAddNewIncidentAt={handleAddNewIncidentAt}
            onOpenEvidenceVault={() => setCurrentPage('evidence')}
          />

          {/* Quick List Preview below Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${isCream ? 'text-[#0D0D0D]' : 'text-slate-300'}`}>
                Recent Safety Logs ({filteredIncidents.length})
              </span>
              <button
                onClick={() => setViewMode('timeline')}
                className={`text-xs font-bold ${isCream ? 'text-[#0D0D0D] underline' : 'text-sky-400 hover:underline'}`}
              >
                View Full Timeline
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredIncidents.slice(0, 4).map((inc) => (
                <div
                  key={inc.id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 transition ${
                    isCream
                      ? 'bg-white border border-black/20 text-[#242424] hover:border-black'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs capitalize truncate">
                      {inc.category.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      inc.severity >= 4
                        ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                        : 'bg-amber-950/60 text-amber-300 border-amber-800'
                    }`}>
                      Lvl {inc.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="truncate">{inc.location}</span>
                  </div>
                  <p className="text-[11px] line-clamp-1 text-slate-400">
                    {inc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE JOURNAL VIEW */}
      {viewMode === 'timeline' && (
        <div className="space-y-3">
          {filteredIncidents.length === 0 ? (
            <div className={`p-8 rounded-2xl border text-center text-xs space-y-2 ${
              isCream
                ? 'bg-white border-2 border-black text-[#242424]'
                : 'bg-slate-900/50 border-slate-800 text-slate-400'
            }`}>
              <p>No incidents recorded matching the current filter.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                  isCream
                    ? 'bg-black text-[#FDFBD4] border-black'
                    : 'bg-slate-800 text-slate-200 border-slate-700'
                }`}
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
                  className={`relative pl-4 border-l-2 space-y-2 pb-2 ${
                    isCream ? 'border-black/30' : 'border-slate-800'
                  }`}
                >
                  {/* Timeline node */}
                  <span className={`absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border ${
                    inc.severity >= 4
                      ? 'bg-rose-500 border-rose-300'
                      : inc.severity === 3
                      ? 'bg-amber-400 border-amber-200'
                      : 'bg-sky-400 border-sky-200'
                  }`} />

                  <div className={`rounded-2xl p-4 space-y-2.5 border transition ${
                    isCream
                      ? 'bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-slate-900/90 border-slate-800 shadow-sm'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm capitalize ${isCream ? 'text-[#0D0D0D]' : 'text-white'}`}>
                            {inc.category.replace('_', ' ')}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                            inc.severity >= 4
                              ? isCream
                                ? 'bg-rose-100 text-rose-800 border-rose-600'
                                : 'bg-rose-950 text-rose-300 border-rose-800'
                              : isCream
                              ? 'bg-amber-100 text-amber-900 border-amber-600'
                              : 'bg-amber-950 text-amber-300 border-amber-800'
                          }`}>
                            Severity {inc.severity}/5
                          </span>
                        </div>
                        <div className={`flex flex-wrap items-center gap-2 text-[11px] mt-0.5 ${isCream ? 'text-[#242424]' : 'text-slate-400'}`}>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {inc.date} at {inc.time}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500" /> {inc.location}
                          </span>
                          {inc.latitude && inc.longitude && (
                            <span className="font-mono text-[10px] text-sky-500 font-medium">
                              [{inc.latitude.toFixed(4)}, {inc.longitude.toFixed(4)}]
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteIncident(inc.id)}
                        className={`p-1 transition ${isCream ? 'text-black/40 hover:text-rose-600' : 'text-slate-500 hover:text-rose-400'}`}
                        title="Delete Incident Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Description */}
                    <p className={`text-xs leading-relaxed p-2.5 rounded-xl border ${
                      isCream
                        ? 'bg-[#FAF8F5] border-black/15 text-[#242424]'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                    }`}>
                      {inc.description}
                    </p>

                    {/* Supplemental Metadata */}
                    {(() => {
                      const involvedText = formatListOrString(inc.peopleInvolved);
                      const witnessesText = formatListOrString(inc.witnesses);
                      if (!involvedText && !witnessesText && !inc.impact) return null;
                      return (
                        <div className={`text-[11px] space-y-1 pt-1 border-t ${
                          isCream ? 'border-black/10 text-[#242424]' : 'border-slate-800/60 text-slate-400'
                        }`}>
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
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isCream ? 'text-[#0D0D0D]' : 'text-slate-400'}`}>
                          Secured Attachments ({linkedEvidence.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {linkedEvidence.map(ev => (
                            <span
                              key={ev.id}
                              className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded border ${
                                isCream
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-500 font-bold'
                                  : 'bg-slate-950 border-slate-800 text-emerald-400'
                              }`}
                            >
                              <Paperclip className="w-2.5 h-2.5" />
                              {ev.filename}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`flex items-center justify-between pt-1 text-[10px] ${isCream ? 'text-[#242424]/60' : 'text-slate-500'}`}>
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
      )}

      {/* Add Incident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-sm rounded-2xl border p-5 shadow-2xl my-8 space-y-4 ${
            isCream
              ? 'bg-white border-2 border-black text-[#0D0D0D] shadow-[4px_4px_0px_0px_#000]'
              : 'border-slate-800 bg-slate-900 text-slate-100'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 ${isCream ? 'border-black/20' : 'border-slate-800'}`}>
              <h3 className={`text-base font-bold ${isCream ? 'text-[#0D0D0D]' : 'text-white'}`}>
                Log Safety Incident
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-1 ${isCream ? 'text-[#242424] hover:text-black' : 'text-slate-400 hover:text-white'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block font-medium mb-1 ${isCream ? 'text-[#0D0D0D]' : 'text-slate-300'}`}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full rounded-xl border px-2.5 py-2 ${
                      isCream
                        ? 'border-black bg-white text-[#0D0D0D]'
                        : 'border-slate-800 bg-slate-950 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block font-medium mb-1 ${isCream ? 'text-[#0D0D0D]' : 'text-slate-300'}`}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={`w-full rounded-xl border px-2.5 py-2 ${
                      isCream
                        ? 'border-black bg-white text-[#0D0D0D]'
                        : 'border-slate-800 bg-slate-950 text-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-medium mb-1 ${isCream ? 'text-[#0D0D0D]' : 'text-slate-300'}`}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                  className={`w-full rounded-xl border px-3 py-2 ${
                    isCream
                      ? 'border-black bg-white text-[#0D0D0D]'
                      : 'border-slate-800 bg-slate-950 text-white'
                  }`}
                >
                  <option value="stalking">Stalking / Following</option>
                  <option value="harassment">Harassment / Intimidation</option>
                  <option value="domestic_violence">Domestic Abuse / Coercion</option>
                  <option value="sexual_harassment">Sexual Harassment</option>
                  <option value="cyber_abuse">Cyber Abuse / Doxxing</option>
                  <option value="trafficking_exploitation">Trafficking / Exploitation</option>
                  <option value="workplace_incident">Workplace Incident</option>
                  <option value="blackmail">Blackmail / Extortion</option>
                  <option value="other">Other Incident</option>
                </select>
              </div>

              <div>
                <label className={`block font-medium mb-1 ${isCream ? 'text-[#0D0D0D]' : 'text-slate-300'}`}>
                  Severity Level (1 to 5)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {([1, 2, 3, 4, 5] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeverity(s)}
                      className={`py-1.5 rounded-lg font-bold border transition ${
                        severity === s
                          ? isCream
                            ? 'bg-[#0D0D0D] text-[#FDFBD4] border-black shadow-[1px_1px_0px_0px_#000]'
                            : 'bg-rose-600 text-white border-rose-500'
                          : isCream
                          ? 'bg-white border-black/30 text-[#242424]'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`font-medium ${isCream ? 'text-[#0D0D0D]' : 'text-slate-300'}`}>
                    Location / Landmark *
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isDetectingGps}
                    className={`text-[11px] font-bold flex items-center gap-1 transition ${
                      isCream ? 'text-sky-700 hover:text-sky-900' : 'text-sky-400 hover:text-sky-300'
                    }`}
                  >
                    <Crosshair className={`w-3 h-3 ${isDetectingGps ? 'animate-spin' : ''}`} />
                    <span>{isDetectingGps ? 'Detecting...' : 'Detect GPS'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Metro Station Gate 2, Bus Stop, Office Parking"
                  className={`w-full rounded-xl border px-3 py-2 ${
                    isCream
                      ? 'border-black bg-white text-[#0D0D0D]'
                      : 'border-slate-800 bg-slate-950 text-white'
                  }`}
                />
              </div>

              {/* Geolocation Coordinate Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block font-medium mb-1 ${isCream ? 'text-[#0D0D0D]' : 'text-slate-300'}`}>
                    Latitude (GPS)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="e.g. 12.9784"
                    className={`w-full rounded-xl border px-2.5 py-1.5 font-mono text-xs ${
                      isCream
                        ? 'border-black bg-white text-[#0D0D0D]'
                        : 'border-slate-800 bg-slate-950 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block font-medium mb-1 ${isCream ? 'text-[#0D0D0D]' : 'text-slate-300'}`}>
                    Longitude (GPS)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="e.g. 77.6408"
                    className={`w-full rounded-xl border px-2.5 py-1.5 font-mono text-xs ${
                      isCream
                        ? 'border-black bg-white text-[#0D0D0D]'
                        : 'border-slate-800 bg-slate-950 text-white'
                    }`}
                  />
                </div>
              </div>

              {gpsAccuracy && (
                <div className={`text-[10px] flex items-center gap-1 ${isCream ? 'text-[#242424]' : 'text-slate-400'}`}>
                  <Compass className="w-3 h-3 text-emerald-500" />
                  <span>GPS Precision Tagged: ±{gpsAccuracy}m radius</span>
                </div>
              )}

              <div>
                <label className={`block font-medium mb-1 ${isCream ? 'text-[#0D0D0D]' : 'text-slate-300'}`}>
                  Factual Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide concrete facts: who said what, actions, physical route..."
                  className={`w-full rounded-xl border p-2.5 ${
                    isCream
                      ? 'border-black bg-white text-[#0D0D0D]'
                      : 'border-slate-800 bg-slate-950 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-medium mb-1 ${isCream ? 'text-[#0D0D0D]' : 'text-slate-300'}`}>
                  People Involved (Optional)
                </label>
                <input
                  type="text"
                  value={peopleInvolved}
                  onChange={(e) => setPeopleInvolved(e.target.value)}
                  placeholder="Names, clothing descriptions, license plates"
                  className={`w-full rounded-xl border px-3 py-2 ${
                    isCream
                      ? 'border-black bg-white text-[#0D0D0D]'
                      : 'border-slate-800 bg-slate-950 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-medium mb-1 ${isCream ? 'text-[#0D0D0D]' : 'text-slate-300'}`}>
                  Witnesses (Optional)
                </label>
                <input
                  type="text"
                  value={witnesses}
                  onChange={(e) => setWitnesses(e.target.value)}
                  placeholder="Names or contacts of witnesses"
                  className={`w-full rounded-xl border px-3 py-2 ${
                    isCream
                      ? 'border-black bg-white text-[#0D0D0D]'
                      : 'border-slate-800 bg-slate-950 text-white'
                  }`}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={reportedToPolice}
                  onChange={(e) => setReportedToPolice(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-0"
                />
                <span className={isCream ? 'text-[#0D0D0D]' : 'text-slate-300'}>
                  Officially reported to police / 112
                </span>
              </label>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 rounded-xl py-2.5 font-bold border transition ${
                    isCream
                      ? 'border-black bg-white text-[#0D0D0D] hover:bg-black/5'
                      : 'border-slate-800 bg-slate-800 text-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 rounded-xl py-2.5 font-bold transition shadow ${
                    isCream
                      ? 'bg-[#0D0D0D] hover:bg-black text-[#FDFBD4] border border-black shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-sky-600 hover:bg-sky-500 text-white'
                  }`}
                >
                  Save Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
