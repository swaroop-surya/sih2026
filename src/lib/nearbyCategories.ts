import React from 'react';
import {
  ZapOff,
  Moon,
  AlertCircle,
  ShieldAlert,
  Users,
  Ban,
  Bus,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { NearbyAlertCategory } from '../types/nearby';

export interface CategoryMeta {
  key: NearbyAlertCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const NEARBY_CATEGORIES: CategoryMeta[] = [
  {
    key: 'no_street_light',
    label: 'No street light',
    icon: ZapOff,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  },
  {
    key: 'dark_unsafe_stretch',
    label: 'Dark or unsafe stretch',
    icon: Moon,
    color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20'
  },
  {
    key: 'suspicious_activity',
    label: 'Suspicious activity',
    icon: AlertCircle,
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/20'
  },
  {
    key: 'harassment',
    label: 'Harassment',
    icon: ShieldAlert,
    color: 'text-red-500 bg-red-500/10 border-red-500/20'
  },
  {
    key: 'crowd_eve_teasing',
    label: 'Crowd or eve-teasing',
    icon: Users,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
  },
  {
    key: 'road_blocked',
    label: 'Road blocked',
    icon: Ban,
    color: 'text-amber-600 bg-amber-600/10 border-amber-600/20'
  },
  {
    key: 'unsafe_transport',
    label: 'Unsafe transport',
    icon: Bus,
    color: 'text-yellow-600 bg-yellow-600/10 border-yellow-600/20'
  },
  {
    key: 'police_patrol_here',
    label: 'Police patrol here',
    icon: ShieldCheck,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  },
  {
    key: 'safe_spot',
    label: 'Safe spot',
    icon: HeartHandshake,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  }
];

export function getCategoryMeta(key?: NearbyAlertCategory | null): CategoryMeta {
  const found = NEARBY_CATEGORIES.find((c) => c.key === key);
  return (
    found || {
      key: 'suspicious_activity',
      label: 'Safety alert',
      icon: AlertCircle,
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20'
    }
  );
}

export const getAlertCategoryMeta = getCategoryMeta;

// Generate consistent avatar color based on alias string
export function getAliasColor(alias: string): { bg: string; text: string } {
  const colors = [
    { bg: 'bg-emerald-600', text: 'text-white' },
    { bg: 'bg-amber-600', text: 'text-white' },
    { bg: 'bg-teal-600', text: 'text-white' },
    { bg: 'bg-rose-600', text: 'text-white' },
    { bg: 'bg-indigo-600', text: 'text-white' },
    { bg: 'bg-purple-600', text: 'text-white' },
    { bg: 'bg-blue-600', text: 'text-white' },
    { bg: 'bg-orange-600', text: 'text-white' }
  ];

  let hash = 0;
  for (let i = 0; i < alias.length; i++) {
    hash = (hash << 5) - hash + alias.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

// Format relative time: "12 min ago", "2h ago", "1d ago"
export function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const time = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - time) / 1000);

  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}
