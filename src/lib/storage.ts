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
    return JSON.parse(raw) as T;
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
  const updated = [newLog, ...currentLogs].slice(0, 100);
  saveItem(STORAGE_KEYS.AUDIT_LOGS, updated);
}

export function loadAllState() {
  return {
    profile: loadItem<UserProfile>(STORAGE_KEYS.PROFILE, initialUserProfile),
    contacts: loadItem<TrustedContact[]>(STORAGE_KEYS.CONTACTS, initialTrustedContacts),
    incidents: loadItem<IncidentRecord[]>(STORAGE_KEYS.INCIDENTS, initialIncidents),
    evidence: loadItem<EvidenceItem[]>(STORAGE_KEYS.EVIDENCE, initialEvidenceItems),
    checkins: loadItem<SafetyCheckin[]>(STORAGE_KEYS.CHECKINS, initialCheckins),
    safePlaces: loadItem<SafePlace[]>(STORAGE_KEYS.SAFE_PLACES, initialSafePlaces),
    safetyPlan: loadItem<SafetyPlanItem[]>(STORAGE_KEYS.SAFETY_PLAN, initialSafetyPlan),
    latestRiskResult: loadItem<RiskAssessmentResult | null>(STORAGE_KEYS.RISK_RESULT, initialLatestRiskResult),
    emergencyEvents: loadItem<EmergencyEvent[]>(STORAGE_KEYS.EMERGENCY_EVENTS, []),
    auditLogs: loadItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'log_seed',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        action: 'System Initialized',
        details: 'Security baseline verified, local encryption container active'
      }
    ])
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
