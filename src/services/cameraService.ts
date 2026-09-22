/**
 * Abhaya Silent Camera Service
 *
 * Provides early permission acquisition and silent, non-blocking photo capture
 * during the emergency alert pipeline.
 *
 * Strictly adheres to:
 * - Early permission only (never prompt getUserMedia for the first time inside SOS)
 * - Silent and invisible in all modes (no shutter sound, no preview, no flash, no viewfinder)
 * - Fast 2.5s hard timeout per camera (back then front)
 * - Immediate track teardown upon frame grab
 * - Synthetic realistic placeholder stills for Demo mode
 */

export interface CapturedStill {
  blob: Blob;
  fileName: string;
  facing: 'back' | 'front';
  description: string;
}

export interface CameraPermissionResult {
  granted: boolean;
  message: string;
  errorType?: 'NotAllowedError' | 'SecurityError' | 'NotFoundError' | 'NotSupportedError' | 'WebViewRestricted' | 'InsecureContext' | 'Unknown';
  isSecureContext: boolean;
  hasMediaDevices: boolean;
}

const STORAGE_CAMERA_PERM_KEY = 'abhaya_camera_permission_granted';

/**
 * Checks whether camera permission was previously granted explicitly by the user
 */
export function isCameraPermissionGranted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_CAMERA_PERM_KEY) === 'true';
}

/**
 * Allows manual override for users whose Android APK has native permissions granted
 * in Android OS Settings.
 */
export function setManualCameraPermission(granted: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_CAMERA_PERM_KEY, granted ? 'true' : 'false');
}

/**
 * Requests camera permission early from settings/onboarding row.
 * Includes full Android WebView / Capacitor / APK wrapper compatibility checks.
 * Never called for the first time during emergency trigger.
 */
export async function requestCameraPermissionEarly(): Promise<CameraPermissionResult> {
  const isSecure =
    typeof window !== 'undefined'
      ? (window.isSecureContext ?? (window.location.protocol === 'https:' || window.location.hostname === 'localhost'))
      : false;

  const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
  const getUserMediaFn =
    nav?.mediaDevices?.getUserMedia?.bind(nav.mediaDevices) ||
    nav?.getUserMedia?.bind(nav) ||
    nav?.webkitGetUserMedia?.bind(nav) ||
    nav?.mozGetUserMedia?.bind(nav);

  if (!getUserMediaFn) {
    localStorage.setItem(STORAGE_CAMERA_PERM_KEY, 'false');
    return {
      granted: false,
      message: 'Camera API (WebRTC) is disabled in this Android WebView. Ensure your APK overrides WebChromeClient.onPermissionRequest.',
      errorType: 'WebViewRestricted',
      isSecureContext: isSecure,
      hasMediaDevices: false,
    };
  }

  // Progressive constraint fallback list
  const constraintOptions: MediaStreamConstraints[] = [
    { video: { facingMode: 'environment' }, audio: false },
    { video: true, audio: false },
    { video: { facingMode: 'user' }, audio: false },
    { video: {}, audio: false },
  ];

  let lastError: any = null;

  for (const constraints of constraintOptions) {
    try {
      let streamPromise: Promise<MediaStream>;
      if (nav?.mediaDevices?.getUserMedia) {
        streamPromise = nav.mediaDevices.getUserMedia(constraints);
      } else {
        streamPromise = new Promise((resolve, reject) => {
          getUserMediaFn(constraints, resolve, reject);
        });
      }

      const stream = await streamPromise;
      if (stream) {
        // Immediately stop all tracks to release camera hardware
        stream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {
            // ignore
          }
        });
        localStorage.setItem(STORAGE_CAMERA_PERM_KEY, 'true');
        return {
          granted: true,
          message: 'Camera access allowed successfully.',
          isSecureContext: isSecure,
          hasMediaDevices: true,
        };
      }
    } catch (err: any) {
      lastError = err;
      const name = err?.name || '';
      // If user/OS explicitly denied permission, avoid redundant popups
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        break;
      }
    }
  }

  const errName = lastError?.name || '';
  let errorType: CameraPermissionResult['errorType'] = 'Unknown';
  let userMessage = 'Camera permission could not be acquired.';

  if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
    errorType = 'NotAllowedError';
    userMessage = 'Permission blocked by Android. Open Phone Settings > Apps > Abhaya > Permissions > Camera > Allow, then tap "Verify & Force Enable".';
  } else if (errName === 'SecurityError') {
    errorType = 'SecurityError';
    userMessage = 'Security restriction: Camera requires HTTPS or a secure origin in Android WebView.';
  } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
    errorType = 'NotFoundError';
    userMessage = 'No camera device detected by Android WebView.';
  } else if (!isSecure) {
    errorType = 'InsecureContext';
    userMessage = 'Insecure context: Android WebView requires HTTPS or secure scheme to grant camera.';
  } else {
    userMessage = `Camera error (${errName || 'Denied'}). Android WebView requires WebChromeClient.onPermissionRequest.`;
  }

  localStorage.setItem(STORAGE_CAMERA_PERM_KEY, 'false');
  return {
    granted: false,
    message: userMessage,
    errorType,
    isSecureContext: isSecure,
    hasMediaDevices: !!nav?.mediaDevices,
  };
}

