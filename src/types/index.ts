export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type UserRole = 'USER' | 'RESPONDER' | 'ADMIN';

export type SupportedLanguage = 'en' | 'te' | 'hi' | 'ta';

export type AppTheme = 'light' | 'dark' | 'system';

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: UserRole;
  isOnboarded: boolean;
  discreetMode: boolean;
  neutralTerminology: boolean;
  language: SupportedLanguage;
  theme?: AppTheme;
  showDemoTools?: boolean;
  continuousLocationSharing: boolean;
  pinProtectedVault: boolean;
  autoDeleteEvidenceDays: number;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  priority: number; // 1 = highest
  notifyOnSOS: boolean;
  notifyOnCheckinMiss: boolean;
  lastTestNotification?: string;
}

export type IncidentCategory =
  | 'harassment'
  | 'stalking'
  | 'unsafe_path'
  | 'domestic_violence'
  | 'sexual_harassment'
  | 'cyber_abuse'
  | 'blackmail'
  | 'trafficking_exploitation'
  | 'workplace_incident'
  | 'other';

export interface IncidentRecord {
  id: string;
  timestamp: string; // ISO date
  date: string;
  time: string;
  category: IncidentCategory;
  severity: 1 | 2 | 3 | 4 | 5;
  location: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  description: string;
  peopleInvolved?: string | string[];
  witnesses?: string | string[];
  impact?: string;
  evidenceIds: string[];
  notes?: string;
  reportedToPolice?: boolean;
}

export interface EvidenceItem {
  id: string;
  incidentId?: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  sha256Hash: string;
  description: string;
  tags?: string[];
  isEncrypted?: boolean;
  dataUrl?: string; // Client preview placeholder or actual blob url
}

export interface SafetyCheckin {
  id: string;
  purpose: string;
  destination: string;
  expectedArrivalTime: string;
  durationMinutes: number;
  startedAt: string;
  expiresAt: string;
  contactId?: string;
  notifyContactIds?: string[];
  status: 'ACTIVE' | 'SAFE' | 'EXPIRED' | 'HELP_REQUESTED';
  isRecurring: boolean;
  note?: string;
  shareLocation?: boolean;
  notifyWhenSafe?: boolean;
  graceExpiresAt?: string;
  overdueAlertSent?: boolean;
}

export type SafePlaceType =
  | 'HOME'
  | 'COLLEGE'
  | 'WORK'
  | 'HOSTEL'
  | 'POLICE_STATION'
  | 'SAKHI_CENTRE'
  | 'ONE_STOP_CENTRE'
  | 'OTHER';

export interface SafePlace {
  id: string;
  name: string;
  type: SafePlaceType;
  address: string;
  contactPhone?: string;
  contactNumber?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
}

export type SafetyPlanSection =
  | 'DOCUMENTS'
  | 'CONTACTS'
  | 'TRANSPORT'
  | 'SAFE_PLACES'
  | 'MEDICAL'
  | 'DEPENDENTS'
  | 'EXIT_BAG'
  | 'EXIT_PLAN';

export interface SafetyPlanItem {
  id: string;
  section?: SafetyPlanSection;
  category?: SafetyPlanSection;
  title: string;
  detail?: string;
  isCompleted: boolean;
}

export interface EmergencyEvent {
  id: string;
  startedAt: string;
  resolvedAt?: string;
  status: 'ACTIVE' | 'RESOLVED' | 'CANCELLED';
  isSilent: boolean;
  location: {
    latitude: number;
    longitude: number;
    addressText: string;
    accuracyMeters: number;
  };
  notifiedContactIds: string[];
  dispatchedToServices: boolean;
  serviceType?: string;
  notes?: string;
  resolutionReason?: string;
}

export type RiskCategory = string;

export interface RiskAssessmentAnswer {
  questionId: string;
  category: string;
  indicatorText: string;
  weight: number;
  selected: boolean;
}

export interface RiskAssessmentResult {
  id: string;
  completedAt: string;
  score: number; // 0 - 100
  level: RiskLevel;
  primaryCategory: string;
  detectedIndicators: string[];
  explanation: string;
  recommendedSteps: string[];
  recommendations?: string[];
}

export type ResourceCategory =
  | 'EMERGENCY'
  | 'HELPLINE'
  | 'LEGAL'
  | 'SHELTER'
  | 'MENTAL_HEALTH'
  | 'CYBER'
  | 'immediate_danger'
  | 'domestic_violence'
  | 'sexual_violence'
  | 'human_trafficking'
  | 'cybercrime'
  | 'child_safety'
  | 'legal_support'
  | 'medical_support'
  | 'mental_health'
  | 'one_stop_centre';

export interface SafetyResource {
  id: string;
  name: string;
  category: ResourceCategory;
  phone: string;
  state: string;
  is24x7: boolean;
  description: string;
  whatToExpect?: string;
  website?: string;
}

export type SupportResource = SafetyResource;

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  ipPlaceholder?: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  category: IncidentCategory;
  summary: string;
  description?: string;
  riskLevel: RiskLevel;
  incidents: IncidentRecord[];
  evidence: EvidenceItem[];
  riskResult: RiskAssessmentResult;
}
