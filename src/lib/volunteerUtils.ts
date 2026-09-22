import React from 'react';
import { PhoneCall, Footprints, Compass, ShieldAlert } from 'lucide-react';
import { VolunteerHelpType, VolunteerScheduleSlot } from '../types/volunteer';

export interface HelpTypeMeta {
  key: VolunteerHelpType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const VOLUNTEER_HELP_TYPES: HelpTypeMeta[] = [
  {
    key: 'meet_walk',
    label: 'Meet and walk with me',
    description: 'Accompany on foot near transit, bus stops, or dark stretches.',
    icon: Footprints,
    color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    key: 'accompany_call',
    label: 'Accompany me on a call',
    description: 'Stay on voice call during your commute until you reach home safely.',
    icon: PhoneCall,
    color: 'text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 border-indigo-500/20'
  },
  {
    key: 'local_guidance',
    label: 'Local guidance',
    description: 'Provide information on well-lit paths, open stores, and safe transit routes.',
    icon: Compass,
    color: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20'
  },
  {
    key: 'emergency_backup',
    label: 'Emergency contact backup',
    description: 'Stand by as a local community member if you encounter distress.',
    icon: ShieldAlert,
    color: 'text-rose-700 dark:text-rose-300 bg-rose-500/10 border-rose-500/20'
  }
];

export function getHelpTypeMeta(key: VolunteerHelpType): HelpTypeMeta {
  const found = VOLUNTEER_HELP_TYPES.find((t) => t.key === key);
  return (
    found || {
      key,
      label: key,
      description: '',
      icon: Compass,
      color: 'text-[var(--text)] bg-[var(--surface-2)] border-[var(--line)]'
    }
  );
}

export const VOLUNTEER_SCHEDULE_SLOTS: { key: VolunteerScheduleSlot; label: string; period: string }[] = [
  { key: 'weekday_morning', label: 'Weekday Morning', period: '6 AM - 12 PM' },
  { key: 'weekday_afternoon', label: 'Weekday Afternoon', period: '12 PM - 5 PM' },
  { key: 'weekday_evening', label: 'Weekday Evening', period: '5 PM - 9 PM' },
  { key: 'weekday_night', label: 'Weekday Night', period: '9 PM - 12 AM' },
  { key: 'weekend_morning', label: 'Weekend Morning', period: '6 AM - 12 PM' },
  { key: 'weekend_afternoon', label: 'Weekend Afternoon', period: '12 PM - 5 PM' },
  { key: 'weekend_evening', label: 'Weekend Evening', period: '5 PM - 9 PM' },
  { key: 'weekend_night', label: 'Weekend Night', period: '9 PM - 12 AM' }
];