/**
 * Creates synthetic demo photo blobs clearly labeled 'Sample photo'
 * for demo scenarios and offline judge evaluations.
 */
function createDemoPhotoBlob(facing: 'back' | 'front', timestampStr: string): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(new Blob(['demo-photo'], { type: 'image/jpeg' }));
      return;
    }

    // Gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 1280, 720);
    if (facing === 'back') {
      bgGradient.addColorStop(0, '#111827');
      bgGradient.addColorStop(1, '#1F2937');
    } else {
      bgGradient.addColorStop(0, '#0F172A');
      bgGradient.addColorStop(1, '#334155');
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1280, 720);

    // Subtle grid overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 40; x < 1280; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 720);
      ctx.stroke();
    }
    for (let y = 40; y < 720; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1280, y);
      ctx.stroke();
    }

    // Top Banner Badge
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.fillRect(60, 50, 460, 48);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.strokeRect(60, 50, 460, 48);

    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('EMERGENCY SOS EVIDENCE CAPTURE', 80, 82);

    // Main Sample Photo Watermark Stamp
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('SAMPLE PHOTO', 80, 170);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const cameraLabel = facing === 'back' ? 'Environment (Rear-Facing Lens)' : 'User (Front-Facing Lens)';
    ctx.fillText(`Camera: ${cameraLabel}`, 80, 210);

    // Timestamp & Geolocation details
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '16px monospace';
    ctx.fillText(`Timestamp: ${timestampStr}`, 80, 270);
    ctx.fillText('Resolution: 1280 × 720 px • Quality: 85% JPEG', 80, 300);
    ctx.fillText('Status: Encrypted & SHA-256 Fingerprinted in Local Vault', 80, 330);
    ctx.fillText('Privacy: Strictly Local • Not Dispatched over SMS', 80, 360);

    // Corner targeting reticles
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    // Top-right
    ctx.beginPath();
    ctx.moveTo(1180, 60);
    ctx.lineTo(1220, 60);
    ctx.lineTo(1220, 100);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(1220, 620);
    ctx.lineTo(1220, 660);
    ctx.lineTo(1180, 660);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(60, 620);
    ctx.lineTo(60, 660);
    ctx.lineTo(100, 660);
    ctx.stroke();

    // Bottom verification footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '14px sans-serif';
    ctx.fillText('Abhaya Women Safety & Forensic Evidence Preservation Pipeline', 80, 650);

    canvas.toBlob((blob) => {
      resolve(blob || new Blob(['sample-photo'], { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.85);
  });
}

/**
 * Quietly captures a single frame from the specified camera facing mode
 * onto an offscreen canvas. Strict 2.5s hard timeout.
 */
async function captureSingleStill(
  facingMode: 'environment' | 'user',
  timeoutMs: number = 2500
): Promise<Blob | null> {
  const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
  const getUserMediaFn =
    nav?.mediaDevices?.getUserMedia?.bind(nav.mediaDevices) ||
    nav?.getUserMedia?.bind(nav) ||
    nav?.webkitGetUserMedia?.bind(nav);

  if (!getUserMediaFn) {
    return null;
  }

  let stream: MediaStream | null = null;
  let video: HTMLVideoElement | null = null;

  const constraintOptions: MediaStreamConstraints[] = [
    {
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    },
    {
      video: { facingMode: facingMode },
      audio: false,
    },
    {
      video: true,
      audio: false,
    },
  ];

  try {
    for (const constraints of constraintOptions) {
      try {
        const streamPromise: Promise<MediaStream> = nav?.mediaDevices?.getUserMedia
          ? nav.mediaDevices.getUserMedia(constraints)
          : new Promise((resolve, reject) => getUserMediaFn(constraints, resolve, reject));

        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), timeoutMs)
        );

        stream = await Promise.race([streamPromise, timeoutPromise]);
        if (stream) break;
      } catch {
        // try next simpler constraint option
      }
    }

    if (!stream) {
      return null;
    }

    video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute('muted', 'true');
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.style.position = 'fixed';
    video.style.top = '-9999px';
    video.style.left = '-9999px';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';
    video.srcObject = stream;

    // Wait for video frame to be available with timeout
    await new Promise<void>((resolve) => {
      const timer = setTimeout(() => resolve(), timeoutMs);
      const onReady = () => {
        video!
          .play()
          .then(() => {
            clearTimeout(timer);
            resolve();
          })
          .catch(() => {
            clearTimeout(timer);
            resolve();
          });
      };
      video!.onloadeddata = onReady;
      video!.onloadedmetadata = onReady;
      video!.onerror = () => {
        clearTimeout(timer);
        resolve();
      };
    });

    const width = video.videoWidth > 0 ? video.videoWidth : 1280;
    const height = video.videoHeight > 0 ? video.videoHeight : 720;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85);
    });

    return blob;
  } catch (err) {
    console.warn(`[CameraService] Capture frame failed for ${facingMode}:`, err);
    return null;
  } finally {
    // CRITICAL: Immediately stop all tracks to release hardware and turn off green indicator
    if (stream) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
    }
    if (video) {
      try {
        video.srcObject = null;
        video.remove();
      } catch {
        // ignore
      }
    }
  }
}

