import React, { useState } from 'react';
import { X, Copy, Check, Smartphone, ShieldAlert, Code2, CheckCircle2 } from 'lucide-react';

interface AndroidApkCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForceEnable: () => void;
}

export const AndroidApkCameraModal: React.FC<AndroidApkCameraModalProps> = ({
  isOpen,
  onClose,
  onForceEnable,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const manifestCode = `<!-- Add to AndroidManifest.xml inside <manifest> -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />`;

  const webChromeClientJava = `// In MainActivity.java inside onCreate():
webView.getSettings().setJavaScriptEnabled(true);
webView.getSettings().setMediaPlaybackRequiresUserGesture(false);

webView.setWebChromeClient(new WebChromeClient() {
    @Override
    public void onPermissionRequest(final PermissionRequest request) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                request.grant(request.getResources());
            }
        });
    }
});`;

  const webChromeClientKotlin = `// In MainActivity.kt inside onCreate():
webView.settings.javaScriptEnabled = true
webView.settings.mediaPlaybackRequiresUserGesture = false

webView.webChromeClient = object : WebChromeClient() {
    override fun onPermissionRequest(request: PermissionRequest) {
        runOnUiThread {
            request.grant(request.resources)
        }
    }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="soft-card w-full max-w-lg p-5 space-y-4 bg-[var(--surface)] border border-[var(--line)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="card-title text-[17px]">Android APK Camera Fix</h3>
              <p className="text-caption text-[12px]">
                Why cameras fail in Web-to-APK wrappers and how to fix it
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--muted)] hover:text-[var(--text)] transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Why it happens */}
        <div className="p-3.5 rounded-[12px] bg-amber-500/10 border border-amber-500/20 text-[12px] space-y-1.5 text-[var(--text)]">
          <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Why Android WebViews block camera by default</span>
          </div>
          <p className="leading-relaxed text-[var(--muted)]">
            By default in Android OS, the internal <code className="text-xs bg-black/10 px-1 py-0.5 rounded font-mono">WebView</code> rejects web <code className="text-xs bg-black/10 px-1 py-0.5 rounded font-mono">getUserMedia</code> requests unless the APK overrides <code className="text-xs bg-black/10 px-1 py-0.5 rounded font-mono">onPermissionRequest</code> in its <code className="text-xs bg-black/10 px-1 py-0.5 rounded font-mono">WebChromeClient</code>.
          </p>
        </div>

        {/* Step 1: Phone Settings (Immediate fix) */}
        <div className="p-3.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] block">
            Immediate Fix (On Your Phone)
          </span>
          <p className="text-[12px] text-[var(--text)] leading-relaxed">
            1. Open Android <strong>Settings &gt; Apps &gt; Abhaya &gt; Permissions</strong>.
            <br />
            2. Tap <strong>Camera</strong> &gt; Select <strong>Allow only while using the app</strong>.
            <br />
            3. Then tap the button below to enable camera capture inside Abhaya:
          </p>
          <button
            onClick={() => {
              onForceEnable();
              onClose();
            }}
            className="w-full mt-2 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-semibold text-[12px] flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            I Granted It In Phone Settings • Activate Camera
          </button>
        </div>

        {/* Step 2: Android Studio / APK Source Fixes */}
        <div className="space-y-3 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] block">
            APK Developer Code Fixes (If Building APK)
          </span>

          {/* Snippet 1: AndroidManifest */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[var(--text)] flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                1. AndroidManifest.xml
              </span>
              <button
                onClick={() => copyCode(manifestCode, 1)}
                className="text-[11px] text-[var(--primary)] flex items-center gap-1 hover:underline cursor-pointer"
              >
                {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedIndex === 1 ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-2.5 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-[10.5px] overflow-x-auto leading-relaxed">
              {manifestCode}
            </pre>
          </div>

          {/* Snippet 2: WebChromeClient (Kotlin / Java) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[var(--text)] flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                2. MainActivity (WebChromeClient onPermissionRequest)
              </span>
              <button
                onClick={() => copyCode(webChromeClientKotlin, 2)}
                className="text-[11px] text-[var(--primary)] flex items-center gap-1 hover:underline cursor-pointer"
              >
                {copiedIndex === 2 ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedIndex === 2 ? 'Copied Kotlin' : 'Copy Kotlin'}
              </button>
            </div>
            <pre className="p-2.5 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-[10.5px] overflow-x-auto leading-relaxed">
              {webChromeClientKotlin}
            </pre>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="soft-btn soft-btn-secondary text-[12px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
