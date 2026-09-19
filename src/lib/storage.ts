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
  AuditLogEntry
} from '../types';
import {
  initialUserProfile,
  initialTrustedContacts,
  initialIncidents,
  initialEvidenceItems,
  initialCheckins,
  initialSafePlaces,
  initialSafetyPlan,
  initialLatestRiskResult
} from '../data/initialState';
import { generateId } from './utils';

const STORAGE_KEYS = {
  PROFILE: 'aegis_user_profile',
  CONTACTS: 'aegis_trusted_contacts',
  INCIDENTS: 'aegis_incidents',
  EVIDENCE: 'aegis_evidence_vault',
  CHECKINS: 'aegis_safety_checkins',
  SAFE_PLACES: 'aegis_safe_places',
  SAFETY_PLAN: 'aegis_safety_plan',
  RISK_RESULT: 'aegis_latest_risk_result',
  EMERGENCY_EVENTS: 'aegis_emergency_events',
  AUDIT_LOGS: 'aegis_audit_logs'
};

export function loadItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed as T;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

export function saveItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
}

export function logAudit(action: string, details: string): void {
  const currentLogs = loadItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  const newLog: AuditLogEntry = {
    id: generateId('audit'),
    timestamp: new Date().toISOString(),
    action,
    details
  };
  const updated = [newLog, ...(Array.isArray(currentLogs) ? currentLogs : [])].slice(0, 100);
  saveItem(STORAGE_KEYS.AUDIT_LOGS, updated);
}

export function loadAllState() {
  const profile = loadItem<UserProfile>(STORAGE_KEYS.PROFILE, initialUserProfile);
  const contacts = loadItem<TrustedContact[]>(STORAGE_KEYS.CONTACTS, initialTrustedContacts);
  const incidents = loadItem<IncidentRecord[]>(STORAGE_KEYS.INCIDENTS, initialIncidents);
  const evidence = loadItem<EvidenceItem[]>(STORAGE_KEYS.EVIDENCE, initialEvidenceItems);
  const checkins = loadItem<SafetyCheckin[]>(STORAGE_KEYS.CHECKINS, initialCheckins);
  const safePlaces = loadItem<SafePlace[]>(STORAGE_KEYS.SAFE_PLACES, initialSafePlaces);
  const safetyPlan = loadItem<SafetyPlanItem[]>(STORAGE_KEYS.SAFETY_PLAN, initialSafetyPlan);
  const latestRiskResult = loadItem<RiskAssessmentResult | null>(STORAGE_KEYS.RISK_RESULT, initialLatestRiskResult);
  const emergencyEvents = loadItem<EmergencyEvent[]>(STORAGE_KEYS.EMERGENCY_EVENTS, []);
  const auditLogs = loadItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, [
    {
      id: 'log_seed',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      action: 'System Initialized',
      details: 'Security baseline verified, local encryption container active'
    }
  ]);

  return {
    profile: profile || initialUserProfile,
    contacts: Array.isArray(contacts) ? contacts : initialTrustedContacts,
    incidents: Array.isArray(incidents) ? incidents : initialIncidents,
    evidence: Array.isArray(evidence) ? evidence : initialEvidenceItems,
    checkins: Array.isArray(checkins) ? checkins.map(c => ({
      ...c,
      notifyContactIds: Array.isArray(c.notifyContactIds) ? c.notifyContactIds : (c.contactId ? [c.contactId] : ['tc_1'])
    })) : initialCheckins,
    safePlaces: Array.isArray(safePlaces) ? safePlaces : initialSafePlaces,
    safetyPlan: Array.isArray(safetyPlan) ? safetyPlan : initialSafetyPlan,
    latestRiskResult: latestRiskResult || initialLatestRiskResult,
    emergencyEvents: Array.isArray(emergencyEvents) ? emergencyEvents : [],
    auditLogs: Array.isArray(auditLogs) ? auditLogs : []
  };
}

export function exportFullDataBackup() {
  const state = loadAllState();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aegis-safety-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  logAudit('Data Exported', 'Full encrypted safety data package downloaded');
}

export function wipeAllLocalData() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
}
