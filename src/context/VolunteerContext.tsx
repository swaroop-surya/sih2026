import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNearby } from './NearbyContext';
import { Volunteer, DirectThread, DirectMessage, VolunteerHelpType, VolunteerScheduleSlot } from '../types/volunteer';
import {
  fetchNearbyVolunteers,
  getLocalMyVolunteer,
  upsertVolunteerProfile,
  deleteVolunteerProfile,
  confirmVolunteerAvailability,
  getOrCreateDirectThread,
  getLocalDirectMessages,
  sendDirectMessage,
  saveLocalBlockedVolunteer,
  recordLocalVolunteerReport,
  isVolunteerStale,
  toggleVolunteerAvailability
} from '../services/volunteerService';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface VolunteerContextType {
  volunteers: Volunteer[];
  availableCount: number;
  isLoadingVolunteers: boolean;
  myVolunteerProfile: Volunteer | null;
  isMyVolunteerActive: boolean;
  needsReconfirmation: boolean;
  showSampleVolunteers: boolean;
  setShowSampleVolunteers: (show: boolean) => void;

  // Modals & Sheets
  isVolunteerFormOpen: boolean;
  setIsVolunteerFormOpen: (open: boolean) => void;
  selectedVolunteer: Volunteer | null;
  setSelectedVolunteer: (vol: Volunteer | null) => void;

  // Direct chat
  activeDirectThread: DirectThread | null;
  activeChatVolunteer: Volunteer | null;
  directMessages: DirectMessage[];
  openDirectChat: (volunteer: Volunteer) => Promise<void>;
  closeDirectChat: () => void;
  sendDirectMsg: (body: string) => Promise<{ success: boolean; error?: string }>;

  // Actions
  upsertMyVolunteer: (params: {
    areas: string[];
    helpTypes: VolunteerHelpType[];
    note?: string;
    showPhone: boolean;
    phoneDisplay?: string;
    availabilitySlots: VolunteerScheduleSlot[];
  }) => Promise<{ success: boolean; error?: string }>;
  toggleMyAvailability: () => Promise<{ success: boolean; available?: boolean; error?: string }>;
  confirmStillAvailable: () => Promise<void>;
  stopBeingVolunteer: () => Promise<{ success: boolean; error?: string }>;
  reportVol: (volunteerId: string, reason: string) => Promise<{ success: boolean }>;
  blockVol: (volunteerId: string) => Promise<{ success: boolean }>;
  refreshVolunteers: () => Promise<void>;
}

const VolunteerContext = createContext<VolunteerContextType | undefined>(undefined);

const SHOW_SAMPLE_VOLUNTEERS_KEY = 'abhaya_show_sample_volunteers';

