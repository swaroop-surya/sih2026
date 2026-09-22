import { Volunteer, DirectThread, DirectMessage, VolunteerHelpType, VolunteerScheduleSlot } from '../types/volunteer';
import { supabase, isSupabaseConfigured, isValidUuid } from './supabase';
import { validateCommunityContent, getAreaCenter } from './nearbyService';

const MY_VOLUNTEER_KEY = 'abhaya_my_volunteer_profile';
const SAMPLE_VOLUNTEERS_KEY = 'abhaya_sample_volunteers';
const SHOW_SAMPLE_VOLUNTEERS_KEY = 'abhaya_show_sample_volunteers';
const DIRECT_THREADS_KEY = 'abhaya_direct_threads';
const DIRECT_MESSAGES_KEY = 'abhaya_direct_messages';
const VOLUNTEER_REPORTS_KEY = 'abhaya_volunteer_reports';
const VOLUNTEER_BLOCKS_KEY = 'abhaya_volunteer_blocks';
const TOGGLE_TIMESTAMPS_KEY = 'abhaya_volunteer_toggle_timestamps';

// Rate limit: Max 5 toggles per 24 hours
export function checkVolunteerToggleRateLimit(): { allowed: boolean; remaining: number } {
  const raw = localStorage.getItem(TOGGLE_TIMESTAMPS_KEY);
  let timestamps: number[] = [];
  try {
    timestamps = raw ? JSON.parse(raw) : [];
  } catch {
    timestamps = [];
  }

  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  timestamps = timestamps.filter((t) => t > dayAgo);

  if (timestamps.length >= 5) {
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  localStorage.setItem(TOGGLE_TIMESTAMPS_KEY, JSON.stringify(timestamps));
  return { allowed: true, remaining: 5 - timestamps.length };
}

// 7-day confirmation helper
export function isVolunteerStale(lastConfirmedAt: string): boolean {
  const time = new Date(lastConfirmedAt).getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - time > sevenDaysMs;
}

export function formatConfirmationAge(dateStr: string): string {
  const now = Date.now();
  const time = new Date(dateStr).getTime();
  const diffHours = Math.floor((now - time) / (1000 * 60 * 60));

  if (diffHours < 24) return 'Confirmed today';
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Confirmed yesterday';
  return `Confirmed ${diffDays} days ago`;
}

// Approximate coordinates helper for map rendering (preserving privacy via ~300m neighborhood level)
export function getVolunteerApproxCoords(
  volunteer: Volunteer,
  fallbackAreaId?: string
): { lat: number; lng: number } {
  if (
    volunteer.approxCoords &&
    typeof volunteer.approxCoords.lat === 'number' &&
    typeof volunteer.approxCoords.lng === 'number' &&
    !isNaN(volunteer.approxCoords.lat) &&
    !isNaN(volunteer.approxCoords.lng)
  ) {
    return volunteer.approxCoords;
  }

  const area = volunteer.areas?.[0] || fallbackAreaId || 'tdr1v';
  try {
    const center = getAreaCenter(area);

    // Deterministic pseudo-random offset within ±0.012 deg (~1.2 km) so volunteers don't stack
    const hashStr = (volunteer.userId || '') + (volunteer.alias || '');
    let hashVal = 0;
    for (let i = 0; i < hashStr.length; i++) {
      hashVal = (hashVal << 5) - hashVal + hashStr.charCodeAt(i);
      hashVal |= 0;
    }
    const offsetLat = (((Math.abs(hashVal) % 1000) / 1000) - 0.5) * 0.016;
    const offsetLng = (((Math.abs(hashVal >> 3) % 1000) / 1000) - 0.5) * 0.016;

    return {
      lat: Number((center.latitude + offsetLat).toFixed(5)),
      lng: Number((center.longitude + offsetLng).toFixed(5))
    };
  } catch {
    return { lat: 12.9784, lng: 77.6408 };
  }
}

// Get sample volunteers for an area
export function getSampleVolunteers(areaId: string): Volunteer[] {
  const now = new Date();
  const yesterday = new Date(Date.now() - 24 * 3600 * 1000);
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3600 * 1000);
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 3600 * 1000);

  let centerLat = 12.9784;
  let centerLng = 77.6408;
  try {
    const c = getAreaCenter(areaId || 'tdr1v');
    centerLat = c.latitude;
    centerLng = c.longitude;
  } catch {
    // fallback
  }

  return [
    {
      userId: 'sample-vol-1',
      alias: 'Kavya_Blr',
      areas: [areaId, 'tdr1v', 'tdr1u'],
      helpTypes: ['meet_walk', 'accompany_call'],
      note: 'Safe walker near 100ft Road / Metro station in evenings. Happy to walk along.',
      showPhone: true,
      phoneDisplay: '+91 98450 12345',
      available: true,
      availabilitySlots: ['weekday_evening', 'weekend_evening'],
      lastConfirmedAt: now.toISOString(),
      createdAt: threeDaysAgo.toISOString(),
      isSample: true,
      reportCount: 0,
      approxCoords: {
        lat: Number((centerLat + 0.0035).toFixed(5)),
        lng: Number((centerLng + 0.0042).toFixed(5))
      }
    },
    {
      userId: 'sample-vol-2',
      alias: 'Ananya_East',
      areas: [areaId, 'tdr1v', 'tdr1t'],
      helpTypes: ['local_guidance', 'accompany_call'],
      note: 'Can guide well-lit routes and stay on voice call while you commute.',
      showPhone: false,
      available: true,
      availabilitySlots: ['weekday_night', 'weekend_night'],
      lastConfirmedAt: now.toISOString(),
      createdAt: twoDaysAgo.toISOString(),
      isSample: true,
      reportCount: 0,
      approxCoords: {
        lat: Number((centerLat - 0.0032).toFixed(5)),
        lng: Number((centerLng + 0.0028).toFixed(5))
      }
    },
    {
      userId: 'sample-vol-3',
      alias: 'Sunita_Walk',
      areas: [areaId, 'tdr1v'],
      helpTypes: ['meet_walk', 'emergency_backup', 'local_guidance'],
      note: 'Regular commuter in this neighbourhood. Always happy to accompany someone home.',
      showPhone: false,
      available: true,
      availabilitySlots: ['weekday_morning', 'weekday_evening'],
      lastConfirmedAt: yesterday.toISOString(),
      createdAt: threeDaysAgo.toISOString(),
      isSample: true,
      reportCount: 0,
      approxCoords: {
        lat: Number((centerLat + 0.0018).toFixed(5)),
        lng: Number((centerLng - 0.0045).toFixed(5))
      }
    },
    {
      userId: 'sample-vol-4',
      alias: 'Meera_Guide',
      areas: [areaId, 'tdr1u'],
      helpTypes: ['local_guidance', 'accompany_call'],
      note: 'Available for weekend metro walks and sharing safe neighbourhood stops.',
      showPhone: false,
      available: false, // Currently away
      availabilitySlots: ['weekend_morning', 'weekend_afternoon'],
      lastConfirmedAt: twoDaysAgo.toISOString(),
      createdAt: threeDaysAgo.toISOString(),
      isSample: true,
      reportCount: 0,
      approxCoords: {
        lat: Number((centerLat - 0.0048).toFixed(5)),
        lng: Number((centerLng - 0.0035).toFixed(5))
      }
    },
    {
      userId: 'sample-vol-5',
      alias: 'Pooja_Ind',
      areas: [areaId, 'tdr1v'],
      helpTypes: ['emergency_backup', 'accompany_call'],
      note: 'Student resident in the area. Can stay connected on call whenever needed.',
      showPhone: false,
      available: true,
      availabilitySlots: ['weekday_afternoon', 'weekday_evening'],
      lastConfirmedAt: threeDaysAgo.toISOString(),
      createdAt: threeDaysAgo.toISOString(),
      isSample: true,
      reportCount: 0,
      approxCoords: {
        lat: Number((centerLat - 0.0058).toFixed(5)),
        lng: Number((centerLng + 0.0052).toFixed(5))
      }
    }
  ];
}

