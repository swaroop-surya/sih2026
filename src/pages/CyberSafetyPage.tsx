import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  ExternalLink,
  Smartphone,
  Search
} from 'lucide-react';

export const CyberSafetyPage: React.FC = () => {
  const [urlToCheck, setUrlToCheck] = useState('');
  const [urlResult, setUrlResult] = useState<{ isSafe: boolean; note: string } | null>(null);

  const [checklist, setChecklist] = useState({
    twoFactor: true,
    socialPrivate: true,
    locationPermissions: false,
    unknownDevices: false,
    googleActivityReview: false
  });

  const checkUrl = () => {
    if (!urlToCheck.trim()) return;
    const lower = urlToCheck.toLowerCase();

    if (
      lower.includes('bit.ly') ||
      lower.includes('tinyurl') ||
      lower.includes('t.me') ||
      lower.includes('free-gift') ||
      lower.includes('apk') ||
      lower.includes('login-verify')
    ) {
      setUrlResult({
        isSafe: false,
        note: 'High-risk pattern: Shortened links or unofficial APK downloads are frequently used for phishing. Do not enter credentials.'
      });
    } else {
      setUrlResult({
        isSafe: true,
        note: 'No common malicious phishing patterns detected in this domain prefix. Still exercise caution if asked for passwords or OTPs.'
      });
    }
  };

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="page-title">Cyber Safety & Defense</h1>
        <p className="text-caption text-[14px] mt-1">
          Digital security screening, intimate image defense, and device privacy audits.
        </p>
      </div>

      {/* Emergency Cyber Extortion Box */}
      <div className="rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] p-4 space-y-2 text-[13px]">
        <div className="flex items-center gap-2 font-medium text-[var(--text)] text-[14px]">
          <ShieldAlert className="w-4 h-4 text-[var(--sos)] shrink-0 stroke-[1.75]" />
          <span>If facing blackmail or extortion:</span>
        </div>
        <div className="space-y-1.5 text-caption text-[12px] leading-relaxed">
          <p><strong>1. Do not pay:</strong> Paying money rarely stops extortion; it usually invites higher demands.</p>
          <p><strong>2. Do not delete chats:</strong> Preserve complete WhatsApp/Instagram chat history and profile links.</p>
          <p><strong>3. StopNCII.org hashing:</strong> Create non-reversible digital hashes of private photos on StopNCII.org to prevent their upload across Meta, Instagram, and Reddit.</p>
          <p><strong>4. Official helpline:</strong> Call <strong>1930</strong> (National Cyber Crime) or file on <strong>cybercrime.gov.in</strong>.</p>
        </div>
        <div className="pt-2 flex flex-wrap gap-2">
          <a
            href="https://stopncii.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] text-[12px] font-medium hover:bg-[var(--surface-2)] transition"
          >
            <span>StopNCII.org</span>
            <ExternalLink className="w-3 h-3 stroke-[1.75]" />
          </a>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[var(--primary)] text-[var(--on-primary)] text-[12px] font-medium transition"
          >
            <span>Portal (1930)</span>
            <ExternalLink className="w-3 h-3 stroke-[1.75]" />
          </a>
        </div>
      </div>

      {/* Suspicious URL Scanner */}
      <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-3 text-[13px]">
        <h3 className="section-title text-[15px]">
          Suspicious link scanner
        </h3>

        <div className="flex gap-2">
          <input
            type="url"
            value={urlToCheck}
            onChange={(e) => setUrlToCheck(e.target.value)}
            placeholder="Paste suspicious website, shortened link, or form URL..."
            className="soft-input flex-1 text-[13px]"
          />
          <button
            onClick={checkUrl}
            className="soft-btn soft-btn-primary text-[13px] px-4"
          >
            Scan
          </button>
        </div>

        {urlResult && (
          <div className={`p-3 rounded-[8px] text-[12px] border ${
            urlResult.isSafe
              ? 'bg-[var(--surface-2)] border-[var(--safe)] text-[var(--text)]'
              : 'bg-[var(--surface-2)] border-[var(--sos)] text-[var(--text)]'
          }`}>
            <p className="font-medium">{urlResult.isSafe ? 'Low Risk Flag' : 'Potential Phishing Threat'}</p>
            <p className="text-caption text-[11px] mt-0.5">{urlResult.note}</p>
          </div>
        )}
      </div>

      {/* Device Privacy Checklist */}
      <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-3 text-[13px]">
        <h3 className="section-title text-[15px]">
          Device privacy checklist
        </h3>

        <div className="space-y-2">
          {[
            { key: 'twoFactor' as const, label: 'Two-Factor Authentication (2FA) enabled on WhatsApp & Gmail via Authenticator app' },
            { key: 'socialPrivate' as const, label: 'Social media accounts set to private with tagged photo approvals enabled' },
            { key: 'locationPermissions' as const, label: 'Revoke background location permissions from unused third-party apps' },
            { key: 'unknownDevices' as const, label: 'Check WhatsApp Web & Telegram linked devices and log out unknown sessions' },
            { key: 'googleActivityReview' as const, label: 'Review account location sharing to ensure no unauthorized continuous sharing' },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => toggleCheck(item.key)}
              className="flex items-start gap-2.5 p-2.5 rounded-[8px] bg-[var(--surface-2)] cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={checklist[item.key]}
                onChange={() => {}}
                className="mt-0.5 rounded border-[var(--line)]"
              />
              <span className={`text-[12px] ${checklist[item.key] ? 'text-[var(--text)]' : 'text-[var(--muted)]'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