/**
 * Main Silent SOS Photo Capture Pipeline
 *
 * Fires asynchronously when SOS alert is triggered.
 * - Checks master toggle and early permission
 * - Never prompts userMedia for the first time during SOS
 * - Captures up to 2 stills: back camera first, then front camera
 * - Hard 2.5s timeout per camera
 * - Swallows all errors silently from user perspective
 */
export async function captureSOSPhotos(options: {
  isDemo?: boolean;
  masterSwitchEnabled?: boolean;
  alertId: string;
  timestamp: string;
}): Promise<CapturedStill[]> {
  const { isDemo = false, masterSwitchEnabled = true, alertId, timestamp } = options;

  // Master opt-out check
  if (!masterSwitchEnabled) {
    return [];
  }

  // DEMO MODE: Generate 2 synthetic placeholder images labeled 'Sample photo'
  if (isDemo) {
    try {
      const [backBlob, frontBlob] = await Promise.all([
        createDemoPhotoBlob('back', timestamp),
        createDemoPhotoBlob('front', timestamp),
      ]);

      return [
        {
          blob: backBlob,
          fileName: `sos_photo_back_${Date.now()}.jpg`,
          facing: 'back',
          description: `Sample photo • Rear environment view linked to alert ${alertId.slice(-6)}`
        },
        {
          blob: frontBlob,
          fileName: `sos_photo_front_${Date.now() + 1}.jpg`,
          facing: 'front',
          description: `Sample photo • Front user view linked to alert ${alertId.slice(-6)}`
        }
      ];
    } catch (demoErr) {
      console.warn('[CameraService] Demo photo creation error:', demoErr);
      return [];
    }
  }

  // REAL MODE: Strict permission check. Never call getUserMedia for the first time inside SOS!
  if (!isCameraPermissionGranted()) {
    return [];
  }

  const results: CapturedStill[] = [];

  try {
    // 1. Back camera first
    const backStill = await captureSingleStill('environment', 2500);
    if (backStill) {
      results.push({
        blob: backStill,
        fileName: `sos_photo_back_${Date.now()}.jpg`,
        facing: 'back',
        description: `Silent SOS capture (Back camera) • Alert ${alertId.slice(-6)}`
      });
    }

    // 2. Front camera second
    const frontStill = await captureSingleStill('user', 2500);
    if (frontStill) {
      results.push({
        blob: frontStill,
        fileName: `sos_photo_front_${Date.now()}.jpg`,
        facing: 'front',
        description: `Silent SOS capture (Front camera) • Alert ${alertId.slice(-6)}`
      });
    }
  } catch (err) {
    // Swallow error silently from user; SOS must never fail
    console.warn('[CameraService] Unexpected error during silent SOS capture:', err);
  }

  return results;
}
