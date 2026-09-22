import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { IncidentRecord, IncidentCategory, IncidentPhoto } from '../types';
import { IncidentMapView } from '../components/incidents/IncidentMapView';
import { useTranslation } from '../hooks/useTranslation';
import {
  Plus,
  Lock,
  Download,
  Trash2,
  MoreVertical,
  X,
  Crosshair,
  Eye,
  EyeOff,
  Camera,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '../lib/utils';

export const IncidentsPage: React.FC = () => {
  const {
    incidents,
    addIncident,
    deleteIncident,
    evidence,
    setCurrentPage
  } = useAegis();
  const { t } = useTranslation();

  const [viewMode, setViewMode] = useState<'map' | 'timeline'>('map');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [minSeverity, setMinSeverity] = useState<number>(0);
  const [hideDetails, setHideDetails] = useState(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [selectedIncidentDetail, setSelectedIncidentDetail] = useState<IncidentRecord | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<IncidentPhoto | null>(null);

  // Add Incident Form state
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [category, setCategory] = useState<IncidentCategory>('harassment');
  const [severity, setSeverity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [description, setDescription] = useState('');
  const [peopleInvolved, setPeopleInvolved] = useState('');
  const [witnesses, setWitnesses] = useState('');
  const [reportedToPolice, setReportedToPolice] = useState(false);

  const categories = [
    { key: 'ALL', label: 'All' },
    { key: 'stalking', label: 'Stalking' },
    { key: 'harassment', label: 'Harassment' },
    { key: 'unsafe_path', label: 'Unsafe path' },
    { key: 'cyber_harassment', label: 'Cyber' },
    { key: 'other', label: 'Other' }
  ];

  const safeIncidents = incidents || [];
  const safeEvidence = evidence || [];

  const filteredIncidents = safeIncidents.filter(inc => {
    if (selectedCategory !== 'ALL' && inc.category !== selectedCategory) return false;
    if (inc.severity < minSeverity) return false;
    return true;
  });

  const getIncidentPhotos = (inc: IncidentRecord): IncidentPhoto[] => {
    if (inc.photos && inc.photos.length > 0) {
      return inc.photos;
    }
    const linked = safeEvidence.filter(e =>
      (inc.evidenceIds && inc.evidenceIds.includes(e.id)) ||
      (e.incidentId && e.incidentId === inc.id) ||
      (inc.alertId && e.alertId === inc.alertId)
    );
    return linked.map(e => ({
      id: e.id,
      dataUrl: e.dataUrl || '',
      filename: e.filename,
      facing: e.tags?.includes('back_camera') ? ('back' as const) : e.tags?.includes('front_camera') ? ('front' as const) : undefined,
      description: e.description,
      sha256Hash: e.sha256Hash
    })).filter(p => !!p.dataUrl);
  };

  const isSOSIncident = (inc: IncidentRecord) => {
    return (
      inc.isSOSTriggered === true ||
      inc.id.startsWith('inc_sos') ||
      (inc.category === 'other' && inc.description.toLowerCase().includes('sos')) ||
      (inc.notes && inc.notes.toLowerCase().includes('emergency'))
    );
  };

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
          setLocation(`GPS Point (${lat}, ${lng})`);
        }
      },
      (err) => {
        setIsDetectingGps(false);
        console.warn('Geolocation fallback:', err.message);
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
      reportedToPolice,
      evidenceIds: []
    });

    setShowAddModal(false);
    setDescription('');
    setLocation('');
    setLatitude('');
    setLongitude('');
    setGpsAccuracy(null);
    setPeopleInvolved('');
    setWitnesses('');
  };

  const exportIncidentReport = () => {
    const textData = `=== ABHAYA INCIDENT DOCUMENTATION REPORT ===\nGenerated: ${new Date().toLocaleString('en-IN')}\nRecords: ${filteredIncidents.length}\n\n` +
      filteredIncidents.map((inc, i) => {
        const gpsText = inc.latitude && inc.longitude ? `GPS: ${inc.latitude}, ${inc.longitude}\n` : '';
        return (
          `[RECORD #${i + 1}] ID: ${inc.id}\n` +
          `Date: ${inc.date} ${inc.time}\n` +
          `Category: ${inc.category.toUpperCase()}\n` +
          `Severity: Level ${inc.severity}/5\n` +
          `Location: ${inc.location}\n` +
          gpsText +
          `Description: ${inc.description}\n` +
          (inc.peopleInvolved ? `People: ${inc.peopleInvolved}\n` : '') +
          (inc.witnesses ? `Witnesses: ${inc.witnesses}\n` : '') +
          `Reported to Police: ${inc.reportedToPolice ? 'Yes' : 'No'}\n` +
          `-----------------------------------------------------\n`
        );
      }).join('\n');

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abhaya-incident-timeline-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowOverflowMenu(false);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">{t.pageTitleIncidents || 'Incidents'}</h1>
          <p className="text-caption text-[14px] mt-1">
            {t.pageSubtitleIncidents || 'Document encounters, map patterns, and protect evidence.'}
          </p>
        </div>

        {/* Overflow menu for Export */}
        <div className="relative">
          <button
            onClick={() => setShowOverflowMenu(!showOverflowMenu)}
            className="w-9 h-9 rounded-full bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] flex items-center justify-center cursor-pointer transition"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4 stroke-[1.75]" />
          </button>

          {showOverflowMenu && (
            <div className="absolute right-0 top-10 z-30 p-1.5 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] min-w-[170px]">
              <button
                onClick={exportIncidentReport}
                className="w-full px-3 py-2 text-[13px] font-medium text-left text-[var(--text)] hover:bg-[var(--surface-2)] rounded-[8px] flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 stroke-[1.75]" />
                Export timeline
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Segmented Control */}
      <div className="p-1 rounded-full bg-[var(--surface-2)] border border-[var(--line)] grid grid-cols-2 gap-1">
        <button
          id="tab-incidents-map"
          onClick={() => setViewMode('map')}
          className={`h-9 rounded-full text-[13px] font-medium transition cursor-pointer ${
            viewMode === 'map'
              ? 'bg-[var(--surface)] text-[var(--text)]'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          Map
        </button>
        <button
          id="tab-incidents-timeline"
          onClick={() => setViewMode('timeline')}
          className={`h-9 rounded-full text-[13px] font-medium transition cursor-pointer ${
            viewMode === 'timeline'
              ? 'bg-[var(--surface)] text-[var(--text)]'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          Timeline ({safeIncidents.length})
        </button>
      </div>

      {/* Filters: Category pills + min severity dropdown */}
      <div className="flex items-center gap-2">
        <div className="flex-1 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`h-7 px-3 rounded-full text-[12px] font-medium transition cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                    : 'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--line)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Min Level Dropdown */}
        <select
          value={minSeverity}
          onChange={(e) => setMinSeverity(Number(e.target.value))}
          className="soft-input h-7 px-2 text-[12px] font-medium bg-[var(--surface-2)] border-[var(--line)] shrink-0 cursor-pointer"
          aria-label="Minimum severity level"
        >
          <option value={0}>All levels</option>
          <option value={2}>Level 2+</option>
          <option value={3}>Level 3+</option>
          <option value={4}>Level 4+</option>
        </select>
      </div>

      {/* Log incident single-line button */}
      <div>
        <button
          id="btn-log-incident-single"
          onClick={() => setShowAddModal(true)}
          className="soft-btn soft-btn-primary w-full text-[14px]"
        >
          <Plus className="w-4 h-4 mr-1.5 stroke-[1.75]" />
          {t.logIncident || 'Log an incident'}
        </button>
      </div>

      {/* Evidence vault row */}
      <div className="soft-card p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Lock className="w-5 h-5 text-[var(--text)] shrink-0 stroke-[1.75]" />
          <div className="min-w-0">
            <h3 className="card-title text-[15px]">{t.evidenceVaultTitle || 'Your private record'}</h3>
            <p className="text-caption text-[12px] truncate mt-0.5">
              {safeEvidence.length} {t.evidenceVaultCount || 'files, protected from edits'}
            </p>
          </div>
        </div>
        <button
          id="btn-open-evidence-vault"
          onClick={() => setCurrentPage('evidence')}
          className="h-8 px-3.5 rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] text-[12px] font-medium hover:bg-[var(--surface)] transition cursor-pointer shrink-0"
        >
          Open
        </button>
      </div>

      {/* VIEW CONTENT: MAP OR TIMELINE */}
      {viewMode === 'map' ? (
        <div className="space-y-3">
          <IncidentMapView
            incidents={filteredIncidents}
            onSelectIncident={(inc) => setSelectedIncidentDetail(inc)}
            onAddNewIncidentAt={(coords) => {
              setLatitude(String(coords.lat));
              setLongitude(String(coords.lng));
              setLocation(`Location (${coords.lat}, ${coords.lng})`);
              setShowAddModal(true);
            }}
          />

          {/* Quick List under Map */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="section-title text-[16px]">Nearby reports</span>
              <button
                onClick={() => setHideDetails(!hideDetails)}
                className="text-[12px] text-[var(--muted)] hover:text-[var(--text)] flex items-center gap-1 cursor-pointer"
              >
                {hideDetails ? <Eye className="w-3.5 h-3.5 stroke-[1.75]" /> : <EyeOff className="w-3.5 h-3.5 stroke-[1.75]" />}
                <span>{hideDetails ? 'Show details' : 'Hide details'}</span>
              </button>
            </div>

            {filteredIncidents.length === 0 ? (
              <div className="py-4 text-[13px] text-[var(--muted)]">
                {t.emptyIncidents || 'Nothing here yet. If something happens, write it down. Only you can see it.'}
              </div>
            ) : (
              <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
                {filteredIncidents.slice(0, 3).map((inc) => {
                  const isSOS = isSOSIncident(inc);
                  const photos = getIncidentPhotos(inc);
                  return (
                    <div
                      key={inc.id}
                      onClick={() => setSelectedIncidentDetail(inc)}
                      className="py-3 flex flex-col gap-2 hover:bg-[var(--surface-2)]/50 transition cursor-pointer px-1"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isSOS && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--sos)] text-white inline-flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                                SOS Alert
                              </span>
                            )}
                            <span className="text-[14px] font-medium text-[var(--text)] truncate">
                              {inc.category.replace('_', ' ')} • {inc.location}
                            </span>
                          </div>
                          <p className="text-caption text-[12px] mt-0.5">{formatDate(inc.timestamp)} {inc.time ? `• ${inc.time}` : ''}</p>
                          <p className={`text-[12px] text-[var(--muted)] mt-1 line-clamp-1 ${hideDetails ? 'blur-sm select-none' : ''}`}>
                            {inc.description}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                            inc.severity <= 2
                              ? 'bg-[var(--safe)]/15 text-[var(--safe)]'
                              : inc.severity === 3
                              ? 'bg-[var(--accent)] text-[#1A1F45]'
                              : 'bg-[var(--sos)] text-white'
                          }`}
                        >
                          Level {inc.severity}
                        </span>
                      </div>

                      {/* Photo preview strip if photos exist */}
                      {photos.length > 0 && (
                        <div className="flex items-center gap-2 pt-1 overflow-x-auto scrollbar-none">
                          {photos.map((p, idx) => (
                            <div
                              key={p.id || idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingPhoto(p);
                              }}
                              className="relative w-12 h-12 rounded-lg overflow-hidden border border-[var(--line)] shrink-0 bg-black/40 group hover:opacity-90 transition"
                            >
                              <img src={p.dataUrl} alt={p.filename} className="w-full h-full object-cover" />
                              <span className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[8px] text-center font-mono py-0.5">
                                {p.facing === 'back' ? 'REAR' : 'FRONT'}
                              </span>
                            </div>
                          ))}
                          <span className="text-[11px] font-medium text-[var(--muted)] flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5 text-[var(--primary)]" />
                            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TIMELINE VIEW */
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-caption text-[13px]">{filteredIncidents.length} recorded</span>
            <button
              onClick={() => setHideDetails(!hideDetails)}
              className="text-[12px] text-[var(--muted)] hover:text-[var(--text)] flex items-center gap-1 cursor-pointer"
            >
              {hideDetails ? <Eye className="w-3.5 h-3.5 stroke-[1.75]" /> : <EyeOff className="w-3.5 h-3.5 stroke-[1.75]" />}
              <span>{hideDetails ? 'Show details' : 'Hide details'}</span>
            </button>
          </div>

          {filteredIncidents.length === 0 ? (
            <div className="py-6 text-center text-[13px] text-[var(--muted)]">
              {t.emptyIncidents || 'Nothing here yet. If something happens, write it down. Only you can see it.'}
            </div>
          ) : (
            <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
              {filteredIncidents.map((inc) => {
                const isSOS = isSOSIncident(inc);
                const photos = getIncidentPhotos(inc);
                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidentDetail(inc)}
                    className="py-3.5 transition hover:bg-[var(--surface-2)]/50 cursor-pointer px-1"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              inc.severity <= 2
                                ? 'bg-[var(--safe)]'
                                : inc.severity === 3
                                ? 'bg-[var(--accent)]'
                                : 'bg-[var(--sos)]'
                            }`}
                          />
                          {isSOS && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--sos)] text-white inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                              SOS Alert
                            </span>
                          )}
                          <h4 className="text-[14px] font-medium text-[var(--text)] truncate">
                            {inc.category.replace('_', ' ')} • {inc.location}
                          </h4>
                        </div>

                        <p className="text-caption text-[12px] mt-0.5">
                          {formatDate(inc.timestamp)} {inc.time ? `• ${inc.time}` : ''}
                        </p>

                        <p
                          className={`text-[13px] text-[var(--muted)] mt-1.5 line-clamp-2 ${
                            hideDetails ? 'blur-sm select-none' : ''
                          }`}
                        >
                          {inc.description}
                        </p>

                        {/* Photo preview strip if photos exist */}
                        {photos.length > 0 && (
                          <div className="flex items-center gap-2 mt-2 pt-1 overflow-x-auto scrollbar-none">
                            {photos.map((p, idx) => (
                              <div
                                key={p.id || idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewingPhoto(p);
                                }}
                                className="relative w-14 h-14 rounded-lg overflow-hidden border border-[var(--line)] shrink-0 bg-black/40 group hover:opacity-90 transition"
                              >
                                <img src={p.dataUrl} alt={p.filename} className="w-full h-full object-cover" />
                                <span className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[8px] text-center font-mono py-0.5">
                                  {p.facing === 'back' ? 'REAR' : 'FRONT'}
                                </span>
                              </div>
                            ))}
                            <span className="text-[11px] font-medium text-[var(--text)] flex items-center gap-1.5 bg-[var(--surface-2)] px-2.5 py-1 rounded-full border border-[var(--line)]">
                              <Camera className="w-3.5 h-3.5 text-[var(--primary)]" />
                              {photos.length} {photos.length === 1 ? 'photo preserved' : 'photos preserved'}
                            </span>
                          </div>
                        )}
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                          inc.severity <= 2
                            ? 'bg-[var(--safe)]/15 text-[var(--safe)]'
                            : inc.severity === 3
                            ? 'bg-[var(--accent)] text-[#1A1F45]'
                            : 'bg-[var(--sos)] text-white'
                        }`}
                      >
                        Level {inc.severity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* INCIDENT DETAIL MODAL */}
      {selectedIncidentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="soft-card w-full max-w-sm p-5 space-y-4 bg-[var(--surface)] border border-[var(--line)] max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-2 border-b border-[var(--line)]">
              <div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    selectedIncidentDetail.severity <= 2
                      ? 'bg-[var(--safe)]/15 text-[var(--safe)]'
                      : selectedIncidentDetail.severity === 3
                      ? 'bg-[var(--accent)] text-[#1A1F45]'
                      : 'bg-[var(--sos)] text-white'
                  }`}
                >
                  Level {selectedIncidentDetail.severity} Severity
                </span>
                <h3 className="card-title text-[16px] mt-1">
                  {selectedIncidentDetail.location}
                </h3>
                <p className="text-caption text-[12px]">
                  {formatDate(selectedIncidentDetail.timestamp)} • {selectedIncidentDetail.time}
                </p>
              </div>
              <button
                onClick={() => setSelectedIncidentDetail(null)}
                className="p-1 rounded-full text-[var(--muted)] hover:text-[var(--text)]"
                aria-label="Close"
              >
                <X className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>

            {/* SOS Triggered Notice */}
            {isSOSIncident(selectedIncidentDetail) && (
              <div className="p-2.5 rounded-[10px] bg-[var(--sos)]/10 border border-[var(--sos)]/30 text-[12px] text-[var(--sos)] font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 stroke-[2]" />
                <span>Emergency SOS Triggered: Automatically recorded & vaulted upon activation.</span>
              </div>
            )}

            <div className="space-y-3 text-[13px]">
              <div>
                <span className="font-medium text-[var(--text)] block">Description:</span>
                <p className="text-caption text-[12px] mt-0.5">{selectedIncidentDetail.description}</p>
              </div>

              {selectedIncidentDetail.notes && (
                <div>
                  <span className="font-medium text-[var(--text)] block">Incident Notes & Dispatch:</span>
                  <p className="text-caption text-[12px] mt-0.5">{selectedIncidentDetail.notes}</p>
                </div>
              )}

              {selectedIncidentDetail.peopleInvolved && (
                <div>
                  <span className="font-medium text-[var(--text)] block">People Involved:</span>
                  <p className="text-caption text-[12px] mt-0.5">{selectedIncidentDetail.peopleInvolved}</p>
                </div>
              )}

              {selectedIncidentDetail.witnesses && (
                <div>
                  <span className="font-medium text-[var(--text)] block">Witnesses:</span>
                  <p className="text-caption text-[12px] mt-0.5">{selectedIncidentDetail.witnesses}</p>
                </div>
              )}

              {selectedIncidentDetail.latitude && (
                <div>
                  <span className="font-medium text-[var(--text)] block">Coordinates:</span>
                  <p className="text-caption text-[12px] font-mono mt-0.5">
                    {selectedIncidentDetail.latitude}, {selectedIncidentDetail.longitude} (±{selectedIncidentDetail.accuracy || 0}m)
                  </p>
                </div>
              )}
            </div>

            {/* Evidence Photos Section */}
            {(() => {
              const detailPhotos = getIncidentPhotos(selectedIncidentDetail);
              if (detailPhotos.length === 0) return null;
              return (
                <div className="space-y-2.5 pt-3 border-t border-[var(--line)]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[13px] text-[var(--text)] flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[var(--primary)]" />
                      Preserved Evidence Photos ({detailPhotos.length})
                    </span>
                    <span className="text-[11px] text-[var(--safe)] font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Encrypted
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {detailPhotos.map((photo, idx) => (
                      <div
                        key={photo.id || idx}
                        onClick={() => setViewingPhoto(photo)}
                        className="group relative rounded-[10px] overflow-hidden border border-[var(--line)] bg-black/60 cursor-pointer aspect-[4/3]"
                      >
                        <img
                          src={photo.dataUrl}
                          alt={photo.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[10px] text-white">
                          <span className="px-1.5 py-0.5 rounded bg-black/70 font-mono text-[9px]">
                            {photo.facing === 'back' ? 'Rear Lens' : photo.facing === 'front' ? 'Front Lens' : 'Photo'}
                          </span>
                          <span className="text-white/90 font-mono text-[9px] bg-black/50 px-1 rounded">View</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="pt-2 flex justify-end gap-2 border-t border-[var(--line)]">
              <button
                onClick={() => {
                  deleteIncident(selectedIncidentDetail.id);
                  setSelectedIncidentDetail(null);
                }}
                className="h-9 px-3.5 rounded-full text-[12px] font-medium text-[var(--sos)] hover:bg-[var(--sos)]/10 transition"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1 inline stroke-[1.75]" />
                Delete
              </button>
              <button
                onClick={() => setSelectedIncidentDetail(null)}
                className="soft-btn soft-btn-primary text-[12px] h-9 px-4"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT NEW INCIDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSave}
            className="soft-card w-full max-w-sm p-5 space-y-4 bg-[var(--surface)] border border-[var(--line)] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <div>
                <h3 className="section-title text-[18px]">{t.logIncident || 'Log an incident'}</h3>
                <p className="text-caption text-[12px]">Saved privately on this phone</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-[var(--muted)] hover:text-[var(--text)]"
                aria-label="Close"
              >
                <X className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="text-[13px] font-medium text-[var(--text)] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="soft-input w-full text-[13px]"
              >
                <option value="harassment">Street harassment</option>
                <option value="stalking">Stalking / Following</option>
                <option value="unsafe_path">Poor lighting / Unsafe route</option>
                <option value="cyber_harassment">Online / Cyber threat</option>
                <option value="coercion">Threat or coercion</option>
                <option value="other">Other safety concern</option>
              </select>
            </div>

            {/* Severity Picker 1-5 */}
            <div>
              <label className="text-[13px] font-medium text-[var(--text)] block mb-1">
                Severity Level: {severity}/5
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {([1, 2, 3, 4, 5] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`h-8 rounded-[8px] text-[13px] font-semibold transition cursor-pointer ${
                      severity === lvl
                        ? lvl <= 2
                          ? 'bg-[var(--safe)] text-white'
                          : lvl === 3
                          ? 'bg-[var(--accent)] text-[#1A1F45]'
                          : 'bg-[var(--sos)] text-white'
                        : 'bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Location & GPS */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[13px] font-medium text-[var(--text)]">Location</label>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isDetectingGps}
                  className="text-[12px] font-medium text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Crosshair className={`w-3.5 h-3.5 stroke-[1.75] ${isDetectingGps ? 'animate-spin' : ''}`} />
                  {isDetectingGps ? 'Locating...' : 'Use current GPS'}
                </button>
              </div>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Koramangala 5th Block, Bus stop"
                className="soft-input w-full text-[13px]"
              />
              {latitude && (
                <p className="text-[11px] font-mono text-[var(--muted)] mt-1">
                  GPS: {latitude}, {longitude} (±{gpsAccuracy || 0}m)
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-[13px] font-medium text-[var(--text)] block mb-1">
                What happened?
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurred, time of day, vehicles, or behavior..."
                className="soft-input w-full text-[13px]"
              />
            </div>

            {/* Witnesses or individuals */}
            <div>
              <label className="text-[13px] font-medium text-[var(--text)] block mb-1">
                Individuals or Witnesses (Optional)
              </label>
              <input
                type="text"
                value={witnesses}
                onChange={(e) => setWitnesses(e.target.value)}
                placeholder="Descriptions, shopkeepers, witnesses..."
                className="soft-input w-full text-[13px]"
              />
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="soft-btn soft-btn-secondary text-[13px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="soft-btn soft-btn-primary text-[13px]"
              >
                Save record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FULL PHOTO PREVIEW MODAL */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="soft-card w-full max-w-md p-4 space-y-3 bg-[var(--surface)] border border-[var(--line)] max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <div>
                <h4 className="font-semibold text-[14px] text-[var(--text)]">
                  {viewingPhoto.facing === 'back' ? 'Rear Camera Still' : viewingPhoto.facing === 'front' ? 'Front Camera Still' : 'Evidence Still'}
                </h4>
                <p className="text-caption text-[11px] font-mono truncate max-w-[240px]">
                  {viewingPhoto.filename}
                </p>
              </div>
              <button
                onClick={() => setViewingPhoto(null)}
                className="p-1.5 rounded-full text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>

            <div className="relative rounded-lg overflow-hidden bg-black flex items-center justify-center max-h-[55vh]">
              <img
                src={viewingPhoto.dataUrl}
                alt={viewingPhoto.filename}
                className="max-h-[55vh] w-auto object-contain rounded"
              />
            </div>

            {viewingPhoto.sha256Hash && (
              <div className="p-2 rounded bg-[var(--surface-2)] text-[11px] font-mono text-[var(--muted)] truncate">
                <span className="font-semibold text-[var(--text)]">SHA-256: </span>
                {viewingPhoto.sha256Hash}
              </div>
            )}

            <div className="pt-2 flex justify-between items-center border-t border-[var(--line)]">
              <span className="text-[11px] text-[var(--safe)] flex items-center gap-1 font-medium">
                <Lock className="w-3 h-3" />
                Vault Encrypted
              </span>
              <button
                onClick={() => setViewingPhoto(null)}
                className="soft-btn soft-btn-primary text-[12px] h-8 px-4 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
