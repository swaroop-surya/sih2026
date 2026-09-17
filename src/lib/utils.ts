import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoDateString: string): string {
  try {
    const d = new Date(isoDateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return isoDateString;
  }
}

export function formatDateTime(isoDateString: string): string {
  try {
    const d = new Date(isoDateString);
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoDateString;
  }
}

export function formatTimeOnly(isoOrTimeString: string): string {
  try {
    if (isoOrTimeString.includes('T')) {
      const d = new Date(isoOrTimeString);
      return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return isoOrTimeString;
  } catch {
    return isoOrTimeString;
  }
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatTimeRemaining(expiresAtIso: string): string {
  try {
    const diff = new Date(expiresAtIso).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const totalMinutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m remaining`;
    }
    return `${mins} min remaining`;
  } catch {
    return 'Active';
  }
}

export function generateId(prefix: string = 'aegis'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}
