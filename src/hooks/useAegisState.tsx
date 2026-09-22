import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  UserProfile,
  TrustedContact,
  IncidentRecord,
  EvidenceItem,
  SafetyCheckin,
  SafePlace,
  SafetyPlanItem,
  RiskAssessmentResult,
  EmergencyEvent,
  AuditLogEntry,
  SupportedLanguage,
  UserRole
} from '../types';
import { loadAllState, saveItem, logAudit, wipeAllLocalData } from '../lib/storage';
import {
  triggerEmergencySOS,
  triggerOverdueCheckinAlert,
  simulateSafeCheckinNotification,
  SOSDispatchResult
} from '../services/emergencyService';
import { calculateSHA256 } from '../lib/crypto';
import { generateId } from '../lib/utils';
import { demoScenarios } from '../data/demoScenarios';
import { captureSOSPhotos } from '../services/cameraService';

export type AppPage =
  | 'home'
  | 'emergency'
  | 'risk-check'
  | 'recruitment-checker'
  | 'checkin'
  | 'incidents'
  | 'evidence'
  | 'safety-plan'
  | 'location-safety'
  | 'cyber-safety'
  | 'resources'
  | 'ai-assistant'
  | 'responder'
  | 'analytics'
  | 'profile'
  | 'onboarding'
  | 'nearby';

interface AegisContextType {
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  isDisguised: boolean;
  setIsDisguised: (val: boolean) => void;
  activeDemoScenarioId: string | null;

  // Data
  profile: UserProfile;
  contacts: TrustedContact[];
  incidents: IncidentRecord[];
  evidence: EvidenceItem[];
  checkins: SafetyCheckin[];
  safePlaces: SafePlace[];
  safetyPlan: SafetyPlanItem[];
  latestRiskResult: RiskAssessmentResult | null;
  emergencyEvents: EmergencyEvent[];
  auditLogs: AuditLogEntry[];

  // Active Emergency
  activeSOS: EmergencyEvent | null;
  sosDispatchResult: SOSDispatchResult | null;
  sosCountdown: number | null;
  initiateSOSCountdown: (isSilent?: boolean, customMessage?: string) => void;
  cancelSOSCountdown: () => void;
  executeSOSImmediate: () => void;
  startSOS: (isSilent?: boolean, customMessage?: string) => Promise<void>;
  resolveSOS: (reason?: string) => void;

  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setUserRole: (role: UserRole) => void;

  // Contacts
  addContact: (contact: Omit<TrustedContact, 'id'>) => void;
  updateContact: (id: string, updates: Partial<TrustedContact>) => void;
  deleteContact: (id: string) => void;
  testContactNotification: (contactId: string) => void;

  // Checkins
  createCheckin: (checkin: Omit<SafetyCheckin, 'id' | 'status' | 'startedAt' | 'expiresAt'>) => void;
  extendCheckin: (id: string, additionalMinutes?: number) => void;
  resolveCheckinSafe: (id: string) => void;
  endCheckinWithoutAlert: (id: string) => void;
  triggerCheckinHelp: (id: string) => void;
  triggerCheckinOverdueAlertAction: (id: string) => Promise<SOSDispatchResult | null>;
  cancelCheckinAlert: (id: string) => void;

  // Incidents & Evidence
  addIncident: (incident: Omit<IncidentRecord, 'id' | 'timestamp'>) => string;
  deleteIncident: (id: string) => void;
  addEvidence: (file: File, description: string, incidentId?: string, tags?: string[]) => Promise<EvidenceItem>;
  deleteEvidence: (id: string) => void;

  // Safety Plan
  toggleSafetyPlanItem: (id: string) => void;
  addSafetyPlanItem: (item: Omit<SafetyPlanItem, 'id' | 'isCompleted'>) => void;

  // Safe Places
  addSafePlace: (place: Omit<SafePlace, 'id'>) => void;
  deleteSafePlace: (id: string) => void;

  // Risk Assessment
  saveRiskResult: (result: RiskAssessmentResult) => void;

  // Demo Scenarios
  loadDemoScenario: (scenarioId: string) => void;
  resetToDefaultData: () => void;
}

