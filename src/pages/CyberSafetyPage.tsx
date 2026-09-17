import React, { useState } from 'react';
import {
  Globe,
  ShieldAlert,
  Lock,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Smartphone,
  Eye,
  PhoneCall,
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
        note: 'High-risk warning: Shortened links or unofficial APK downloads are frequently used to deploy spyware or phishing forms. Do not enter credentials.'
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
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-sky-400" />
          Cyber Safety & Anti-Blackmail
        </h2>
        <p className="text-xs text-slate-400">
          Digital security screening, intimate image defense, and device privacy audits.
        </p>
      </div>

      {/* Emergency Cyber Extortion Box */}
      <div className="rounded-2xl bg-rose-950/40 border border-rose-800/60 p-4 space-y-2.5 text-xs text-rose-200">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <span>If You Are Facing Blackmail / Extortion:</span>
        </div>
        <div className="space-y-1.5 text-rose-200/90 text-[11px] leading-relaxed">
          <p><strong>1. DO NOT PAY:</strong> Paying money never stops extortion; it only invites higher demands.</p>
          <p><strong>2. DO NOT DELETE CHATS:</strong> Preserve complete WhatsApp/Instagram chat history, phone numbers, and profile URLs for the police cyber cell.</p>
          <p><strong>3. STOPNCII.ORG HASHING:</strong> You can create secure non-reversible hashes of intimate photos directly on StopNCII.org to prevent them from being uploaded across Meta, Instagram, and Reddit.</p>
          <p><strong>4. OFFICIAL PORTAL:</strong> File an immediate grievance on <strong>cybercrime.gov.in</strong> or call <strong>1930</strong> (Cyber Helpline).</p>
        </div>
        <div className="pt-1 flex gap-2">
          <a
            href="https://stopncii.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition"
          >
            <span>StopNCII.org Platform</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white text-xs font-semibold transition"
          >
            <span>Portal (1930)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Suspicious URL Scanner */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
        <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-sky-400" />
          Suspicious URL / Phishing Checker
        </h3>

        <div className="flex gap-2">
          <input
            type="url"
            value={urlToCheck}
            onChange={(e) => setUrlToCheck(e.target.value)}
            placeholder="Paste suspicious website, shortened link, or form URL..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            onClick={checkUrl}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold"
          >
            Scan
          </button>
        </div>

        {urlResult && (
          <div className={`p-3 rounded-xl border text-xs ${
            urlResult.isSafe
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/50 border-rose-800 text-rose-200'
          }`}>
            <p className="font-semibold">{urlResult.isSafe ? 'Low Risk Flag' : 'Potential Phishing Threat'}</p>
            <p className="text-[11px] mt-0.5 opacity-90">{urlResult.note}</p>
          </div>
        )}
      </div>

      {/* Device Privacy Checklist */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
        <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          Personal Device Privacy Audit
        </h3>

        <div className="space-y-2">
          {[
            { key: 'twoFactor' as const, label: 'Two-Factor Authentication (2FA) enabled on WhatsApp & Gmail via Authenticator app' },
            { key: 'socialPrivate' as const, label: 'Instagram and Facebook accounts set to private with tagged photo approvals enabled' },
            { key: 'locationPermissions' as const, label: 'Revoke background location permissions from unused third-party ride or food apps' },
            { key: 'unknownDevices' as const, label: 'Check WhatsApp Web & Telegram linked devices list and log out of all unknown sessions' },
            { key: 'googleActivityReview' as const, label: 'Review Google Account Timeline / Location Sharing to ensure no unauthorized sharing' },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => toggleCheck(item.key)}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer select-none hover:border-slate-700"
            >
              <input
                type="checkbox"
                checked={checklist[item.key]}
                onChange={() => {}}
                className="mt-0.5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
              />
              <span className={`text-xs ${checklist[item.key] ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
