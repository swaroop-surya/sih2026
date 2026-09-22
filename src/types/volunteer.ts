export type VolunteerHelpType =
  | 'accompany_call'
  | 'meet_walk'
  | 'local_guidance'
  | 'emergency_backup';

export type VolunteerScheduleSlot =
  | 'weekday_morning'
  | 'weekday_afternoon'
  | 'weekday_evening'
  | 'weekday_night'
  | 'weekend_morning'
  | 'weekend_afternoon'
  | 'weekend_evening'
  | 'weekend_night';

export interface Volunteer {
  userId: string;
  alias: string;
  areas: string[]; // geohash-5 IDs
  helpTypes: VolunteerHelpType[];
  note?: string | null;
  showPhone: boolean;
  phoneDisplay?: string | null;
  available: boolean;
  availabilitySlots?: VolunteerScheduleSlot[];
  lastConfirmedAt: string; // ISO 8601 string
  createdAt: string;
  isSample?: boolean;
  reportCount?: number;
  hidden?: boolean;
  approxCoords?: { lat: number; lng: number };
}

export interface DirectThread {
  id: string;
  userA: string;
  userB: string;
  createdAt: string;
  lastMessageAt?: string;
  otherAlias?: string;
}

export interface DirectMessage {
  id: string;
  threadId: string;
  authorId: string;
  authorAlias?: string;
  body: string;
  createdAt: string;
  isSample?: boolean;
}

export interface VolunteerReport {
  volunteerId: string;
  reporterId: string;
  reason: string;
  createdAt: string;
}
