import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { useTranslation } from '../hooks/useTranslation';
import {
  ShieldCheck,
  Upload,
  File,
  Trash2,
  Download,
  Copy,
  Check,
  ArrowLeft
} from 'lucide-react';
import { formatBytes, formatDate } from '../lib/utils';

export const EvidenceVaultPage: React.FC = () => {
  const {
    evidence,
    addEvidence,
    deleteEvidence,
    incidents,
    setCurrentPage
  } = useAegis();
  const { t } = useTranslation();

  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

  const safeEvidence = evidence || [];
  const safeIncidents = incidents || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await addEvidence(
        file,
        description.trim() || `Uploaded ${file.name}`,
        selectedIncidentId || undefined
      );
      setDescription('');
      setSelectedIncidentId('');
      e.target.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  const copyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const exportEvidenceManifest = () => {
    const manifest = {
      title: 'Abhaya Private Record Manifest',
      generatedAt: new Date().toISOString(),
      vaultItemCount: safeEvidence.length,
      records: safeEvidence.map(ev => ({
        id: ev.id,
        filename: ev.filename,
        fingerprint: ev.sha256Hash,
        fileSize: ev.fileSize,
        fileType: ev.fileType,
        uploadedAt: ev.uploadedAt,
        description: ev.description,
        linkedIncidentId: ev.incidentId || 'UNLINKED'
      }))
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abhaya-evidence-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => setCurrentPage('incidents')}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--primary)] hover:underline mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[1.75]" />
            Back to incidents
          </button>
          <h1 className="page-title">{t.evidenceVaultTitle || 'Your private record'}</h1>
          <p className="text-caption text-[14px] mt-1">
            Save screenshots and recordings securely so they cannot be altered later.
          </p>
        </div>

        <button
          onClick={exportEvidenceManifest}
          className="h-8 px-3 rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] text-[12px] font-medium hover:bg-[var(--surface)] transition cursor-pointer flex items-center shrink-0"
        >
          <Download className="w-3.5 h-3.5 mr-1 stroke-[1.75]" />
          Export
        </button>
      </div>

      {/* Plain Language Note */}
      <div className="p-3.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] text-[13px] text-[var(--text)] space-y-1">
        <div className="flex items-center gap-1.5 font-medium text-[var(--text)]">
          <ShieldCheck className="w-4 h-4 text-[var(--safe)] stroke-[1.75]" />
          <span>Protected from edits</span>
        </div>
        <p className="text-caption text-[12px] leading-relaxed">
          When you upload photos, recordings, or screenshots, Abhaya generates a cryptographic digital fingerprint stored on your device. This verifies that your file has remained original and untouched since saved.
        </p>
      </div>

      {/* Upload Box */}
      <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-3">
        <h3 className="section-title text-[16px]">Add new file</h3>
        <div>
          <label className="text-[12px] font-medium text-[var(--text)] block mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Screenshot of threatening message on WhatsApp"
            className="soft-input w-full text-[13px]"
          />
        </div>

        {safeIncidents.length > 0 && (
          <div>
            <label className="text-[12px] font-medium text-[var(--text)] block mb-1">
              Link to incident (Optional)
            </label>
            <select
              value={selectedIncidentId}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              className="soft-input w-full text-[13px] cursor-pointer"
            >
              <option value="">Do not link (Stand-alone evidence)</option>
              {safeIncidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.category.replace('_', ' ')} • {inc.location} ({formatDate(inc.timestamp)})
                </option>
              ))}
            </select>
          </div>
        )}

        <label className="p-4 border-2 border-dashed border-[var(--line)] rounded-[12px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[var(--surface-2)] transition">
          <Upload className="w-6 h-6 text-[var(--primary)] mb-1 stroke-[1.75]" />
          <span className="text-[13px] font-medium text-[var(--text)]">
            {isUploading ? 'Securing file...' : 'Choose file to lock & protect'}
          </span>
          <span className="text-caption text-[11px] mt-0.5">Images, PDFs, audio recordings</span>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            accept="image/*,.pdf,audio/*"
          />
        </label>
      </div>

      {/* Evidence Files List */}
      <div className="space-y-2">
        <h3 className="section-title text-[16px]">Stored files ({safeEvidence.length})</h3>
        {safeEvidence.length === 0 ? (
          <div className="p-6 rounded-[12px] bg-[var(--surface-2)] text-center text-caption text-[13px]">
            Nothing saved here yet. Save photos, screenshots, or recordings. They are locked with a fingerprint so no one can say they were edited.
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
            {safeEvidence.map((ev) => (
              <div key={ev.id} className="py-3.5 space-y-2 px-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {ev.dataUrl ? (
                      <div className="w-12 h-12 rounded-[10px] overflow-hidden bg-[var(--surface-2)] border border-[var(--line)] shrink-0 mt-0.5 relative">
                        <img
                          src={ev.dataUrl}
                          alt={ev.filename}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {ev.kind === 'sos_photo' && (
                          <span className="absolute bottom-0 inset-x-0 bg-red-600 text-[8px] font-bold text-white text-center uppercase tracking-tighter py-0.5 leading-none">
                            SOS
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[var(--surface-2)] text-[var(--text)] flex items-center justify-center shrink-0 mt-0.5">
                        <File className="w-4 h-4 stroke-[1.75]" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-medium text-[14px] text-[var(--text)] truncate">{ev.filename}</h4>
                        {ev.kind === 'sos_photo' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shrink-0">
                            SOS Evidence
                          </span>
                        )}
                      </div>
                      <p className="text-caption text-[12px] truncate">{ev.description}</p>
                      <p className="text-caption text-[11px] mt-0.5">
                        {formatBytes(ev.fileSize)} • {formatDate(ev.uploadedAt)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteEvidence(ev.id)}
                    className="p-1.5 text-[var(--muted)] hover:text-[var(--sos)] transition"
                    aria-label="Delete file"
                  >
                    <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                  </button>
                </div>

                {/* Digital Fingerprint */}
                <div className="p-2 rounded-[8px] bg-[var(--surface-2)] flex items-center justify-between gap-2 text-[11px]">
                  <div className="min-w-0 flex items-center gap-1.5 truncate">
                    <span className="text-[var(--muted)] shrink-0">Fingerprint:</span>
                    <span className="font-mono text-[var(--text)] truncate">{ev.sha256Hash}</span>
                  </div>
                  <button
                    onClick={() => copyHash(ev.id, ev.sha256Hash)}
                    className="text-[var(--primary)] hover:underline shrink-0 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    {copiedHashId === ev.id ? <Check className="w-3 h-3 text-[var(--safe)]" /> : <Copy className="w-3 h-3 stroke-[1.75]" />}
                    <span>{copiedHashId === ev.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
