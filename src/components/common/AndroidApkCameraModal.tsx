import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Smartphone,
  ShieldAlert,
  Code2,
  CheckCircle2,
  MapPin,
  Camera,
  Layers,
  Settings2
} from 'lucide-react';

export interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForceEnableCamera?: () => void;
  onForceEnableLocation?: () => void;
  initialTab?: 'all' | 'camera' | 'location';
}

export const AndroidApkCameraModal: React.FC<AndroidApkModalProps> = ({
  isOpen,
  onClose,
  onForceEnableCamera,
  onForceEnableLocation,
  initialTab = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'phone' | 'manifest' | 'java' | 'kotlin'>('phone');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const manifestCombinedCode = `<!-- 1. Add inside <manifest> in AndroidManifest.xml -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
<uses-feature android:name="android.hardware.location.gps" android:required="false" />`;

  const webViewJavaCode = `// In MainActivity.java inside onCreate():
WebSettings settings = webView.getSettings();
settings.setJavaScriptEnabled(true);
settings.setDomStorageEnabled(true);
settings.setMediaPlaybackRequiresUserGesture(false);

// Enable Geolocation in WebSettings:
settings.setGeolocationEnabled(true);
settings.setGeolocationDatabasePath(getFilesDir().getPath());

// WebChromeClient handling BOTH Camera and Location:
webView.setWebChromeClient(new WebChromeClient() {
    // 1. Grant Camera & Mic permissions to WebView
    @Override
    public void onPermissionRequest(final PermissionRequest request) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                request.grant(request.getResources());
            }
        });
    }

    // 2. Grant Geolocation / GPS permissions to WebView
    @Override
    public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
        callback.invoke(origin, true, false);
    }
});

// Request Android Native OS permissions on app launch (Android 6.0+):
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
    requestPermissions(new String[]{
        Manifest.permission.CAMERA,
        Manifest.permission.ACCESS_FINE_LOCATION,
        Manifest.permission.ACCESS_COARSE_LOCATION
    }, 101);
}`;

  const webViewKotlinCode = `// In MainActivity.kt inside onCreate():
webView.settings.apply {
    javaScriptEnabled = true
    domStorageEnabled = true
    mediaPlaybackRequiresUserGesture = false
    setGeolocationEnabled(true)
    setGeolocationDatabasePath(filesDir.path)
}

// WebChromeClient handling BOTH Camera and Location:
webView.webChromeClient = object : WebChromeClient() {
    // 1. Camera & Mic
    override fun onPermissionRequest(request: PermissionRequest) {
        runOnUiThread {
            request.grant(request.resources)
        }
    }

    // 2. Geolocation / GPS
    override fun onGeolocationPermissionsShowPrompt(origin: String, callback: GeolocationPermissions.Callback) {
        callback.invoke(origin, true, false)
    }
}

// Request Android Native OS permissions on launch:
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
    requestPermissions(arrayOf(
        Manifest.permission.CAMERA,
        Manifest.permission.ACCESS_FINE_LOCATION,
        Manifest.permission.ACCESS_COARSE_LOCATION
    ), 101)
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3.5 sm:p-4 overflow-y-auto">
      <div className="soft-card w-full max-w-lg p-5 space-y-4 bg-[var(--surface)] border border-[var(--line)] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-2 border-b border-[var(--line)]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="card-title text-[16px] sm:text-[17px]">Android APK Permissions Fix</h3>
              <p className="text-caption text-[12px]">
                Resolve Camera &amp; Location access in Android WebViews &amp; APKs
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

        {/* Root Cause Banner */}
        <div className="p-3.5 rounded-[12px] bg-amber-500/10 border border-amber-500/25 text-[12px] space-y-1 text-[var(--text)]">
          <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Why both Camera and Location were blocked</span>
          </div>
          <p className="leading-relaxed text-[var(--muted)]">
            In Android Web-to-APK wrappers, Android treats the inner web app separately from the native app.
            Even if you click Allow on the web page, Android rejects it unless <strong>both</strong> phone OS permissions
            and <code className="text-[11px] bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded font-mono">WebChromeClient</code> callbacks are configured.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('phone')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'phone'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Phone Settings (Instant)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manifest')}
            className={`py-1.5 px-2.5 rounded-lg font-medium transition cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'manifest'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Manifest</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('java')}
            className={`py-1.5 px-2.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'java'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            Java
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kotlin')}
            className={`py-1.5 px-2.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'kotlin'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            Kotlin
          </button>
        </div>

        {/* TAB 1: PHONE SETTINGS IMMEDIATE STEPS */}
        {activeTab === 'phone' && (
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] space-y-2.5 text-[12px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] block">
                Step 1: Enable in Android OS App Settings
              </span>
              <ol className="list-decimal pl-4 space-y-1.5 text-[var(--text)] leading-relaxed">
                <li>
                  Open your phone&apos;s <strong>Settings</strong> app.
                </li>
                <li>
                  Go to <strong>Apps</strong> (or <em>Application Manager</em>) &gt; Tap on your app (<strong>Abhaya</strong>).
                </li>
                <li>
                  Tap on <strong>Permissions</strong>.
                </li>
                <li>
                  Select <strong>Camera</strong> &rarr; Choose <strong>Allow only while using the app</strong>.
                </li>
                <li>
                  Select <strong>Location</strong> &rarr; Choose <strong>Allow only while using the app</strong> (ensure <em>Use precise location</em> is enabled).
                </li>
              </ol>
            </div>

            <div className="p-3.5 rounded-[12px] bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-[12px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                Step 2: Activate Inside Abhaya
              </span>
              <p className="text-[var(--muted)] leading-relaxed">
                After granting them in phone settings, tap below to verify and force-activate the permissions inside Abhaya so they never fail:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {onForceEnableCamera && (
                  <button
                    type="button"
                    onClick={() => {
                      onForceEnableCamera();
                      onClose();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-semibold text-[12px] flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Activate Camera
                  </button>
                )}
                {onForceEnableLocation && (
                  <button
                    type="button"
                    onClick={() => {
                      onForceEnableLocation();
                      onClose();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-[var(--primary)] text-white dark:text-[#1A1F45] font-semibold text-[12px] flex items-center justify-center gap-1.5 hover:opacity-95 transition cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Activate Location
                  </button>
                )}
              </div>

              {onForceEnableCamera && onForceEnableLocation && (
                <button
                  type="button"
                  onClick={() => {
                    onForceEnableCamera();
                    onForceEnableLocation();
                    onClose();
                  }}
                  className="w-full mt-1 py-2 px-3 rounded-xl bg-[var(--surface)] text-[var(--text)] border border-[var(--line)] font-semibold text-[11px] flex items-center justify-center gap-1.5 hover:bg-[var(--surface-2)] transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Activate Both Camera &amp; Location
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ANDROID MANIFEST */}
        {activeTab === 'manifest' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[var(--text)]">AndroidManifest.xml</span>
              <button
                type="button"
                onClick={() => copyCode(manifestCombinedCode, 1)}
                className="text-[11px] text-[var(--primary)] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedIndex === 1 ? 'Copied' : 'Copy Snippet'}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-[10.5px] overflow-x-auto leading-relaxed border border-zinc-800">
              {manifestCombinedCode}
            </pre>
          </div>
        )}

        {/* TAB 3: JAVA CODE */}
        {activeTab === 'java' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[var(--text)]">MainActivity.java (Camera + Location)</span>
              <button
                type="button"
                onClick={() => copyCode(webViewJavaCode, 2)}
                className="text-[11px] text-[var(--primary)] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                {copiedIndex === 2 ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedIndex === 2 ? 'Copied' : 'Copy Java'}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-[10.5px] overflow-x-auto leading-relaxed border border-zinc-800 max-h-[38vh]">
              {webViewJavaCode}
            </pre>
          </div>
        )}

        {/* TAB 4: KOTLIN CODE */}
        {activeTab === 'kotlin' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[var(--text)]">MainActivity.kt (Camera + Location)</span>
              <button
                type="button"
                onClick={() => copyCode(webViewKotlinCode, 3)}
                className="text-[11px] text-[var(--primary)] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                {copiedIndex === 3 ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedIndex === 3 ? 'Copied' : 'Copy Kotlin'}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-[10.5px] overflow-x-auto leading-relaxed border border-zinc-800 max-h-[38vh]">
              {webViewKotlinCode}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-[var(--line)]">
          <span className="text-[11px] text-[var(--muted)]">
            Works on Android 6.0 through Android 15
          </span>
          <button
            type="button"
            onClick={onClose}
            className="soft-btn soft-btn-secondary text-[12px] h-8 px-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
