import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import {
  ShieldCheck,
  Upload,
  File,
  Image as ImageIcon,
  Trash2,
  Download,
  Copy,
  Check,
  Lock,
  Info,
  ExternalLink,
  Plus
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

  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

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
      // Reset input
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
      title: 'Aegis Cryptographic Evidence Manifest',
      generatedAt: new Date().toISOString(),
      vaultItemCount: evidence.length,
      integrityAlgorithm: 'SHA-256 (NIST FIPS 180-4)',
      records: evidence.map(ev => ({
        id: ev.id,
        filename: ev.filename,
        sha256: ev.sha256Hash,
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
    a.download = `aegis-evidence-manifest-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            Cryptographic Evidence Vault
          </h2>
          <p className="text-xs text-slate-400">
            Tamper-evident client-side SHA-256 fingerprinting for legal preservation.
          </p>
        </div>

        <button
          onClick={exportEvidenceManifest}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          title="Download verified cryptographic ledger"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Ledger</span>
        </button>
      </div>

      {/* Educational Legal Integrity Box */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Why Cryptographic Hashes Matter for Indian Courts</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Under Section 65B of the Indian Evidence Act, digital proof must demonstrate chain-of-custody. When you upload a screenshot or call recording, Aegis computes an irreversible mathematical fingerprint (SHA-256) directly in your browser. If a file is altered by even one pixel, its hash changes entirely.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-emerald-400" />
          Seal New Evidence File
        </h3>

        <div className="space-y-2.5 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Description / Context</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Threatening WhatsApp message screenshot, CCTV snippet"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Link to Incident Record (Optional)</label>
            <select
              value={selectedIncidentId}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">-- Do not link to an incident --</option>
              {incidents.map(inc => (
                <option key={inc.id} value={inc.id}>
                  {inc.date} - {inc.category} ({inc.location.slice(0, 20)})
                </option>
              ))}
            </select>
          </div>

          <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-800 hover:border-emerald-500/60 rounded-xl cursor-pointer bg-slate-950/60 transition group">
            <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition mb-1" />
            <span className="font-semibold text-slate-200 text-xs">
              {isUploading ? 'Computing SHA-256...' : 'Select or drop file to seal'}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              Supports screenshots (.png, .jpg), voice recordings (.m4a), and PDFs
            </span>
            <input
              type="file"
              disabled={isUploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Vault Items List */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Secured Artifacts ({evidence.length})
        </h3>

        {evidence.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400">
            No evidence files sealed yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {evidence.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 space-y-2.5 shadow-sm text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
                      {item.fileType.startsWith('image/') ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : (
                        <File className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white truncate max-w-[200px]">
                        {item.filename}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatBytes(item.fileSize)} • {formatDate(item.uploadedAt)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteEvidence(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition"
                    title="Remove from vault"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                  {item.description}
                </p>

                {/* Cryptographic SHA-256 Hash pill */}
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono font-semibold text-emerald-400">SHA-256 FINGERPRINT</span>
                    <button
                      onClick={() => copyHash(item.id, item.sha256Hash)}
                      className="flex items-center gap-1 text-slate-400 hover:text-white transition"
                      title="Copy complete hash"
                    >
                      {copiedHashId === item.id ? (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> Copied
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5">
                          <Copy className="w-2.5 h-2.5" /> Copy
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-[10px] text-slate-300 break-all select-all leading-tight">
                    {item.sha256Hash}
                  </div>
                </div>

                {item.dataUrl && (
                  <div className="pt-1">
                    <img
                      src={item.dataUrl}
                      alt={item.filename}
                      className="max-h-40 rounded-xl border border-slate-800 object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