const AegisContext = createContext<AegisContextType | null>(null);

export const AegisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialData] = useState(() => loadAllState());

  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    return initialData.profile.isOnboarded ? 'home' : 'onboarding';
  });
  const [isDisguised, setIsDisguised] = useState(false);
  const [activeDemoScenarioId, setActiveDemoScenarioId] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>(initialData.profile);
  const [contacts, setContacts] = useState<TrustedContact[]>(() => {
    return (initialData.contacts || []).map(c => {
      const match = c.name.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        return {
          ...c,
          name: match[1].trim(),
          relationship: c.relationship || match[2].trim()
        };
      }
      return c;
    });
  });
  const [incidents, setIncidents] = useState<IncidentRecord[]>(initialData.incidents || []);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(initialData.evidence || []);
  const [checkins, setCheckins] = useState<SafetyCheckin[]>(initialData.checkins || []);
  const [safePlaces, setSafePlaces] = useState<SafePlace[]>(initialData.safePlaces || []);
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlanItem[]>(initialData.safetyPlan || []);
  const [latestRiskResult, setLatestRiskResult] = useState<RiskAssessmentResult | null>(initialData.latestRiskResult);
  const [emergencyEvents, setEmergencyEvents] = useState<EmergencyEvent[]>(initialData.emergencyEvents || []);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialData.auditLogs || []);

  const [activeSOS, setActiveSOS] = useState<EmergencyEvent | null>(() => {
    const events = initialData.emergencyEvents || [];
    const active = events.find(e => e.status === 'ACTIVE');
    return active || null;
  });
  const [sosDispatchResult, setSosDispatchResult] = useState<SOSDispatchResult | null>(null);

  // 5-second cancel countdown state
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSOSParamsRef = useRef<{ isSilent: boolean; customMessage?: string }>({ isSilent: false });

  // Sync back to storage on updates
  useEffect(() => {
    saveItem('aegis_user_profile', profile);
  }, [profile]);

  useEffect(() => {
    saveItem('aegis_trusted_contacts', contacts);
  }, [contacts]);

  useEffect(() => {
    saveItem('aegis_incidents', incidents);
  }, [incidents]);

  useEffect(() => {
    saveItem('aegis_evidence_vault', evidence);
  }, [evidence]);

  useEffect(() => {
    saveItem('aegis_safety_checkins', checkins);
  }, [checkins]);

  useEffect(() => {
    saveItem('aegis_safe_places', safePlaces);
  }, [safePlaces]);

  useEffect(() => {
    saveItem('aegis_safety_plan', safetyPlan);
  }, [safetyPlan]);

  useEffect(() => {
    saveItem('aegis_latest_risk_result', latestRiskResult);
  }, [latestRiskResult]);

  useEffect(() => {
    saveItem('aegis_emergency_events', emergencyEvents);
  }, [emergencyEvents]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setProfile(prev => ({ ...prev, language: lang }));
    logAudit('Language Changed', `Switched interface language to: ${lang}`);
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    setProfile(prev => ({ ...prev, role }));
    logAudit('Role Switch', `User switched active view mode to: ${role}`);
  }, []);

  // SOS Execution
  const startSOS = useCallback(async (isSilent: boolean = false, customMessage?: string) => {
    const result = await triggerEmergencySOS(isSilent, contacts, customMessage);
    setActiveSOS(result.event);
    setSosDispatchResult(result);
    setEmergencyEvents(prev => [result.event, ...prev]);

    // Also auto-create a high-severity emergency record in the Incident Journal
    const newIncident: IncidentRecord = {
      id: generateId('inc_sos'),
      timestamp: result.event.startedAt,
      date: result.event.startedAt.split('T')[0],
      time: new Date(result.event.startedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      category: 'other',
      severity: 5,
      location: result.event.location.addressText,
      description: `Emergency ${isSilent ? 'Silent ' : ''}SOS activated by user. Dispatch notifications sent to ${result?.contactNotifications?.length || 0} trusted contacts.`,
      evidenceIds: [],
      notes: customMessage || 'Auto-generated incident record from emergency trigger.',
      reportedToPolice: false
    };
    setIncidents(prev => [newIncident, ...prev]);
    setCurrentPage('emergency');

    // SILENT SOS PHOTO CAPTURE PIPELINE:
    // Fires concurrently at alert start time (non-blocking, invisible, no shutter sound).
    // In Demo mode: generates 2 sample stills labeled 'Sample photo'.
    // Stills are hashed (SHA-256), encrypted in the local evidence vault, and linked to newIncident.
    const isDemo = activeDemoScenarioId !== null || profile.showDemoTools === true;
    const isCaptureEnabled = profile.capturePhotosOnSOS !== false;

    (async () => {
      try {
        const stills = await captureSOSPhotos({
          isDemo,
          masterSwitchEnabled: isCaptureEnabled,
          alertId: result.event.id,
          timestamp: result.event.startedAt,
        });

        if (stills && stills.length > 0) {
          const newEvidenceItems: EvidenceItem[] = [];
          for (const s of stills) {
            const hash = await calculateSHA256(s.blob);
            const dataUrl = URL.createObjectURL(s.blob);
            const evItem: EvidenceItem = {
              id: generateId('ev_sos'),
              incidentId: newIncident.id,
              filename: s.fileName,
              fileType: 'image/jpeg',
              fileSize: s.blob.size,
              uploadedAt: new Date().toISOString(),
              sha256Hash: hash,
              description: s.description,
              tags: ['sos_photo', s.facing === 'back' ? 'back_camera' : 'front_camera', result.event.id],
              isEncrypted: true,
              dataUrl: dataUrl,
              kind: 'sos_photo',
              alertId: result.event.id,
            };
            newEvidenceItems.push(evItem);
          }

          // Store in evidence vault
          setEvidence(prev => [...newEvidenceItems, ...prev]);

          // Link evidence IDs to auto-created Incident record
          const addedIds = newEvidenceItems.map(item => item.id);
          setIncidents(prev => prev.map(inc => inc.id === newIncident.id ? {
            ...inc,
            evidenceIds: [...(inc.evidenceIds || []), ...addedIds]
          } : inc));

          // Update activeSOS and emergencyEvents with photosCaptured count so checklist displays it
          setActiveSOS(prev => prev && prev.id === result.event.id ? { ...prev, photosCaptured: stills.length } : prev);
          setEmergencyEvents(prev => prev.map(e => e.id === result.event.id ? { ...e, photosCaptured: stills.length } : e));

          logAudit('SOS Photo Capture', `Captured and vaulted ${stills.length} silent stills (SHA-256 verified) for alert ${result.event.id}`);
        }
      } catch (captureErr: any) {
        // Swallowed silently from user; SOS must never fail
        logAudit('SOS Photo Capture Notice', `Photo capture step: ${captureErr?.message || 'aborted'}`);
      }
    })();
  }, [contacts, activeDemoScenarioId, profile.showDemoTools, profile.capturePhotosOnSOS]);

  const cancelSOSCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setSosCountdown(null);
  }, []);

  const executeSOSImmediate = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setSosCountdown(null);
    startSOS(pendingSOSParamsRef.current.isSilent, pendingSOSParamsRef.current.customMessage);
  }, [startSOS]);

  const initiateSOSCountdown = useCallback((isSilent: boolean = false, customMessage?: string) => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    pendingSOSParamsRef.current = { isSilent, customMessage };
    setSosCountdown(5);

    countdownTimerRef.current = setInterval(() => {
      setSosCountdown(prev => {
        if (prev === null || prev <= 1) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          startSOS(isSilent, customMessage);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [startSOS]);

  const resolveSOS = useCallback((reason: string = 'User confirmed safety') => {
    if (activeSOS) {
      const resolved: EmergencyEvent = {
        ...activeSOS,
        status: 'RESOLVED',
        resolvedAt: new Date().toISOString(),
        resolutionReason: reason
      };
      setActiveSOS(null);
      setSosDispatchResult(null);
      setEmergencyEvents(prev => prev.map(e => e.id === resolved.id ? resolved : e));
      logAudit('Emergency Resolved', `SOS session ended. Resolution reason: ${reason}`);
    }
  }, [activeSOS]);

  // Contacts
  const addContact = useCallback((contact: Omit<TrustedContact, 'id'>) => {
    const newContact: TrustedContact = {
      ...contact,
      id: generateId('tc')
    };
    setContacts(prev => [...prev, newContact]);
    logAudit('Contact Added', `Added trusted contact: ${newContact.name}`);
  }, []);

  const updateContact = useCallback((id: string, updates: Partial<TrustedContact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    logAudit('Contact Removed', `Removed contact ID: ${id}`);
  }, []);

  const testContactNotification = useCallback((contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, lastTestNotification: new Date().toISOString() } : c));
    logAudit('Test Notification Sent', `Dispatched test verification SMS to ${contact.name} (${contact.phone})`);
  }, [contacts]);

  // Checkins
  const createCheckin = useCallback((checkinData: Omit<SafetyCheckin, 'id' | 'status' | 'startedAt' | 'expiresAt'>) => {
    const now = new Date();
    const expires = new Date(now.getTime() + checkinData.durationMinutes * 60 * 1000);
    const newCheckin: SafetyCheckin = {
      ...checkinData,
      id: generateId('chk'),
      status: 'ACTIVE',
      startedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      overdueAlertSent: false
    };
    // Only one active timer at a time
    setCheckins(prev => [
      newCheckin,
      ...prev.map(c => c.status === 'ACTIVE' ? { ...c, status: 'SAFE' as const } : c)
    ]);
    logAudit('Check-In Started', `Purpose: ${checkinData.purpose}. Duration: ${checkinData.durationMinutes} min.`);
  }, []);

  const extendCheckin = useCallback((id: string, additionalMinutes: number = 10) => {
    setCheckins(prev => prev.map(c => {
      if (c.id === id) {
        const currentExp = new Date(c.expiresAt).getTime();
        const base = currentExp > Date.now() ? currentExp : Date.now();
        const newExpires = new Date(base + additionalMinutes * 60 * 1000).toISOString();
        logAudit('Check-In Extended', `Extended "${c.purpose}" by ${additionalMinutes} min.`);
        return {
          ...c,
          status: 'ACTIVE' as const,
          expiresAt: newExpires,
          graceExpiresAt: undefined,
          overdueAlertSent: false
        };
      }
      return c;
    }));
  }, []);

  const resolveCheckinSafe = useCallback((id: string) => {
    let resolvedItem: SafetyCheckin | undefined;
    setCheckins(prev => prev.map(c => {
      if (c.id === id) {
        resolvedItem = c;
        return { ...c, status: 'SAFE' as const, overdueAlertSent: false };
      }
      return c;
    }));

    if (resolvedItem) {
      logAudit('Check-In Safe', `User confirmed safety for check-in: "${resolvedItem.purpose}"`);
      // If user toggled "Tell my contacts when I'm safe"
      if (resolvedItem.notifyWhenSafe) {
        const safeNotes = simulateSafeCheckinNotification(resolvedItem, contacts, profile.name || 'Ananya');
        logAudit('Safe Confirmation Dispatched', `SMS sent to ${safeNotes.length} contacts confirming safe arrival.`);
      }
    }

    if (activeSOS && (activeSOS.notes?.toLowerCase().includes('check-in') || activeSOS.serviceType?.includes('Check-in'))) {
      resolveSOS('User confirmed safety after check-in');
    }
  }, [contacts, profile.name, activeSOS, resolveSOS]);

  const endCheckinWithoutAlert = useCallback((id: string) => {
    setCheckins(prev => prev.map(c => c.id === id ? { ...c, status: 'SAFE' as const } : c));
    logAudit('Check-In Closed', `User ended check-in without alerting.`);
    if (activeSOS && (activeSOS.notes?.toLowerCase().includes('check-in') || activeSOS.serviceType?.includes('Check-in'))) {
      resolveSOS('Check-in ended without alerting');
    }
  }, [activeSOS, resolveSOS]);

  const triggerCheckinHelp = useCallback((id: string) => {
    setCheckins(prev => prev.map(c => c.id === id ? { ...c, status: 'HELP_REQUESTED' as const } : c));
    startSOS(false, 'Help requested from safety check-in.');
  }, [startSOS]);

  const triggerCheckinOverdueAlertAction = useCallback(async (id: string): Promise<SOSDispatchResult | null> => {
    const checkin = checkins.find(c => c.id === id);
    if (!checkin) return null;

    const result = await triggerOverdueCheckinAlert(checkin, contacts, profile.name || 'Ananya');
    setActiveSOS(result.event);
    setSosDispatchResult(result);
    setEmergencyEvents(prev => [result.event, ...prev]);

    setCheckins(prev => prev.map(c => c.id === id ? { ...c, status: 'EXPIRED' as const, overdueAlertSent: true } : c));

    // Create entry in Incidents ("Missed check-in", with time and location)
    const newIncident: IncidentRecord = {
      id: generateId('inc_chk'),
      timestamp: result.event.startedAt,
      date: result.event.startedAt.split('T')[0],
      time: new Date(result.event.startedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      category: 'other',
      severity: 4,
      location: result.event.location.addressText,
      description: `Missed check-in alert for "${checkin.purpose}". ${checkin.note ? 'Note: ' + checkin.note : ''} Automatic dispatch sent to ${result.contactNotifications.length} contacts.`,
      evidenceIds: [],
      notes: checkin.note || 'Automated incident created when safety check-in countdown expired with no response.',
      reportedToPolice: false
    };
    setIncidents(prev => [newIncident, ...prev]);
    logAudit('Incident Logged', `Missed check-in auto-saved to Incident Journal`);

    return result;
  }, [checkins, contacts, profile.name]);

  const cancelCheckinAlert = useCallback((id: string) => {
    resolveCheckinSafe(id);
    if (activeSOS) {
      resolveSOS('User confirmed safety and cancelled overdue alert');
    }
  }, [resolveCheckinSafe, activeSOS, resolveSOS]);

  // Background monitor: if app was inactive and checkin expired by >65s, trigger overdue alert
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const active = checkins.find(c => c.status === 'ACTIVE');
      if (active) {
        const exp = new Date(active.expiresAt).getTime();
        if (now - exp > 65000 && !active.overdueAlertSent) {
          triggerCheckinOverdueAlertAction(active.id);
        }
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [checkins, triggerCheckinOverdueAlertAction]);

  // Incidents
  const addIncident = useCallback((incidentData: Omit<IncidentRecord, 'id' | 'timestamp'>): string => {
    const id = generateId('inc');
    const timestamp = new Date().toISOString();
    const newIncident: IncidentRecord = {
      ...incidentData,
      id,
      timestamp
    };
    setIncidents(prev => [newIncident, ...prev]);
    logAudit('Incident Logged', `Category: ${incidentData.category}. Severity: ${incidentData.severity}`);
    return id;
  }, []);

  const deleteIncident = useCallback((id: string) => {
    setIncidents(prev => prev.filter(i => i.id !== id));
    logAudit('Incident Deleted', `Removed incident record ${id}`);
  }, []);

  // Evidence
  const addEvidence = useCallback(async (
    file: File,
    description: string,
    incidentId?: string,
    tags: string[] = []
  ): Promise<EvidenceItem> => {
    const hash = await calculateSHA256(file);
    const id = generateId('ev');
    
    // Create preview data url if image/text
    let dataUrl: string | undefined;
    if (file.type.startsWith('image/')) {
      dataUrl = URL.createObjectURL(file);
    }

    const newItem: EvidenceItem = {
      id,
      incidentId,
      filename: file.name,
      fileType: file.type || 'application/octet-stream',
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      sha256Hash: hash,
      description,
      tags: tags.length ? tags : ['evidence'],
      isEncrypted: true,
      dataUrl
    };

    setEvidence(prev => [newItem, ...prev]);
    if (incidentId) {
      setIncidents(prev => prev.map(inc => {
        if (inc.id === incidentId) {
          return { ...inc, evidenceIds: [...(inc.evidenceIds || []), id] };
        }
        return inc;
      }));
    }

    logAudit('Evidence Preserved', `File "${file.name}" indexed with SHA-256: ${hash.slice(0, 16)}...`);
    return newItem;
  }, []);

  const deleteEvidence = useCallback((id: string) => {
    setEvidence(prev => prev.filter(e => e.id !== id));
    logAudit('Evidence Removed', `Deleted evidence item ${id}`);
  }, []);

  // Safety Plan
  const toggleSafetyPlanItem = useCallback((id: string) => {
    setSafetyPlan(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
  }, []);

  const addSafetyPlanItem = useCallback((itemData: Omit<SafetyPlanItem, 'id' | 'isCompleted'>) => {
    const newItem: SafetyPlanItem = {
      ...itemData,
      id: generateId('sp_item'),
      isCompleted: false
    };
    setSafetyPlan(prev => [...prev, newItem]);
  }, []);

  // Safe Places
  const addSafePlace = useCallback((placeData: Omit<SafePlace, 'id'>) => {
    const newPlace: SafePlace = {
      ...placeData,
      id: generateId('sp')
    };
    setSafePlaces(prev => [...prev, newPlace]);
    logAudit('Safe Place Added', `Registered refuge: ${placeData.name}`);
  }, []);

  const deleteSafePlace = useCallback((id: string) => {
    setSafePlaces(prev => prev.filter(p => p.id !== id));
  }, []);

  // Risk Assessment
  const saveRiskResult = useCallback((result: RiskAssessmentResult) => {
    setLatestRiskResult(result);
    logAudit('Risk Assessment Completed', `Score: ${result.score}/100. Category: ${result.primaryCategory}`);
  }, []);

  // Demo Walkthrough Scenario Loader
  const loadDemoScenario = useCallback((scenarioId: string) => {
    const scenario = demoScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    setActiveDemoScenarioId(scenario.id);
    setIncidents(scenario.incidents);
    setEvidence(scenario.evidence);
    setLatestRiskResult(scenario.riskResult);

    if (scenario.id === 'scenario_emergency') {
      // Trigger live simulated SOS
      startSOS(false, 'Demo walkthrough of active emergency scenario.');
    } else {
      setCurrentPage('home');
    }

    logAudit('Demo Scenario Loaded', `Loaded simulation: ${scenario.title}`);
  }, [startSOS]);

  const resetToDefaultData = useCallback(() => {
    wipeAllLocalData();
    const fresh = loadAllState();
    setProfile(fresh.profile);
    setContacts(fresh.contacts);
    setIncidents(fresh.incidents);
    setEvidence(fresh.evidence);
    setCheckins(fresh.checkins);
    setSafePlaces(fresh.safePlaces);
    setSafetyPlan(fresh.safetyPlan);
    setLatestRiskResult(fresh.latestRiskResult);
    setEmergencyEvents([]);
    setActiveSOS(null);
    setSosDispatchResult(null);
    setActiveDemoScenarioId(null);
    setCurrentPage('home');
    logAudit('Database Reset', 'Restored pristine factory settings and verified references.');
  }, []);

  return (
    <AegisContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isDisguised,
        setIsDisguised,
        activeDemoScenarioId,
        profile,
        contacts,
        incidents,
        evidence,
        checkins,
        safePlaces,
        safetyPlan,
        latestRiskResult,
        emergencyEvents,
        auditLogs,
        activeSOS,
        sosDispatchResult,
        sosCountdown,
        initiateSOSCountdown,
        cancelSOSCountdown,
        executeSOSImmediate,
        startSOS,
        resolveSOS,
        updateProfile,
        setLanguage,
        setUserRole,
        addContact,
        updateContact,
        deleteContact,
        testContactNotification,
        createCheckin,
        extendCheckin,
        resolveCheckinSafe,
        endCheckinWithoutAlert,
        triggerCheckinHelp,
        triggerCheckinOverdueAlertAction,
        cancelCheckinAlert,
        addIncident,
        deleteIncident,
        addEvidence,
        deleteEvidence,
        toggleSafetyPlanItem,
        addSafetyPlanItem,
        addSafePlace,
        deleteSafePlace,
        saveRiskResult,
        loadDemoScenario,
        resetToDefaultData
      }}
    >
      {children}
    </AegisContext.Provider>
  );
};

export function useAegis() {
  const ctx = useContext(AegisContext);
  if (!ctx) {
    throw new Error('useAegis must be used within an AegisProvider');
  }
  return ctx;
}
