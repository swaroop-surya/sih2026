import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  QrCode,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  X,
  Apple,
  MessageCircle,
  Shield,
  Send
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface MobileDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDownloadModal: React.FC<MobileDownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isInIframe, install } = usePWAInstall();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'ios' | 'android'>('scan');

  // Determine the best public URL for this application
  const getAppUrl = () => {
    if (typeof window === 'undefined') return '';
    // If in iframe or top window, use the canonical URL
    const url = window.location.href;
    return url;
  };

  const appUrl = getAppUrl();

  useEffect(() => {
    if (appUrl) {
      QRCode.toDataURL(appUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: '#020617',
          light: '#ffffff'
        }
      })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('Error generating QR code:', err));
    }
  }, [appUrl]);

  // Set default tab based on detected platform
  useEffect(() => {
    if (isIOS) {
      setActiveTab('ios');
    } else if (isAndroid) {
      setActiveTab('android');
    }
  }, [isIOS, isAndroid]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback prompt if clipboard API is restricted in iframe
      window.prompt('Copy this link to open on your mobile phone:', appUrl);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Aegis Women Safety App',
          text: 'Download and install Aegis Women Safety App on your mobile device:',
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
    const text = encodeURIComponent(`Install Aegis Women Safety App on your phone: ${appUrl}`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-400">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Download Aegis to Mobile</h3>
              <p className="text-[11px] text-slate-400">Install as a standalone native app</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-slate-950 border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition ${
              activeTab === 'scan'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition ${
              activeTab === 'android'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition ${
              activeTab === 'ios'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iPhone / iOS</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: SCAN QR CODE (Easiest from desktop or laptop) */}
          {activeTab === 'scan' && (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-fit p-3 bg-white rounded-2xl shadow-xl border-4 border-sky-500/30">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Scan QR code to install Aegis on mobile"
                    className="w-44 h-44 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                    Generating QR code...
                  </div>
                )}
              </div>

              <div>
                <p className="font-bold text-white text-sm">Scan with Your Phone's Camera</p>
                <p className="text-slate-400 text-[11px] mt-1 max-w-xs mx-auto">
                  Open your camera app on iPhone or Android, scan the QR code above, and tap the link to open and install Aegis.
                </p>
              </div>

              {/* Direct Link Share options */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-[11px] text-slate-300 select-all font-mono truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-white transition shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={openWhatsAppShare}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 px-3 text-xs font-semibold text-white transition shadow"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send to WhatsApp</span>
                  </button>

                  <button
                    onClick={handleNativeShare}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 py-2 px-3 text-xs font-semibold text-white transition shadow"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share via Device</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANDROID INSTALLATION GUIDE */}
          {activeTab === 'android' && (
            <div className="space-y-3.5">
              {/* If on Android right now and installable */}
              {isInstallable && (
                <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-600/50 p-3.5 rounded-2xl">
                  <p className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    One-Tap Install Ready
                  </p>
                  <p className="text-[11px] text-slate-300 mb-3">
                    Your browser is ready to install Aegis directly to your Android home screen and app drawer.
                  </p>
                  <button
                    onClick={handleDirectInstall}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg transition active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install Aegis App Now</span>
                  </button>
                </div>
              )}

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-sky-400 text-xs flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  Step-by-Step Android (Chrome) Setup:
                </h4>
                <div className="space-y-3 text-slate-300 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">1</span>
                    <span>Open <strong>Google Chrome</strong> on your Android phone and navigate to the app link.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">2</span>
                    <span>Tap the <strong>three dots (⋮)</strong> menu in the top right corner.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">3</span>
                    <span>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">4</span>
                    <span>Tap <strong>Install</strong>. Aegis will download and appear as an app on your phone!</span>
                  </div>
                </div>
              </div>

              {isInIframe && (
                <button
                  onClick={() => window.open(appUrl, '_blank')}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-semibold text-slate-200 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Clean Window (for Native Install Banner)</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 3: APPLE IOS (IPHONE / IPAD) */}
          {activeTab === 'ios' && (
            <div className="space-y-3.5">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-sky-400 text-xs flex items-center gap-1.5">
                  <Apple className="w-4 h-4" />
                  Step-by-Step iPhone (Safari) Setup:
                </h4>
                <div className="space-y-3 text-slate-300 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">1</span>
                    <span>Open this app in <strong>Safari</strong> on your iPhone.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">2</span>
                    <span>Tap the <strong>Share</strong> button (box with an arrow pointing up ⎋) in Safari's bottom toolbar.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">3</span>
                    <span>Scroll down the share sheet and tap <strong>Add to Home Screen</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">4</span>
                    <span>Tap <strong>Add</strong> in the top right corner. The Aegis shield icon will appear on your iPhone home screen!</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-sky-950/40 border border-sky-800/40 p-3 text-[11px] text-sky-300 flex items-start gap-2">
                <Shield className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Once added to your home screen, Aegis runs full-screen without Safari browser address bars, with offline vault support.</span>
              </div>
            </div>
          )}

          {/* Benefits summary pill */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
              <p className="text-[10px] text-slate-400">Offline</p>
              <p className="font-bold text-white text-xs">Full Access</p>
            </div>
            <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
              <p className="text-[10px] text-slate-400">Home Screen</p>
              <p className="font-bold text-white text-xs">1-Tap Launch</p>
            </div>
            <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
              <p className="text-[10px] text-slate-400">Response</p>
              <p className="font-bold text-white text-xs">Instant SOS</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {isInstalled ? '● Standalone App Active' : '● Free & No App Store Needed'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