export const VolunteerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, communityProfile } = useAuth();
  const { activeRoomId } = useNearby();

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoadingVolunteers, setIsLoadingVolunteers] = useState<boolean>(true);
  const [myVolunteerProfile, setMyVolunteerProfile] = useState<Volunteer | null>(() => getLocalMyVolunteer());

  const [showSampleVolunteers, setShowSampleVolunteersState] = useState<boolean>(() => {
    const saved = localStorage.getItem(SHOW_SAMPLE_VOLUNTEERS_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  const setShowSampleVolunteers = (val: boolean) => {
    setShowSampleVolunteersState(val);
    localStorage.setItem(SHOW_SAMPLE_VOLUNTEERS_KEY, String(val));
  };

  // Modals & Sheets
  const [isVolunteerFormOpen, setIsVolunteerFormOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  // Direct chat
  const [activeDirectThread, setActiveDirectThread] = useState<DirectThread | null>(null);
  const [activeChatVolunteer, setActiveChatVolunteer] = useState<Volunteer | null>(null);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);

  // Calculate available count
  const availableCount = volunteers.filter((v) => v.available).length;

  // Check if my volunteer profile is active
  const isMyVolunteerActive = Boolean(
    myVolunteerProfile &&
    myVolunteerProfile.available &&
    !isVolunteerStale(myVolunteerProfile.lastConfirmedAt)
  );

  // Check if reconfirmation is needed (> 5 days since last confirmed)
  const needsReconfirmation = Boolean(
    myVolunteerProfile &&
    Date.now() - new Date(myVolunteerProfile.lastConfirmedAt).getTime() > 5 * 24 * 60 * 60 * 1000
  );

  // Refresh volunteers list
  const refreshVolunteers = useCallback(async () => {
    setIsLoadingVolunteers(true);
    try {
      const list = await fetchNearbyVolunteers({
        areaId: activeRoomId,
        currentUserId: user?.id,
        showSample: showSampleVolunteers
      });
      setVolunteers(list);
    } catch (err) {
      console.error('Failed to load volunteers:', err);
    } finally {
      setIsLoadingVolunteers(false);
    }
  }, [activeRoomId, user?.id, showSampleVolunteers]);

  // Load volunteers on room change or toggle change
  useEffect(() => {
    refreshVolunteers();
  }, [refreshVolunteers]);

  // Sync my volunteer profile from local storage / remote
  useEffect(() => {
    const local = getLocalMyVolunteer();
    setMyVolunteerProfile(local);
  }, []);

  // Listen for direct messages delivered locally (e.g. from sample bot)
  useEffect(() => {
    const handleLocalMessage = (e: Event) => {
      const customEvent = e as CustomEvent<{ threadId: string; message: DirectMessage }>;
      if (activeDirectThread && customEvent.detail?.threadId === activeDirectThread.id) {
        setDirectMessages((prev) => [...prev, customEvent.detail.message]);
      }
    };

    window.addEventListener('abhaya_direct_message_received', handleLocalMessage);
    return () => {
      window.removeEventListener('abhaya_direct_message_received', handleLocalMessage);
    };
  }, [activeDirectThread]);

  // Supabase Realtime for direct messages
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !activeDirectThread) return;

    const channel = supabase
      .channel(`dm_${activeDirectThread.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `thread_id=eq.${activeDirectThread.id}`
        },
        (payload) => {
          const newRow = payload.new as any;
          if (newRow) {
            setDirectMessages((prev) => {
              if (prev.some((m) => m.id === newRow.id)) return prev;
              return [
                ...prev,
                {
                  id: newRow.id,
                  threadId: newRow.thread_id,
                  authorId: newRow.author_id,
                  body: newRow.body,
                  createdAt: newRow.created_at
                }
              ];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeDirectThread]);

  // Open Direct Chat
  const openDirectChat = useCallback(
    async (volunteer: Volunteer) => {
      const currentUserId = user?.id || 'demo-user-me';
      const thread = await getOrCreateDirectThread({
        currentUserId,
        otherUserId: volunteer.userId,
        otherAlias: volunteer.alias
      });

      setActiveDirectThread(thread);
      setActiveChatVolunteer(volunteer);
      const msgs = getLocalDirectMessages(thread.id);
      setDirectMessages(msgs);
    },
    [user?.id]
  );

  const closeDirectChat = useCallback(() => {
    setActiveDirectThread(null);
    setActiveChatVolunteer(null);
    setDirectMessages([]);
  }, []);

  // Send Direct Message
  const sendDirectMsg = useCallback(
    async (body: string): Promise<{ success: boolean; error?: string }> => {
      if (!activeDirectThread) return { success: false, error: 'No active chat thread' };

      const authorId = user?.id || 'demo-user-me';
      const authorAlias = communityProfile?.alias || 'Me';

      const result = await sendDirectMessage({
        threadId: activeDirectThread.id,
        authorId,
        authorAlias,
        body,
        recipientUserId: activeChatVolunteer?.userId,
        recipientAlias: activeChatVolunteer?.alias
      });

      if (result.success && result.message) {
        setDirectMessages((prev) => [...prev, result.message!]);
      }

      return result;
    },
    [activeDirectThread, activeChatVolunteer, user?.id, communityProfile?.alias]
  );

  // Upsert My Volunteer Profile
  const upsertMyVolunteer = useCallback(
    async (params: {
      areas: string[];
      helpTypes: VolunteerHelpType[];
      note?: string;
      showPhone: boolean;
      phoneDisplay?: string;
      availabilitySlots: VolunteerScheduleSlot[];
    }): Promise<{ success: boolean; error?: string }> => {
      const userId = user?.id || 'demo-user-me';
      const alias = communityProfile?.alias || 'MyAlias';

      const vol: Volunteer = {
        userId,
        alias,
        areas: params.areas.length > 0 ? params.areas : [activeRoomId],
        helpTypes: params.helpTypes,
        note: params.note || '',
        showPhone: params.showPhone,
        phoneDisplay: params.showPhone ? params.phoneDisplay : undefined,
        available: true,
        availabilitySlots: params.availabilitySlots,
        lastConfirmedAt: new Date().toISOString(),
        createdAt: myVolunteerProfile?.createdAt || new Date().toISOString()
      };

      const res = await upsertVolunteerProfile(vol);
      if (res.success) {
        setMyVolunteerProfile(vol);
        await refreshVolunteers();
      }
      return res;
    },
    [user?.id, communityProfile?.alias, activeRoomId, myVolunteerProfile?.createdAt, refreshVolunteers]
  );

  // Confirm Still Available
  const confirmStillAvailable = useCallback(async () => {
    const userId = user?.id || 'demo-user-me';
    await confirmVolunteerAvailability(userId);
    const updated = getLocalMyVolunteer();
    setMyVolunteerProfile(updated);
    await refreshVolunteers();
  }, [user?.id, refreshVolunteers]);

  // Toggle My Availability (Available <-> Away)
  const toggleMyAvailability = useCallback(async () => {
    const userId = user?.id || 'demo-user-me';
    const res = await toggleVolunteerAvailability(userId);
    if (res.success) {
      const updated = getLocalMyVolunteer();
      setMyVolunteerProfile(updated);
      await refreshVolunteers();
    }
    return res;
  }, [user?.id, refreshVolunteers]);

  // Stop Being Volunteer
  const stopBeingVolunteer = useCallback(async () => {
    const userId = user?.id || 'demo-user-me';
    const res = await deleteVolunteerProfile(userId);
    if (res.success) {
      setMyVolunteerProfile(null);
      await refreshVolunteers();
    }
    return res;
  }, [user?.id, refreshVolunteers]);

  // Report Volunteer
  const reportVol = useCallback(
    async (volunteerId: string, reason: string): Promise<{ success: boolean }> => {
      recordLocalVolunteerReport(volunteerId);
      if (selectedVolunteer?.userId === volunteerId) {
        setSelectedVolunteer(null);
      }
      await refreshVolunteers();
      return { success: true };
    },
    [selectedVolunteer?.userId, refreshVolunteers]
  );

  // Block Volunteer
  const blockVol = useCallback(
    async (volunteerId: string): Promise<{ success: boolean }> => {
      saveLocalBlockedVolunteer(volunteerId);
      if (selectedVolunteer?.userId === volunteerId) {
        setSelectedVolunteer(null);
      }
      await refreshVolunteers();
      return { success: true };
    },
    [selectedVolunteer?.userId, refreshVolunteers]
  );

  return (
    <VolunteerContext.Provider
      value={{
        volunteers,
        availableCount,
        isLoadingVolunteers,
        myVolunteerProfile,
        isMyVolunteerActive,
        needsReconfirmation,
        showSampleVolunteers,
        setShowSampleVolunteers,
        isVolunteerFormOpen,
        setIsVolunteerFormOpen,
        selectedVolunteer,
        setSelectedVolunteer,
        activeDirectThread,
        activeChatVolunteer,
        directMessages,
        openDirectChat,
        closeDirectChat,
        sendDirectMsg,
        upsertMyVolunteer,
        toggleMyAvailability,
        confirmStillAvailable,
        stopBeingVolunteer,
        reportVol,
        blockVol,
        refreshVolunteers
      }}
    >
      {children}
    </VolunteerContext.Provider>
  );
};

export function useVolunteers(): VolunteerContextType {
  const context = useContext(VolunteerContext);
  if (!context) {
    throw new Error('useVolunteers must be used within a VolunteerProvider');
  }
  return context;
}
