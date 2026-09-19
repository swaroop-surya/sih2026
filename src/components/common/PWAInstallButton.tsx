import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone } from 'lucide-react';
import { MobileDownloadModal } from './MobileDownloadModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'card';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { isInstallable, isInstalled, install, isInIframe } = usePWAInstall();
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // If already installed and running standalone, don't show the prompt
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    // If running in an iframe or on iOS/desktop without direct prompt, opening modal with QR & guides is best
    if (isInIframe || !isInstallable) {
      setShowDownloadModal(true);
      return;
    }

    // Direct native browser prompt
    const outcome = await install();
    if (!outcome) {
      setShowDownloadModal(true);
    }
  };

  return (
    <>
      {variant === 'header' ? (
        <button
          id="btn-pwa-download-header"
          onClick={handleClick}
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] hover:bg-[var(--surface)] transition-all active:scale-95 shrink-0 ${className}`}
          title="Install Abhaya on your phone"
          aria-label="Install Abhaya"
        >
          <Download className="w-3.5 h-3.5 stroke-[1.75]" />
        </button>
      ) : variant === 'banner' ? (
        <div
          id="banner-pwa-mobile"
          onClick={() => setShowDownloadModal(true)}
          className={`cursor-pointer rounded-[12px] p-3.5 flex items-center justify-between transition bg-[var(--surface)] border border-[var(--line)] hover:bg-[var(--surface-2)]/50 active:scale-[0.99] ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] shrink-0">
              <Smartphone className="w-4 h-4 stroke-[1.75]" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[var(--text)] flex items-center gap-1.5">
                Download Abhaya to phone
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]">
                  Free
                </span>
              </p>
              <p className="text-caption text-[11px] mt-0.5">
                Scan QR or tap to install for 1-tap SOS & offline vault
              </p>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] shrink-0 ml-2">
            <Download className="w-3.5 h-3.5 stroke-[1.75]" />
          </div>
        </div>
      ) : (
        <button
          id="btn-pwa-install-card"
          onClick={handleClick}
          className={`w-full flex items-center justify-between rounded-[12px] bg-[var(--surface)] border border-[var(--line)] hover:bg-[var(--surface-2)]/50 p-3.5 text-[13px] font-medium text-[var(--text)] transition active:scale-[0.98] ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)]">
              <Smartphone className="w-4 h-4 stroke-[1.75]" />
            </div>
            <div className="text-left">
              <p className="text-[14px] font-medium text-[var(--text)]">Download Abhaya to phone</p>
              <p className="text-caption text-[11px]">
                Scan QR or install for instant SOS access & offline protection
              </p>
            </div>
          </div>
          <div className="p-2 rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)]">
            <Download className="w-3.5 h-3.5 stroke-[1.75]" />
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
