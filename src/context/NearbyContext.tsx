import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useAegis } from '../hooks/useAegisState';
import {
  encodeAreaGeohash,
  encodePinGeohash,
  fetchAreaMetadata,
  getAreaNeighbors,
  generateSampleMessages,
  validateCommunityContent,
  getLocalMessages,
  saveLocalMessage,
  getLocalConfirmations,
  saveLocalConfirmation,
  removeLocalConfirmation,
  getLocalBlocks,
  saveLocalBlock,
  notifyNewAreaAlert
} from '../services/nearbyService';
import { supabase, isSupabaseConfigured, isValidUuid } from '../services/supabase';
import { NearbyArea, NearbyMessage, NearbyAlertCategory, NearbyKind } from '../types/nearby';

interface NearbyContextType {
  userCoords: { lat: number; lng: number } | null;
  userAreaId: string | null;
  activeRoomId: string;
  activeArea: NearbyArea | null;
  neighborAreas: NearbyArea[];
  messages: NearbyMessage[];
  isLoadingArea: boolean;
  isLoadingMessages: boolean;
  hasMoreMessages: boolean;
  loadOlderMessages: () => Promise<void>;
  locationPermissionStatus: 'prompt' | 'granted' | 'denied';
  roomSwitchBanner: string | null;
  clearRoomSwitchBanner: () => void;
  showSampleActivity: boolean;
  setShowSampleActivity: (show: boolean) => void;
  hasAcceptedRules: boolean;
  acceptRules: () => void;
  unreadAlertCount: number;
  latestAlert: NearbyMessage | null;
  alerts24hCount: number;
  postMessage: (params: {
    kind: NearbyKind;
    category?: NearbyAlertCategory | null;
    body: string;
    addPin?: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
  toggleConfirm: (messageId: string) => Promise<void>;
  toggleFixed: (messageId: string) => Promise<void>;
  reportMessage: (messageId: string, reason: string) => Promise<void>;
  blockUser: (authorId: string) => Promise<void>;
  setActiveRoom: (areaId: string) => void;
  resetToUserArea: () => void;
  requestLocation: () => void;
  searchAndSelectArea: (query: string) => Promise<{ success: boolean; error?: string }>;
}

const NearbyContext = createContext<NearbyContextType | undefined>(undefined);

const RULES_ACCEPTED_KEY = 'abhaya_nearby_rules_accepted';
const SAMPLE_ACTIVITY_KEY = 'abhaya_show_sample_area_activity';

export const NearbyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, communityProfile, isDemoSession } = useAuth();
  const { profile } = useAegis();

  // User physical location state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [userAreaId, setUserAreaId] = useState<string | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string>('tdr1v'); // Default to Indiranagar/Bengaluru center
  const [activeArea, setActiveArea] = useState<NearbyArea | null>(null);
  const [neighborAreas, setNeighborAreas] = useState<NearbyArea[]>([]);

  // Room switch tracking: requires 2 consecutive readings in a new cell
  const consecutiveCandidateRef = useRef<{ hash: string; count: number } | null>(null);
  const [roomSwitchBanner, setRoomSwitchBanner] = useState<string | null>(null);

