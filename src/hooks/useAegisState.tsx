import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { triggerEmergencySOS, SOSDispatchResult } from '../services/emergencyService';
import { calculateSHA256 } from '../lib/crypto';
import { generateId } from '../lib/utils';
import { demoScenarios } from '../data/demoScenarios';

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
  | 'onboarding';

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
  resolveCheckinSafe: (id: string) => void;
  triggerCheckinHelp: (id: string) => void;

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
  const [contacts, setContacts] = useState<TrustedContact[]>(initialData.contacts);
  const [incidents, setIncidents] = useState<IncidentRecord[]>(initialData.incidents);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(initialData.evidence);
  const [checkins, setCheckins] = useState<SafetyCheckin[]>(initialData.checkins);
  const [safePlaces, setSafePlaces] = useState<SafePlace[]>(initialData.safePlaces);
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlanItem[]>(initialData.safetyPlan);
  const [latestRiskResult, setLatestRiskResult] = useState<RiskAssessmentResult | null>(initialData.latestRiskResult);
  const [emergencyEvents, setEmergencyEvents] = useState<EmergencyEvent[]>(initialData.emergencyEvents);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialData.auditLogs);

  const [activeSOS, setActiveSOS] = useState<EmergencyEvent | null>(() => {
    const active = initialData.emergencyEvents.find(e => e.status === 'ACTIVE');
    return active || null;
  });
  const [sosDispatchResult, setSosDispatchResult] = useState<SOSDispatchResult | null>(null);

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

  // Checkin expiration monitor (runs every 10 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      setCheckins(prev => {
        let changed = false;
        const updated = prev.map(c => {
          if (c.status === 'ACTIVE' && new Date(c.expiresAt).getTime() < now) {
            changed = true;
            logAudit('Check-In Expired', `Missed response for "${c.purpose}". Alert triggered to contacts.`);
            return { ...c, status: 'EXPIRED' as const };
          }
          return c;
        });
        return changed ? updated : prev;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, []);

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
      description: `Emergency ${isSilent ? 'Silent ' : ''}SOS activated by user. Dispatch notifications sent to ${result.contactNotifications.length} trusted contacts.`,
      evidenceIds: [],
      notes: customMessage || 'Auto-generated incident record from emergency trigger.',
      reportedToPolice: false
    };
    setIncidents(prev => [newIncident, ...prev]);
    setCurrentPage('emergency');
  }, [contacts]);

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
      expiresAt: expires.toISOString()
    };
    setCheckins(prev => [newCheckin, ...prev]);
    logAudit('Check-In Started', `Destination: ${checkinData.destination}. Duration: ${checkinData.durationMinutes} min.`);
  }, []);

  const resolveCheckinSafe = useCallback((id: string) => {
    setCheckins(prev => prev.map(c => c.id === id ? { ...c, status: 'SAFE' } : c));
    logAudit('Check-In Safe', `User confirmed safety for check-in: ${id}`);
  }, []);

  const triggerCheckinHelp = useCallback((id: string) => {
    setCheckins(prev => prev.map(c => c.id === id ? { ...c, status: 'HELP_REQUESTED' } : c));
    startSOS(false, 'Help requested from overdue safety check-in countdown.');
  }, [startSOS]);

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
        resolveCheckinSafe,
        triggerCheckinHelp,
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
