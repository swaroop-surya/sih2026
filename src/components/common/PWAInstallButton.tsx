import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, Check } from 'lucide-react';
import { MobileDownloadModal } from './MobileDownloadModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'card' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstalled, isInstallable, install } = usePWAInstall();
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // If already running in standalone mode (installed as PWA)
  if (isInstalled) {
    if (variant === 'card') {
      return (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 p-3.5 text-xs text-emerald-300 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="font-bold text-white">App Downloaded & Active</p>
            <p className="text-[11px] text-emerald-400/90">Running in standalone app mode with full offline vault capability</p>
          </div>
        </div>
      );
    }
    return null;
  }

  const handleClick = async () => {
    // If native prompt is available right here, try triggering it first
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowDownloadModal(true);
      }
    } else {
      setShowDownloadModal(true);
    }
  };

  return (
    <>
      {variant === 'header' ? (
        <button
          id="btn-pwa-download-header"
          onClick={handleClick}
          className="flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 active:scale-95 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition"
          title="Download & Install Aegis on your mobile device"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Get on Mobile</span>
          <span className="sm:hidden">Install</span>
        </button>
      ) : variant === 'banner' ? (
        <div
          onClick={() => setShowDownloadModal(true)}
          className="cursor-pointer rounded-2xl bg-gradient-to-r from-sky-900/60 via-slate-900 to-indigo-950/60 border border-sky-500/30 hover:border-sky-400/60 p-3.5 flex items-center justify-between shadow-lg transition group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-400 group-hover:scale-105 transition">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                Download Aegis to Your Phone
                <span className="bg-sky-500/30 text-sky-300 text-[10px] px-1.5 py-0.2 rounded-full font-medium">Free</span>
              </p>
              <p className="text-[11px] text-slate-300">
                Scan QR or tap to install for 1-tap SOS, offline protection & home screen icon
              </p>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow group-hover:bg-sky-500 transition">
            <Download className="w-4 h-4" />
          </div>
        </div>
      ) : (
        <button
          id="btn-pwa-install-card"
          onClick={handleClick}
          className="w-full flex items-center justify-between rounded-2xl bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 p-4 text-xs font-bold text-white shadow-xl transition active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Download Aegis to Mobile</p>
              <p className="text-[11px] font-normal text-sky-100">
                Scan QR code or install directly for 1-tap lockscreen SOS & offline safety
              </p>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-white/20">
            <Download className="w-4 h-4 text-white" />
          </div>
        </button>
      )}

      <MobileDownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </>
  );
};
