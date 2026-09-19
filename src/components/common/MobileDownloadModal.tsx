import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  Smartphone,
  Download,
  Share2,
  X,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Apple
} from 'lucide-react';
import { AbhayaLogo } from './AbhayaLogo';

interface MobileDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDownloadModal: React.FC<MobileDownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, install, isInIframe } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'android' | 'ios'>('scan');

  // Generate clean current URL (removing iframe / AI studio wrappers if accessible)
  const appUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  // Using QR code service to generate instantaneous QR code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    appUrl
  )}&bgcolor=FFFFFF&color=151A3F&margin=1`;

  // Auto-detect mobile OS to pre-select helpful tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        setActiveTab('ios');
      } else if (/android/.test(ua)) {
        setActiveTab('android');
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = appUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Abhaya Safety App',
          text: 'Install Abhaya on your mobile device:',
          url: appUrl,
        });
      } catch (e) {
        console.log('Share canceled or failed', e);
      }
    } else {
      handleCopyLink();
    }
  };

  const openWhatsAppShare = () => {
    const text = encodeURIComponent(`Install Abhaya on your phone: ${appUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDirectInstall = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        onClose();
      }
    } else if (isInIframe) {
      window.open(appUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[16px] border border-[var(--line)] bg-[var(--surface)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-2.5">
            <AbhayaLogo size={24} />
            <div>
              <h3 className="text-[15px] font-medium text-[var(--text)]">Install Abhaya</h3>
              <p className="text-caption text-[11px]">Install as a standalone app on your phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[var(--muted)] hover:text-[var(--text)] transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[1.75]" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 border-b border-[var(--line)] bg-[var(--surface-2)] text-[12px] font-medium">
          <button
            onClick={() => setActiveTab('scan')}
            className={`py-2.5 transition border-b-2 cursor-pointer ${
              activeTab === 'scan'
                ? 'border-[var(--primary)] text-[var(--text)] font-semibold'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            Scan QR
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`py-2.5 transition border-b-2 cursor-pointer ${
              activeTab === 'android'
                ? 'border-[var(--primary)] text-[var(--text)] font-semibold'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            Android
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`py-2.5 transition border-b-2 cursor-pointer ${
              activeTab === 'ios'
                ? 'border-[var(--primary)] text-[var(--text)] font-semibold'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            iPhone
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* TAB 1: SCAN QR CODE */}
          {activeTab === 'scan' && (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-fit p-3 bg-white rounded-[12px] border border-[var(--line)]">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Scan QR code to install Abhaya on mobile"
                    className="w-44 h-44 mx-auto rounded-[8px]"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-[var(--muted)] text-xs">
                    Generating QR code...
                  </div>
                )}
              </div>

              <div>
                <p className="font-medium text-[var(--text)] text-[14px]">Scan with phone camera</p>
                <p className="text-caption text-[12px] mt-1 max-w-xs mx-auto">
                  Open your camera app on iPhone or Android, scan the code, and tap to open Abhaya.
                </p>
              </div>

              {/* Direct Link Share options */}
              <div className="space-y-2 pt-2 border-t border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    className="soft-input flex-1 text-[11px] font-mono truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="soft-btn soft-btn-secondary text-[12px] shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--safe)] stroke-[1.75]" />
                        <span className="text-[var(--safe)]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 stroke-[1.75]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={openWhatsAppShare}
                    className="soft-btn soft-btn-secondary text-[12px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 mr-1 stroke-[1.75]" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={handleNativeShare}
                    className="soft-btn soft-btn-secondary text-[12px]"
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1 stroke-[1.75]" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANDROID INSTALLATION GUIDE */}
          {activeTab === 'android' && (
            <div className="space-y-3.5">
              {isInstallable && (
                <div className="bg-[var(--surface-2)] border border-[var(--line)] p-3.5 rounded-[12px]">
                  <p className="font-medium text-[var(--text)] text-[13px] mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 stroke-[1.75]" />
                    One-Tap Install Ready
                  </p>
                  <p className="text-caption text-[12px] mb-3">
                    Your browser can install Abhaya directly to your home screen.
                  </p>
                  <button
                    onClick={handleDirectInstall}
                    className="soft-btn soft-btn-primary w-full text-[13px]"
                  >
                    <Download className="w-4 h-4 mr-1.5 stroke-[1.75]" />
                    <span>Install Abhaya now</span>
                  </button>
                </div>
              )}

              <div className="p-4 rounded-[12px] bg-[var(--surface-2)] space-y-2.5">
                <h4 className="font-medium text-[var(--text)] text-[13px]">
                  Step-by-Step Android (Chrome) Setup:
                </h4>
                <div className="space-y-2 text-[12px] text-[var(--muted)]">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-[var(--text)]">1.</span>
                    <span>Open <strong>Google Chrome</strong> on your phone and open the link.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-[var(--text)]">2.</span>
                    <span>Tap the <strong>three dots (⋮)</strong> menu in Chrome.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-[var(--text)]">3.</span>
                    <span>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</span>
                  </div>
                </div>
              </div>

              {isInIframe && (
                <button
                  onClick={() => window.open(appUrl, '_blank')}
                  className="soft-btn soft-btn-secondary w-full text-[12px]"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1 stroke-[1.75]" />
                  <span>Open in new window</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 3: APPLE IOS */}
          {activeTab === 'ios' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-[12px] bg-[var(--surface-2)] space-y-2.5">
                <h4 className="font-medium text-[var(--text)] text-[13px] flex items-center gap-1.5">
                  <Apple className="w-4 h-4 stroke-[1.75]" />
                  Step-by-Step iPhone (Safari) Setup:
                </h4>
                <div className="space-y-2 text-[12px] text-[var(--muted)]">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-[var(--text)]">1.</span>
                    <span>Open this link in <strong>Safari</strong> on your iPhone.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-[var(--text)]">2.</span>
                    <span>Tap the <strong>Share</strong> button in Safari's bottom toolbar.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-[var(--text)]">3.</span>
                    <span>Scroll and tap <strong>Add to Home Screen</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-[var(--text)]">4.</span>
                    <span>Tap <strong>Add</strong>. Abhaya will appear on your home screen.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