// Local storage helpers
export function getLocalMyVolunteer(): Volunteer | null {
  try {
    const raw = localStorage.getItem(MY_VOLUNTEER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalMyVolunteer(vol: Volunteer | null): void {
  if (!vol) {
    localStorage.removeItem(MY_VOLUNTEER_KEY);
  } else {
    localStorage.setItem(MY_VOLUNTEER_KEY, JSON.stringify(vol));
  }
}

export function getLocalBlockedVolunteers(): string[] {
  try {
    const raw = localStorage.getItem(VOLUNTEER_BLOCKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalBlockedVolunteer(id: string): void {
  const list = getLocalBlockedVolunteers();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem(VOLUNTEER_BLOCKS_KEY, JSON.stringify(list));
  }
}

export function getLocalReportedVolunteers(): Record<string, number> {
  try {
    const raw = localStorage.getItem(VOLUNTEER_REPORTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordLocalVolunteerReport(volunteerId: string): number {
  const reports = getLocalReportedVolunteers();
  reports[volunteerId] = (reports[volunteerId] || 0) + 1;
  localStorage.setItem(VOLUNTEER_REPORTS_KEY, JSON.stringify(reports));
  return reports[volunteerId];
}

// Direct Threads and Messages in LocalStorage
export function getLocalDirectThreads(): DirectThread[] {
  try {
    const raw = localStorage.getItem(DIRECT_THREADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalDirectThread(thread: DirectThread): void {
  const threads = getLocalDirectThreads().filter((t) => t.id !== thread.id);
  threads.unshift(thread);
  localStorage.setItem(DIRECT_THREADS_KEY, JSON.stringify(threads));
}

export function getLocalDirectMessages(threadId: string): DirectMessage[] {
  try {
    const raw = localStorage.getItem(`${DIRECT_MESSAGES_KEY}_${threadId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalDirectMessage(msg: DirectMessage): void {
  const messages = getLocalDirectMessages(msg.threadId);
  messages.push(msg);
  localStorage.setItem(`${DIRECT_MESSAGES_KEY}_${msg.threadId}`, JSON.stringify(messages));
}

// Service: Fetch Nearby Volunteers
export async function fetchNearbyVolunteers(params: {
  areaId: string;
  currentUserId?: string;
  showSample: boolean;
}): Promise<Volunteer[]> {
  const { areaId, currentUserId, showSample } = params;
  const blockedIds = getLocalBlockedVolunteers();
  const reports = getLocalReportedVolunteers();

  let remoteVolunteers: Volunteer[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      // Call RPC function get_nearby_volunteers
      const { data, error } = await supabase.rpc('get_nearby_volunteers', {
        target_area_id: areaId
      });

      if (!error && Array.isArray(data)) {
        remoteVolunteers = data.map((item: any) => ({
          userId: item.user_id,
          alias: item.alias,
          areas: item.areas || [],
          helpTypes: item.help_types || [],
          note: item.note,
          showPhone: item.show_phone || false,
          phoneDisplay: item.phone_display,
          available: item.available,
          availabilitySlots: item.availability_slots || [],
          lastConfirmedAt: item.last_confirmed_at,
          createdAt: item.created_at,
          reportCount: 0
        }));
      }
    } catch (err) {
      console.warn('Supabase get_nearby_volunteers error (using local/sample):', err);
    }
  }

  // Combine with local volunteer if applicable
  const myVol = getLocalMyVolunteer();
  const list: Volunteer[] = [...remoteVolunteers];

  // If user is a volunteer and covers this area, add them if they aren't already there
  if (myVol && myVol.areas.includes(areaId) && myVol.available && !isVolunteerStale(myVol.lastConfirmedAt)) {
    if (!list.some((v) => v.userId === myVol.userId)) {
      list.push(myVol);
    }
  }

  // If showSample is enabled, merge sample volunteers
  if (showSample) {
    const samples = getSampleVolunteers(areaId);
    for (const sample of samples) {
      if (!list.some((v) => v.userId === sample.userId)) {
        list.push(sample);
      }
    }
  }

  // Filter out blocked volunteers and volunteers with >= 3 reports
  const filtered = list.filter((v) => {
    if (blockedIds.includes(v.userId)) return false;
    if ((reports[v.userId] || 0) >= 3) return false;
    if (isVolunteerStale(v.lastConfirmedAt)) return false;
    return true;
  });

  // Sort by: available now, then how many requested help types they offer, then most recently confirmed
  filtered.sort((a, b) => {
    if (a.available !== b.available) {
      return a.available ? -1 : 1;
    }
    if (b.helpTypes.length !== a.helpTypes.length) {
      return b.helpTypes.length - a.helpTypes.length;
    }
    return new Date(b.lastConfirmedAt).getTime() - new Date(a.lastConfirmedAt).getTime();
  });

  return filtered;
}

// Service: Upsert My Volunteer Profile
export async function upsertVolunteerProfile(volunteer: Volunteer): Promise<{ success: boolean; error?: string }> {
  // Validate rate limit
  const rateLimit = checkVolunteerToggleRateLimit();
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: 'You have updated volunteer status multiple times today. Please wait before making more changes.'
    };
  }

  // Always save locally first for instant UX & offline support
  saveLocalMyVolunteer(volunteer);

  if (isSupabaseConfigured && supabase && isValidUuid(volunteer.userId)) {
    try {
      const { error } = await supabase.from('volunteers').upsert(
        {
          user_id: volunteer.userId,
          areas: volunteer.areas,
          help_types: volunteer.helpTypes,
          note: volunteer.note || null,
          show_phone: volunteer.showPhone,
          phone_display: volunteer.phoneDisplay || null,
          available: volunteer.available,
          availability_slots: volunteer.availabilitySlots || [],
          last_confirmed_at: volunteer.lastConfirmedAt,
          created_at: volunteer.createdAt
        },
        { onConflict: 'user_id' }
      );

      if (error) {
        console.warn('Supabase volunteers upsert error (stored locally):', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase volunteers upsert exception (stored locally):', err?.message);
    }
  }

  return { success: true };
}

// Service: Toggle Volunteer Availability (Available <-> Away)
export async function toggleVolunteerAvailability(userId: string): Promise<{ success: boolean; available?: boolean; error?: string }> {
  const rateLimit = checkVolunteerToggleRateLimit();
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: 'You have changed your status multiple times today. Please wait before changing it again.'
    };
  }

  const existing = getLocalMyVolunteer();
  if (!existing) return { success: false, error: 'No volunteer profile found.' };

  const newStatus = !existing.available;
  const updated: Volunteer = {
    ...existing,
    available: newStatus,
    lastConfirmedAt: newStatus ? new Date().toISOString() : existing.lastConfirmedAt
  };

  saveLocalMyVolunteer(updated);

  if (isSupabaseConfigured && supabase && isValidUuid(userId)) {
    try {
      await supabase
        .from('volunteers')
        .update({
          available: newStatus,
          last_confirmed_at: updated.lastConfirmedAt
        })
        .eq('user_id', userId);
    } catch (err: any) {
      console.warn('Supabase toggle availability exception:', err?.message);
    }
  }

  return { success: true, available: newStatus };
}

// Service: Delete My Volunteer Profile (Stop being a volunteer)
export async function deleteVolunteerProfile(userId: string): Promise<{ success: boolean; error?: string }> {
  const rateLimit = checkVolunteerToggleRateLimit();
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: 'You have toggled volunteer status multiple times today. Please wait before making more changes.'
    };
  }

  saveLocalMyVolunteer(null);

  if (isSupabaseConfigured && supabase && isValidUuid(userId)) {
    try {
      const { error } = await supabase.from('volunteers').delete().eq('user_id', userId);
      if (error) {
        console.warn('Supabase volunteers delete error:', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase volunteers delete exception:', err?.message);
    }
  }

  return { success: true };
}

// Service: Confirm Still Available for 7 Days
export async function confirmVolunteerAvailability(userId: string): Promise<{ success: boolean; error?: string }> {
  const existing = getLocalMyVolunteer();
  if (!existing) return { success: false, error: 'No volunteer profile found.' };

  const updated: Volunteer = {
    ...existing,
    available: true,
    lastConfirmedAt: new Date().toISOString()
  };

  saveLocalMyVolunteer(updated);

  if (isSupabaseConfigured && supabase && isValidUuid(userId)) {
    try {
      await supabase
        .from('volunteers')
        .update({
          available: true,
          last_confirmed_at: updated.lastConfirmedAt
        })
        .eq('user_id', userId);
    } catch (err) {
      console.warn('Supabase confirm availability error:', err);
    }
  }

  return { success: true };
}

// Service: Direct Thread Get or Create
export async function getOrCreateDirectThread(params: {
  currentUserId: string;
  otherUserId: string;
  otherAlias: string;
}): Promise<DirectThread> {
  const { currentUserId, otherUserId, otherAlias } = params;
  const threadId = [currentUserId, otherUserId].sort().join('__');

  // Check local first
  const localThreads = getLocalDirectThreads();
  const existing = localThreads.find((t) => t.id === threadId);
  if (existing) {
    return existing;
  }

  const newThread: DirectThread = {
    id: threadId,
    userA: currentUserId,
    userB: otherUserId,
    createdAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
    otherAlias
  };

  saveLocalDirectThread(newThread);

  // If Supabase is active
  if (isSupabaseConfigured && supabase && isValidUuid(currentUserId) && isValidUuid(otherUserId)) {
    try {
      const [uA, uB] = currentUserId < otherUserId ? [currentUserId, otherUserId] : [otherUserId, currentUserId];
      const { data, error } = await supabase
        .from('direct_threads')
        .select('*')
        .eq('user_a', uA)
        .eq('user_b', uB)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          userA: data.user_a,
          userB: data.user_b,
          createdAt: data.created_at,
          lastMessageAt: data.last_message_at,
          otherAlias
        };
      }

      const { data: created, error: createErr } = await supabase
        .from('direct_threads')
        .insert({ user_a: uA, user_b: uB })
        .select()
        .single();

      if (!createErr && created) {
        return {
          id: created.id,
          userA: created.user_a,
          userB: created.user_b,
          createdAt: created.created_at,
          lastMessageAt: created.last_message_at,
          otherAlias
        };
      }
    } catch (err) {
      console.warn('Supabase direct_threads error:', err);
    }
  }

  return newThread;
}

// Service: Send Direct Message
export async function sendDirectMessage(params: {
  threadId: string;
  authorId: string;
  authorAlias: string;
  body: string;
  recipientUserId?: string;
  recipientAlias?: string;
}): Promise<{ success: boolean; message?: DirectMessage; error?: string }> {
  const { threadId, authorId, authorAlias, body, recipientUserId, recipientAlias } = params;

  // Validate content rules: no links, no emails, no phones
  const validation = validateCommunityContent(body);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const newMsg: DirectMessage = {
    id: `dm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    threadId,
    authorId,
    authorAlias,
    body: body.trim(),
    createdAt: new Date().toISOString()
  };

  saveLocalDirectMessage(newMsg);

  // If remote Supabase
  if (isSupabaseConfigured && supabase && isValidUuid(threadId) && isValidUuid(authorId)) {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          thread_id: threadId,
          author_id: authorId,
          body: body.trim()
        })
        .select()
        .single();

      if (!error && data) {
        newMsg.id = data.id;
        newMsg.createdAt = data.created_at;
      }
    } catch (err) {
      console.warn('Supabase direct_messages error (stored locally):', err);
    }
  }

  // In demo mode: If chatting with a sample volunteer, simulate realistic automated response after 1.2s
  if (recipientUserId?.startsWith('sample-vol')) {
    setTimeout(() => {
      const responses: Record<string, string> = {
        'sample-vol-1': `Hello! I received your message. I am in the area near 100ft road and can accompany you if needed.`,
        'sample-vol-2': `Hi there! I can stay on voice call with you while you walk or guide you along the main street.`,
        'sample-vol-3': `Hello! Happy to help. Let me know which landmark you're near and I can meet you to walk along.`,
        'sample-vol-5': `Hi! I got your message. I am nearby and keeping my phone close. Let me know how I can help.`
      };

      const replyText =
        responses[recipientUserId] ||
        `Hi! I saw your message. I'm a community volunteer nearby and available to assist.`;

      const replyMsg: DirectMessage = {
        id: `dm-reply-${Date.now()}`,
        threadId,
        authorId: recipientUserId,
        authorAlias: recipientAlias || 'Volunteer',
        body: replyText,
        createdAt: new Date().toISOString(),
        isSample: true
      };

      saveLocalDirectMessage(replyMsg);

      // Trigger browser notification if permitted
      notifyDirectMessage(recipientAlias || 'Volunteer', replyText);

      // Dispatch custom event so active chat modal updates immediately
      window.dispatchEvent(
        new CustomEvent('abhaya_direct_message_received', {
          detail: { threadId, message: replyMsg }
        })
      );
    }, 1200);
  }

  return { success: true, message: newMsg };
}

// Notification Helper
export function notifyDirectMessage(authorAlias: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(`Abhaya: Message from ${authorAlias}`, {
        body,
        icon: '/pwa-192x192.png'
      });
    } catch {
      // Ignored
    }
  }
}
