/**
 * Abhaya Location Service
 *
 * Provides early permission acquisition, progressive accuracy fallback,
 * offline/cached location persistence, and Android WebView compatibility.
 */

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  addressText: string;
}

export interface LocationPermissionResult {
  granted: boolean;
  message: string;
  coords?: LocationCoordinates;
  errorType?:
    | 'PERMISSION_DENIED'
    | 'POSITION_UNAVAILABLE'
    | 'TIMEOUT'
    | 'NOT_SUPPORTED'
    | 'WEBVIEW_RESTRICTED'
    | 'INSECURE_CONTEXT'
    | 'UNKNOWN';
  isSecureContext: boolean;
  hasGeolocation: boolean;
}

export const STORAGE_LOCATION_PERM_KEY = 'abhaya_location_permission_granted';
export const STORAGE_CACHED_LOCATION_KEY = 'abhaya_cached_location';
export const STORAGE_CUSTOM_AREA_KEY = 'abhaya_custom_emergency_area';

// Popular Indian metropolitan reference areas for emergency fallback
export const POPULAR_SAFETY_AREAS: Array<{ name: string; city: string; lat: number; lng: number }> = [
  { name: 'Bellandur / Outer Ring Road', city: 'Bengaluru', lat: 12.9279, lng: 77.6741 },
  { name: 'Indiranagar / Metro Station', city: 'Bengaluru', lat: 12.9784, lng: 77.6408 },
  { name: 'Koramangala / Sony World', city: 'Bengaluru', lat: 12.9352, lng: 77.6245 },
  { name: 'HSR Layout / 27th Main', city: 'Bengaluru', lat: 12.9121, lng: 77.6446 },
  { name: 'Whitefield / ITPL', city: 'Bengaluru', lat: 12.9863, lng: 77.7342 },
  { name: 'Connaught Place', city: 'New Delhi', lat: 28.6304, lng: 77.2177 },
  { name: 'Hauz Khas / Metro', city: 'New Delhi', lat: 28.5494, lng: 77.2001 },
  { name: 'Bandra West / Station', city: 'Mumbai', lat: 19.0596, lng: 72.8295 },
  { name: 'Andheri East / Metro', city: 'Mumbai', lat: 19.1136, lng: 72.8697 },
  { name: 'Gachibowli / Hitec City', city: 'Hyderabad', lat: 17.4401, lng: 78.3489 },
  { name: 'T Nagar / Panagal Park', city: 'Chennai', lat: 13.0418, lng: 80.2341 },
  { name: 'Park Street', city: 'Kolkata', lat: 22.5535, lng: 88.3524 },
  { name: 'Kothrud / Karve Road', city: 'Pune', lat: 18.5074, lng: 73.8077 },
];

/**
 * Checks whether location permission was previously granted explicitly
 */
export function isLocationPermissionGranted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_LOCATION_PERM_KEY) === 'true';
}

/**
 * Allows manual override for users whose Android APK has native permissions granted
 * in Android OS Settings.
 */
export function setManualLocationPermission(granted: boolean, coords?: LocationCoordinates): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_LOCATION_PERM_KEY, granted ? 'true' : 'false');
  if (coords) {
    localStorage.setItem(STORAGE_CACHED_LOCATION_KEY, JSON.stringify(coords));
  }
}

/**
 * Retrieves the cached or preset fallback location coordinates
 */
export function getCachedLocation(): LocationCoordinates | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_CACHED_LOCATION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

/**
 * Saves a user-selected custom emergency neighborhood fallback
 */
export function setCustomEmergencyArea(area: { name: string; city: string; lat: number; lng: number }): void {
  if (typeof window === 'undefined') return;
  const coords: LocationCoordinates = {
    latitude: area.lat,
    longitude: area.lng,
    accuracyMeters: 25,
    addressText: `${area.name}, ${area.city}`,
  };
  localStorage.setItem(STORAGE_CUSTOM_AREA_KEY, JSON.stringify(area));
  localStorage.setItem(STORAGE_CACHED_LOCATION_KEY, JSON.stringify(coords));
}

export function getCustomEmergencyArea(): { name: string; city: string; lat: number; lng: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_AREA_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

/**
 * Requests location permission early with progressive fallback:
 * 1. Tries high accuracy GPS
 * 2. If timed out, retries coarse network location
 * 3. Handles Android WebView permission rejection
 */
export async function requestLocationPermissionEarly(): Promise<LocationPermissionResult> {
  const isSecure =
    typeof window !== 'undefined'
      ? (window.isSecureContext ?? (window.location.protocol === 'https:' || window.location.hostname === 'localhost'))
      : false;

  const hasGeo = typeof navigator !== 'undefined' && 'geolocation' in navigator;

  if (!hasGeo) {
    return {
      granted: false,
      message: 'Geolocation is not supported in this browser or Android environment.',
      errorType: 'NOT_SUPPORTED',
      isSecureContext: isSecure,
      hasGeolocation: false,
    };
  }

  // Attempt 1: High accuracy GPS (5s timeout)
  const attemptGeo = (highAccuracy: boolean, timeoutMs: number): Promise<LocationCoordinates> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(5));
          const lng = Number(pos.coords.longitude.toFixed(5));
          const acc = Math.round(pos.coords.accuracy || 15);
          resolve({
            latitude: lat,
            longitude: lng,
            accuracyMeters: acc,
            addressText: `Live GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)} (±${acc}m)`,
          });
        },
        (err) => reject(err),
        { enableHighAccuracy: highAccuracy, timeout: timeoutMs, maximumAge: 30000 }
      );
    });
  };

  try {
    const coords = await attemptGeo(true, 5000);
    localStorage.setItem(STORAGE_LOCATION_PERM_KEY, 'true');
    localStorage.setItem(STORAGE_CACHED_LOCATION_KEY, JSON.stringify(coords));
    return {
      granted: true,
      message: `Location acquired successfully (±${coords.accuracyMeters}m).`,
      coords,
      isSecureContext: isSecure,
      hasGeolocation: true,
    };
  } catch (err: any) {
    // If not permission denied, try coarse location before failing
    if (err?.code !== 1) {
      try {
        const coarseCoords = await attemptGeo(false, 6000);
        localStorage.setItem(STORAGE_LOCATION_PERM_KEY, 'true');
        localStorage.setItem(STORAGE_CACHED_LOCATION_KEY, JSON.stringify(coarseCoords));
        return {
          granted: true,
          message: `Approximate location acquired (±${coarseCoords.accuracyMeters}m).`,
          coords: coarseCoords,
          isSecureContext: isSecure,
          hasGeolocation: true,
        };
      } catch (retryErr: any) {
        err = retryErr;
      }
    }

    const code = err?.code;
    let errorType: LocationPermissionResult['errorType'] = 'UNKNOWN';
    let message = 'Unable to determine location.';

    if (code === 1) {
      errorType = 'PERMISSION_DENIED';
      message = 'Location access was blocked. In Android APK wrappers, ensure WebChromeClient.onGeolocationPermissionsShowPrompt is enabled or grant location in Android Settings.';
    } else if (code === 2) {
      errorType = 'POSITION_UNAVAILABLE';
      message = 'Location position unavailable. Please ensure your device Location/GPS toggle is turned on.';
    } else if (code === 3) {
      errorType = 'TIMEOUT';
      message = 'GPS acquisition timed out. Indoor satellites or weak signal detected.';
    }

    return {
      granted: false,
      message,
      errorType,
      isSecureContext: isSecure,
      hasGeolocation: true,
    };
  }
}