  // Messages & feed
  const [messages, setMessages] = useState<NearbyMessage[]>([]);
  const [isLoadingArea, setIsLoadingArea] = useState<boolean>(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(false);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  // Sample toggle for evaluator demo mode
  const [showSampleActivity, setShowSampleActivityState] = useState<boolean>(() => {
    const saved = localStorage.getItem(SAMPLE_ACTIVITY_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  const setShowSampleActivity = (val: boolean) => {
    setShowSampleActivityState(val);
    localStorage.setItem(SAMPLE_ACTIVITY_KEY, String(val));
  };

  // Rules acceptance state
  const [hasAcceptedRules, setHasAcceptedRules] = useState<boolean>(() => {
    return localStorage.getItem(RULES_ACCEPTED_KEY) === 'true';
  });

  const acceptRules = () => {
    setHasAcceptedRules(true);
    localStorage.setItem(RULES_ACCEPTED_KEY, 'true');
  };

  // Blocks and confirmations cache for current user
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() => getLocalBlocks());
  const [userConfirms, setUserConfirms] = useState<Record<string, 'confirm' | 'fixed'>>(() => getLocalConfirmations());

  // User alias resolution
  const userAlias = communityProfile?.alias || profile.name || 'Neighbour';
  const userId = user?.id || 'evaluator-user';

  // -------------------------------------------------------------------------
  // 1. Geolocation Tracking with watchPosition
  // -------------------------------------------------------------------------
  const handleGeoSuccess = useCallback((pos: GeolocationPosition) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    setUserCoords({ lat, lng });
    setLocationPermissionStatus('granted');

    const newGeohash5 = encodeAreaGeohash(lat, lng);

    // Initial setup: first reading
    setUserAreaId((prevUserArea) => {
      if (!prevUserArea) {
        setActiveRoomId(newGeohash5);
        return newGeohash5;
      }

      // Check if location moved to a different precision 5 cell
      if (newGeohash5 !== prevUserArea) {
        if (consecutiveCandidateRef.current?.hash === newGeohash5) {
          consecutiveCandidateRef.current.count += 1;
          if (consecutiveCandidateRef.current.count >= 2) {
            // Two consecutive readings in new cell: perform room switch
            consecutiveCandidateRef.current = null;
            setActiveRoomId(newGeohash5);

            // Fetch name for banner and system notice
            fetchAreaMetadata(newGeohash5).then((areaMeta) => {
              const bannerMsg = `You're now in ${areaMeta.name}. Chat switched.`;
              setRoomSwitchBanner(bannerMsg);

              // Add a system line to the feed
              const sysLine: NearbyMessage = {
                id: 'sys-' + Date.now(),
                area_id: newGeohash5,
                author_id: 'system',
                author_alias: 'Abhaya System',
                kind: 'system',
                body: bannerMsg,
                confirm_count: 0,
                fixed_count: 0,
                report_count: 0,
                hidden: false,
                created_at: new Date().toISOString()
              };
              setMessages((prev) => [sysLine, ...prev]);
            });

            return newGeohash5;
          }
        } else {
          // First candidate reading
          consecutiveCandidateRef.current = { hash: newGeohash5, count: 1 };
        }
      } else {
        // Still in the same cell, reset candidate
        consecutiveCandidateRef.current = null;
      }

      return prevUserArea;
    });
  }, []);

  const handleGeoError = useCallback((err: GeolocationPositionError) => {
    console.warn('Nearby geolocation warning:', err.message);
    if (err.code === err.PERMISSION_DENIED) {
      setLocationPermissionStatus('denied');
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError, {
        enableHighAccuracy: false,
        maximumAge: 60000,
        timeout: 10000
      });
    }
  }, [handleGeoSuccess, handleGeoError]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(handleGeoSuccess, handleGeoError, {
      enableHighAccuracy: false,
      maximumAge: 60000
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [handleGeoSuccess, handleGeoError]);

  // -------------------------------------------------------------------------
  // 2. Fetch Active Area and Neighbor Areas
  // -------------------------------------------------------------------------
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingArea(true);

    fetchAreaMetadata(activeRoomId)
      .then((area) => {
        if (!isCancelled) {
          setActiveArea(area);
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingArea(false);
      });

    // Fetch 8 neighboring areas
    const neighborHashes = getAreaNeighbors(activeRoomId);
    Promise.all(neighborHashes.map((h) => fetchAreaMetadata(h))).then((list) => {
      if (!isCancelled) {
        setNeighborAreas(list);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [activeRoomId]);

  // -------------------------------------------------------------------------
  // 3. Load Room Messages & Realtime Subscription
  // -------------------------------------------------------------------------
  const loadMessagesForRoom = useCallback(
    async (roomId: string) => {
      setIsLoadingMessages(true);

      let remoteList: NearbyMessage[] = [];
      let hasMore = false;

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('area_id', roomId)
            .eq('hidden', false)
            .order('created_at', { ascending: false })
            .limit(50);

          if (!error && data) {
            remoteList = data.map((d) => ({
              ...d,
              userConfirmed: userConfirms[d.id] === 'confirm',
              userFixed: userConfirms[d.id] === 'fixed'
            }));
            hasMore = data.length >= 50;
          }
        } catch (err) {
          console.warn('Error fetching Supabase messages:', err);
        }
      }

      // Local / Offline / Evaluator messages
      const localList = getLocalMessages(roomId).map((d) => ({
        ...d,
        userConfirmed: userConfirms[d.id] === 'confirm',
        userFixed: userConfirms[d.id] === 'fixed'
      }));

      // Evaluator Sample Data
      let samples: NearbyMessage[] = [];
      if (showSampleActivity) {
        samples = generateSampleMessages(roomId).map((s) => ({
          ...s,
          userConfirmed: userConfirms[s.id] === 'confirm',
          userFixed: userConfirms[s.id] === 'fixed'
        }));
      }

      // Combine, filter out blocked users, and sort by created_at desc
      const combined = [...remoteList, ...localList, ...samples];
      const uniqueMap = new Map<string, NearbyMessage>();
      for (const m of combined) {
        if (!blockedUsers.includes(m.author_id) && !m.hidden) {
          uniqueMap.set(m.id, m);
        }
      }

      const sorted = Array.from(uniqueMap.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setMessages(sorted);
      setHasMoreMessages(hasMore);
      setIsLoadingMessages(false);
    },
    [blockedUsers, userConfirms, showSampleActivity]
  );

  useEffect(() => {
    loadMessagesForRoom(activeRoomId);

    // Supabase Realtime Subscription for activeRoomId
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel(`area_messages_${activeRoomId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `area_id=eq.${activeRoomId}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newMsg = payload.new as NearbyMessage;
              if (!blockedUsers.includes(newMsg.author_id) && !newMsg.hidden) {
                setMessages((prev) => {
                  if (prev.some((m) => m.id === newMsg.id)) return prev;
                  return [newMsg, ...prev];
                });

                // If this is an alert in the user's current physical room, trigger notification
                if (newMsg.kind === 'alert' && activeRoomId === userAreaId) {
                  notifyNewAreaAlert(newMsg);
                }
              }
            } else if (payload.eventType === 'UPDATE') {
              const updated = payload.new as NearbyMessage;
              setMessages((prev) =>
                prev
                  .map((m) => (m.id === updated.id ? { ...m, ...updated } : m))
                  .filter((m) => !m.hidden)
              );
            } else if (payload.eventType === 'DELETE') {
              const old = payload.old as { id: string };
              setMessages((prev) => prev.filter((m) => m.id !== old.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeRoomId, loadMessagesForRoom, blockedUsers, userAreaId]);

  // Load older messages (pagination)
  const loadOlderMessages = async () => {
    if (!hasMoreMessages || !isSupabaseConfigured || !supabase) return;
    const oldest = messages[messages.length - 1];
    if (!oldest) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('area_id', activeRoomId)
        .eq('hidden', false)
        .lt('created_at', oldest.created_at)
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && data) {
        const older = data
          .map((d) => ({
            ...d,
            userConfirmed: userConfirms[d.id] === 'confirm',
            userFixed: userConfirms[d.id] === 'fixed'
          }))
          .filter((m) => !blockedUsers.includes(m.author_id));

        setMessages((prev) => [...prev, ...older]);
        setHasMoreMessages(data.length >= 30);
      }
    } catch (err) {
      console.warn('Error loading older messages:', err);
    }
  };

  // -------------------------------------------------------------------------
  // 4. Post Message (Chat or Alert)
  // -------------------------------------------------------------------------
  const postMessage = async ({
    kind,
    category,
    body,
    addPin = true
  }: {
    kind: NearbyKind;
    category?: NearbyAlertCategory | null;
    body: string;
    addPin?: boolean;
  }): Promise<{ success: boolean; error?: string }> => {
    // 1. Content validation
    const contentCheck = validateCommunityContent(body);
    if (!contentCheck.valid) {
      return { success: false, error: contentCheck.error };
    }

    // 2. Physical area posting constraint: User can only post in the room of their physical area
    if (userAreaId && activeRoomId !== userAreaId) {
      return {
        success: false,
        error: "You can post only in the area you are physically in."
      };
    }

    // 3. Approximate pin calculation: precision 7 (~150m)
    let pinGeohash: string | null = null;
    if (kind === 'alert' && addPin) {
      if (userCoords) {
        pinGeohash = encodePinGeohash(userCoords.lat, userCoords.lng);
      } else if (activeArea && isFinite(activeArea.center_lat) && isFinite(activeArea.center_lng)) {
        pinGeohash = encodePinGeohash(activeArea.center_lat, activeArea.center_lng);
      }
    }

    const newMsg: NearbyMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      area_id: activeRoomId,
      author_id: user?.id || userId,
      author_alias: userAlias,
      kind,
      category: kind === 'alert' ? category || 'no_street_light' : null,
      body: body.trim(),
      pin_geohash: pinGeohash,
      confirm_count: 0,
      fixed_count: 0,
      report_count: 0,
      hidden: false,
      created_at: new Date().toISOString()
    };

    // Always persist to local storage first so alerts work immediately and are never lost
    saveLocalMessage(newMsg);

    // Attempt remote save to Supabase if configured and user is authenticated in Supabase
    if (isSupabaseConfigured && supabase && !isDemoSession && user?.id && isValidUuid(user.id)) {
      try {
        const payload: Record<string, unknown> = {
          area_id: newMsg.area_id,
          author_id: user.id,
          author_alias: userAlias,
          kind: newMsg.kind,
          category: newMsg.category,
          body: newMsg.body,
          pin_geohash: newMsg.pin_geohash
        };

        const { data, error } = await supabase
          .from('messages')
          .insert(payload)
          .select()
          .single();

        if (!error && data) {
          newMsg.id = data.id;
        } else if (error) {
          console.warn('Supabase remote message insert error (stored locally):', error.message);
        }
      } catch (err: unknown) {
        console.warn('Supabase remote save exception (stored locally):', err);
      }
    }

    // Add to current UI feed
    setMessages((prev) => [newMsg, ...prev]);

    return { success: true };
  };

  // -------------------------------------------------------------------------
  // 5. Confirmations & "Fixed" Voting
  // -------------------------------------------------------------------------
  const toggleConfirm = async (messageId: string) => {
    const isAlready = userConfirms[messageId] === 'confirm';

    if (isAlready) {
      removeLocalConfirmation(messageId);
      setUserConfirms((prev) => {
        const next = { ...prev };
        delete next[messageId];
        return next;
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, confirm_count: Math.max(0, m.confirm_count - 1), userConfirmed: false }
            : m
        )
      );

      if (isSupabaseConfigured && supabase && !isDemoSession && isValidUuid(userId)) {
        try {
          await supabase
            .from('confirmations')
            .delete()
            .match({ message_id: messageId, user_id: userId, kind: 'confirm' });
        } catch (err) {
          console.warn('Error deleting confirmation in Supabase:', err);
        }
      }
    } else {
      saveLocalConfirmation(messageId, 'confirm');
      setUserConfirms((prev) => ({ ...prev, [messageId]: 'confirm' }));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, confirm_count: m.confirm_count + 1, userConfirmed: true }
            : m
        )
      );

      if (isSupabaseConfigured && supabase && !isDemoSession && isValidUuid(userId)) {
        try {
          await supabase
            .from('confirmations')
            .insert({ message_id: messageId, user_id: userId, kind: 'confirm' });
        } catch (err) {
          console.warn('Error inserting confirmation in Supabase:', err);
        }
      }
    }
  };

  const toggleFixed = async (messageId: string) => {
    const isAlready = userConfirms[messageId] === 'fixed';

    if (isAlready) {
      removeLocalConfirmation(messageId);
      setUserConfirms((prev) => {
        const next = { ...prev };
        delete next[messageId];
        return next;
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, fixed_count: Math.max(0, m.fixed_count - 1), userFixed: false }
            : m
        )
      );

      if (isSupabaseConfigured && supabase && !isDemoSession && isValidUuid(userId)) {
        try {
          await supabase
            .from('confirmations')
            .delete()
            .match({ message_id: messageId, user_id: userId, kind: 'fixed' });
        } catch (err) {
          console.warn('Error deleting fixed status in Supabase:', err);
        }
      }
    } else {
      saveLocalConfirmation(messageId, 'fixed');
      setUserConfirms((prev) => ({ ...prev, [messageId]: 'fixed' }));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, fixed_count: m.fixed_count + 1, userFixed: true }
            : m
        )
      );

      if (isSupabaseConfigured && supabase && !isDemoSession && isValidUuid(userId)) {
        try {
          await supabase
            .from('confirmations')
            .insert({ message_id: messageId, user_id: userId, kind: 'fixed' });
        } catch (err) {
          console.warn('Error inserting fixed status in Supabase:', err);
        }
      }
    }
  };

  // -------------------------------------------------------------------------
  // 6. Moderation: Report Message & Block User
  // -------------------------------------------------------------------------
  const reportMessage = async (messageId: string, reason: string) => {
    if (isSupabaseConfigured && supabase && !isDemoSession && isValidUuid(userId)) {
      try {
        await supabase.from('reports').insert({
          message_id: messageId,
          reporter_id: userId,
          reason: reason.trim()
        });
      } catch (err) {
        console.warn('Error saving report:', err);
      }
    }

    // Hide optimistically if local or increment count
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          const newRepCount = m.report_count + 1;
          return { ...m, report_count: newRepCount, hidden: newRepCount >= 3 };
        }
        return m;
      }).filter((m) => !m.hidden)
    );
  };

  const blockUser = async (authorId: string) => {
    saveLocalBlock(authorId);
    setBlockedUsers((prev) => [...prev, authorId]);

    // Remove their messages from feed immediately
    setMessages((prev) => prev.filter((m) => m.author_id !== authorId));

    if (isSupabaseConfigured && supabase && !isDemoSession && isValidUuid(userId) && isValidUuid(authorId)) {
      try {
        await supabase.from('blocks').insert({
          blocker_id: userId,
          blocked_id: authorId
        });
      } catch (err) {
        console.warn('Error blocking user in Supabase:', err);
      }
    }
  };

  // -------------------------------------------------------------------------
  // 7. Area Switch & Search
  // -------------------------------------------------------------------------
  const setActiveRoom = (areaId: string) => {
    setActiveRoomId(areaId);
  };

  const resetToUserArea = () => {
    if (userAreaId) {
      setActiveRoomId(userAreaId);
    }
  };

  const searchAndSelectArea = async (query: string): Promise<{ success: boolean; error?: string }> => {
    if (!query.trim()) return { success: false, error: 'Please enter a search term' };

    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=json&limit=1`,
        { headers: { Accept: 'application/json' } }
      );
      if (!resp.ok) throw new Error('Search failed');
      const results = await resp.json();
      if (!results || results.length === 0) {
        return { success: false, error: 'No location found for this search.' };
      }

      const lat = parseFloat(results[0].lat);
      const lng = parseFloat(results[0].lon);
      const searchGeohash5 = encodeAreaGeohash(lat, lng);
      setActiveRoomId(searchGeohash5);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Search failed. Please check network connection.' };
    }
  };

  // -------------------------------------------------------------------------
  // 8. Stats for Home Page & Header
  // -------------------------------------------------------------------------
  const alerts = messages.filter((m) => m.kind === 'alert');
  const now = Date.now();
  const alerts24h = alerts.filter(
    (m) => now - new Date(m.created_at).getTime() <= 24 * 60 * 60 * 1000
  );
  const unreadAlertCount = alerts24h.length;
  const latestAlert = alerts[0] || null;

  return (
    <NearbyContext.Provider
      value={{
        userCoords,
        userAreaId,
        activeRoomId,
        activeArea,
        neighborAreas,
        messages,
        isLoadingArea,
        isLoadingMessages,
        hasMoreMessages,
        loadOlderMessages,
        locationPermissionStatus,
        roomSwitchBanner,
        clearRoomSwitchBanner: () => setRoomSwitchBanner(null),
        showSampleActivity,
        setShowSampleActivity,
        hasAcceptedRules,
        acceptRules,
        unreadAlertCount,
        latestAlert,
        alerts24hCount: alerts24h.length,
        postMessage,
        toggleConfirm,
        toggleFixed,
        reportMessage,
        blockUser,
        setActiveRoom,
        resetToUserArea,
        requestLocation,
        searchAndSelectArea
      }}
    >
      {children}
    </NearbyContext.Provider>
  );
};

export const useNearby = (): NearbyContextType => {
  const context = useContext(NearbyContext);
  if (!context) {
    throw new Error('useNearby must be used within a NearbyProvider');
  }
  return context;
};
