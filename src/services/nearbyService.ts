import geohash from 'ngeohash';
import { supabase, isSupabaseConfigured } from './supabase';
import { NearbyArea, NearbyMessage, NearbyAlertCategory } from '../types/nearby';

// ---------------------------------------------------------------------------
// Nominatim Sequential Rate-Limited Geocoding Queue (1 request per 1.1s)
// ---------------------------------------------------------------------------
interface QueueItem<T> {
  task: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
}

const nominatimQueue: QueueItem<unknown>[] = [];
let isProcessingQueue = false;
let lastNominatimCallTime = 0;

async function processNominatimQueue() {
  if (isProcessingQueue || nominatimQueue.length === 0) return;
  isProcessingQueue = true;

  while (nominatimQueue.length > 0) {
    const item = nominatimQueue.shift();
    if (!item) break;

    const now = Date.now();
    const elapsed = now - lastNominatimCallTime;
    const waitTime = Math.max(0, 1150 - elapsed);
    if (waitTime > 0) {
      await new Promise((r) => setTimeout(r, waitTime));
    }

    try {
      lastNominatimCallTime = Date.now();
      const res = await item.task();
      item.resolve(res);
    } catch (err) {
      item.reject(err);
    }
  }

  isProcessingQueue = false;
}

function scheduleNominatim<T>(task: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    nominatimQueue.push({ task: task as () => Promise<unknown>, resolve: resolve as (val: unknown) => void, reject });
    processNominatimQueue();
  });
}

// ---------------------------------------------------------------------------
// Geohash Helpers
// ---------------------------------------------------------------------------

export function encodeAreaGeohash(lat: number, lng: number): string {
  return geohash.encode(lat, lng, 5);
}

export function encodePinGeohash(lat: number, lng: number): string {
  return geohash.encode(lat, lng, 7);
}

export function decodePinGeohash(pinHash: string): { latitude: number; longitude: number } {
  const decoded = geohash.decode(pinHash);
  return { latitude: decoded.latitude, longitude: decoded.longitude };
}

export function getAreaBoundingBox(areaId: string): [number, number, number, number] {
  // Returns [minLat, minLng, maxLat, maxLng]
  return geohash.decode_bbox(areaId);
}

export function getAreaCenter(areaId: string): { latitude: number; longitude: number } {
  const decoded = geohash.decode(areaId);
  return { latitude: decoded.latitude, longitude: decoded.longitude };
}

export function getAreaNeighbors(areaId: string): string[] {
  try {
    return geohash.neighbors(areaId);
  } catch (err) {
    console.warn('Failed to calculate neighbors for', areaId, err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Content Validation & Anti-Leak Safety Filter
// ---------------------------------------------------------------------------

export function validateCommunityContent(text: string): { valid: boolean; error?: string } {
  if (!text || !text.trim()) {
    return { valid: false, error: 'Please enter a message.' };
  }

  if (text.length > 280) {
    return { valid: false, error: 'Message cannot exceed 280 characters.' };
  }

  // 1. 10 or more digits run (phone numbers, even with spaces/hyphens/brackets)
  const phonePattern = /(\+?[0-9][\s\-\.\(\)]*){10,}/;
  if (phonePattern.test(text)) {
    const rawMatch = text.match(phonePattern)?.[0] || '';
    const digitsOnly = rawMatch.replace(/\D/g, '');
    if (digitsOnly.length >= 10) {
      return {
        valid: false,
        error: "For everyone's safety, don't share phone numbers or links here."
      };
    }
  }

  // 2. Email pattern
  if (/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/i.test(text)) {
    return {
      valid: false,
      error: "For everyone's safety, don't share phone numbers or links here."
    };
  }

  // 3. URLs and Web links
  if (/(https?:\/\/|www\.[a-z0-9\-\.]+|[a-z0-9\-\.]+\.(com|org|net|in|co|io|app|gov|edu|me))\b/i.test(text)) {
    return {
      valid: false,
      error: "For everyone's safety, don't share phone numbers or links here."
    };
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// Area Reverse Geocoding & Caching
// ---------------------------------------------------------------------------

const LOCAL_AREA_CACHE_PREFIX = 'abhaya_area_cache_';

export async function fetchAreaMetadata(rawAreaId: string): Promise<NearbyArea> {
  const areaId = (typeof rawAreaId === 'string' && rawAreaId.trim().length >= 2)
    ? rawAreaId.trim().toLowerCase()
    : 'tdr1v';

  const cacheKey = LOCAL_AREA_CACHE_PREFIX + areaId;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  // If Supabase is connected, check DB first
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .eq('id', areaId)
        .maybeSingle();

      if (!error && data) {
        const areaObj: NearbyArea = {
          id: data.id,
          name: data.name,
          center_lat: data.center_lat,
          center_lng: data.center_lng,
          sw_label: data.sw_label,
          ne_label: data.ne_label,
          created_at: data.created_at
        };
        localStorage.setItem(cacheKey, JSON.stringify(areaObj));
        return areaObj;
      }
    } catch (err) {
      console.warn('Error querying areas table:', err);
    }
  }

  // Otherwise, calculate bbox and reverse geocode with Nominatim sequentially
  let center: { latitude: number; longitude: number };
  let bbox: [number, number, number, number];
  try {
    center = getAreaCenter(areaId);
    bbox = getAreaBoundingBox(areaId); // [minLat, minLng, maxLat, maxLng]
  } catch {
    center = { latitude: 12.9716, longitude: 77.5946 };
    bbox = [12.95, 77.57, 12.99, 77.61];
  }

  let mainName = `Area (${areaId.toUpperCase()})`;
  let swLabel: string | null = null;
  let neLabel: string | null = null;

  try {
    if (isFinite(center.latitude) && isFinite(center.longitude)) {
      const centerInfo = await scheduleNominatim(async () => {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${center.latitude}&lon=${center.longitude}&format=json&zoom=14&addressdetails=1`,
          { headers: { Accept: 'application/json' } }
        );
        if (!resp.ok) throw new Error('Nominatim returned ' + resp.status);
        return resp.json();
      });

      if (centerInfo && centerInfo.address) {
        const addr = centerInfo.address;
        mainName =
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.city_district ||
          addr.town ||
          addr.city ||
          centerInfo.name ||
          `Area ${areaId.toUpperCase()}`;
      }
    }

    // Attempt labels for south-west and north-east corners if finite
    if (isFinite(bbox[0]) && isFinite(bbox[1])) {
      try {
        const swInfo = await scheduleNominatim(async () => {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${bbox[0]}&lon=${bbox[1]}&format=json&zoom=14&addressdetails=1`,
            { headers: { Accept: 'application/json' } }
          );
          if (!resp.ok) return null;
          return resp.json();
        });
        if (swInfo && swInfo.address) {
          swLabel = swInfo.address.suburb || swInfo.address.neighbourhood || swInfo.address.road || 'SW Corner';
        }
      } catch {
        swLabel = 'SW Border';
      }
    }

    if (isFinite(bbox[2]) && isFinite(bbox[3])) {
      try {
        const neInfo = await scheduleNominatim(async () => {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${bbox[2]}&lon=${bbox[3]}&format=json&zoom=14&addressdetails=1`,
            { headers: { Accept: 'application/json' } }
          );
          if (!resp.ok) return null;
          return resp.json();
        });
        if (neInfo && neInfo.address) {
          neLabel = neInfo.address.suburb || neInfo.address.neighbourhood || neInfo.address.road || 'NE Corner';
        }
      } catch {
        neLabel = 'NE Border';
      }
    }
  } catch (err) {
    console.warn('Reverse geocode fallback for', areaId, err);
    // Generic readable fallback
    mainName = `Ward ${areaId.toUpperCase()}`;
    swLabel = 'South-West';
    neLabel = 'North-East';
  }

  const newArea: NearbyArea = {
    id: areaId,
    name: mainName,
    center_lat: center.latitude,
    center_lng: center.longitude,
    sw_label: swLabel || 'Sector South',
    ne_label: neLabel || 'Sector North'
  };

  localStorage.setItem(cacheKey, JSON.stringify(newArea));

  // If Supabase is available, persist in DB so each cell is looked up only once
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('areas').insert({
        id: newArea.id,
        name: newArea.name,
        center_lat: newArea.center_lat,
        center_lng: newArea.center_lng,
        sw_label: newArea.sw_label,
        ne_label: newArea.ne_label
      });
    } catch (err) {
      console.debug('Area insertion ignored or duplicate:', err);
    }
  }

  return newArea;
}

// ---------------------------------------------------------------------------
// Realistic Sample Data for Evaluators / Demo Mode
// ---------------------------------------------------------------------------

export function generateSampleMessages(areaId: string): NearbyMessage[] {
  const now = Date.now();
  const center = getAreaCenter(areaId);

  // Derive realistic pins with precision 7 in this cell
  const pin1 = encodePinGeohash(center.latitude + 0.003, center.longitude - 0.002);
  const pin2 = encodePinGeohash(center.latitude - 0.004, center.longitude + 0.003);
  const pin3 = encodePinGeohash(center.latitude + 0.001, center.longitude + 0.004);
  const pin4 = encodePinGeohash(center.latitude - 0.002, center.longitude - 0.003);
  const pin5 = encodePinGeohash(center.latitude + 0.004, center.longitude + 0.001);

  return [
    {
      id: 'sample-msg-1',
      area_id: areaId,
      author_id: 'sample-user-1',
      author_alias: 'Gulmohar Sparrow',
      kind: 'alert',
      category: 'no_street_light',
      body: 'Streetlights not working from 4th Cross corner down to the bus shelter. Dark stretch, use the market lane instead.',
      pin_geohash: pin1,
      confirm_count: 5,
      fixed_count: 0,
      report_count: 0,
      hidden: false,
      created_at: new Date(now - 14 * 60 * 1000).toISOString(), // 14 mins ago
      isSample: true
    },
    {
      id: 'sample-msg-2',
      area_id: areaId,
      author_id: 'sample-user-2',
      author_alias: 'Amber Peafowl',
      kind: 'alert',
      category: 'safe_spot',
      body: '24/7 MedPlus pharmacy opposite the metro gate is well-lit with CCTV and active security guard on duty.',
      pin_geohash: pin2,
      confirm_count: 8,
      fixed_count: 0,
      report_count: 0,
      hidden: false,
      created_at: new Date(now - 45 * 60 * 1000).toISOString(), // 45 mins ago
      isSample: true
    },
    {
      id: 'sample-msg-3',
      area_id: areaId,
      author_id: 'sample-user-3',
      author_alias: 'Neelam Swift',
      kind: 'chat',
      body: 'Verified prepaid auto stand at the station has active marshals tonight. Queue moving quickly.',
      confirm_count: 0,
      fixed_count: 0,
      report_count: 0,
      hidden: false,
      created_at: new Date(now - 80 * 60 * 1000).toISOString(),
      isSample: true
    },
    {
      id: 'sample-msg-4',
      area_id: areaId,
      author_id: 'sample-user-4',
      author_alias: 'Saffron Kite',
      kind: 'alert',
      category: 'police_patrol_here',
      body: 'Pink Hoysala police patrol vehicle stationed at the college corner checkpost.',
      pin_geohash: pin3,
      confirm_count: 11,
      fixed_count: 0,
      report_count: 0,
      hidden: false,
      created_at: new Date(now - 2.5 * 60 * 60 * 1000).toISOString(),
      isSample: true
    },
    {
      id: 'sample-msg-5',
      area_id: areaId,
      author_id: 'sample-user-5',
      author_alias: 'Turmeric Dove',
      kind: 'alert',
      category: 'road_blocked',
      body: 'Storm drain repair work with deep trenches on the pedestrian walkway. Please watch your step.',
      pin_geohash: pin4,
      confirm_count: 4,
      fixed_count: 2, // Fixed
      report_count: 0,
      hidden: false,
      created_at: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
      isSample: true
    },
    {
      id: 'sample-msg-6',
      area_id: areaId,
      author_id: 'sample-user-6',
      author_alias: 'Indigo Jay',
      kind: 'chat',
      body: 'Anyone walking towards 7th Main from the junction right now? We can walk in a group.',
      confirm_count: 0,
      fixed_count: 0,
      report_count: 0,
      hidden: false,
      created_at: new Date(now - 9 * 60 * 60 * 1000).toISOString(),
      isSample: true
    },
    {
      id: 'sample-msg-7',
      area_id: areaId,
      author_id: 'sample-user-7',
      author_alias: 'Marigold Finch',
      kind: 'alert',
      category: 'crowd_eve_teasing',
      body: 'Group of men loitering outside the closed wine store passing inappropriate remarks. Women avoid that footpath.',
      pin_geohash: pin5,
      confirm_count: 7,
      fixed_count: 0,
      report_count: 0,
      hidden: false,
      created_at: new Date(now - 16 * 60 * 60 * 1000).toISOString(),
      isSample: true
    },
    {
      id: 'sample-msg-8',
      area_id: areaId,
      author_id: 'sample-user-8',
      author_alias: 'Silver Heron',
      kind: 'alert',
      category: 'dark_unsafe_stretch',
      body: 'Underpass lighting has been repaired by the municipal ward team today afternoon. Walkway is bright again.',
      pin_geohash: pin1,
      confirm_count: 9,
      fixed_count: 4, // Fixed
      report_count: 0,
      hidden: false,
      created_at: new Date(now - 22 * 60 * 60 * 1000).toISOString(),
      isSample: true
    }
  ];
}

// ---------------------------------------------------------------------------
// Local Message Store (Evaluator Mode & Offline Fallback)
// ---------------------------------------------------------------------------

const LOCAL_MESSAGES_KEY = 'abhaya_local_nearby_messages';
const LOCAL_CONFIRMS_KEY = 'abhaya_local_nearby_confirms';
const LOCAL_BLOCKS_KEY = 'abhaya_local_nearby_blocks';

export function getLocalBlocks(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_BLOCKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalBlock(authorId: string): void {
  const current = getLocalBlocks();
  if (!current.includes(authorId)) {
    current.push(authorId);
    localStorage.setItem(LOCAL_BLOCKS_KEY, JSON.stringify(current));
  }
}

export function getLocalConfirmations(): Record<string, 'confirm' | 'fixed'> {
  try {
    const raw = localStorage.getItem(LOCAL_CONFIRMS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalConfirmation(messageId: string, kind: 'confirm' | 'fixed'): void {
  const current = getLocalConfirmations();
  current[messageId] = kind;
  localStorage.setItem(LOCAL_CONFIRMS_KEY, JSON.stringify(current));
}

export function removeLocalConfirmation(messageId: string): void {
  const current = getLocalConfirmations();
  delete current[messageId];
  localStorage.setItem(LOCAL_CONFIRMS_KEY, JSON.stringify(current));
}

export function getLocalMessages(areaId: string): NearbyMessage[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_MESSAGES_KEY}_${areaId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalMessage(message: NearbyMessage): void {
  const list = getLocalMessages(message.area_id);
  list.unshift(message);
  localStorage.setItem(`${LOCAL_MESSAGES_KEY}_${message.area_id}`, JSON.stringify(list));
}

// Browser notification for alerts in current area
export function notifyNewAreaAlert(message: NearbyMessage) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  if (message.kind !== 'alert') return;

  try {
    const title = 'Abhaya Area Alert';
    new Notification(title, {
      body: message.body,
      tag: message.id
    });
  } catch (err) {
    console.debug('Notification trigger suppressed:', err);
  }
}
