import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

// Sanitize Supabase URL: remove trailing slashes, accidental /rest/v1 or /auth/v1 paths, and wrapping quotes
export function sanitizeSupabaseUrl(raw: string): string {
  if (!raw) return '';
  let url = raw.trim().replace(/^["']|["']$/g, '');
  // Remove trailing slashes
  url = url.replace(/\/+$/, '');
  // If user pasted API path from Supabase dashboard (e.g., /rest/v1 or /auth/v1)
  url = url.replace(/\/rest\/v1\/?$/i, '');
  url = url.replace(/\/auth\/v1\/?$/i, '');
  return url.trim();
}

// Environment variables
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = sanitizeSupabaseUrl(rawSupabaseUrl);
const supabaseAnonKey = (rawSupabaseAnonKey || '').trim().replace(/^["']|["']$/g, '');

export const DEMO_PHONE = (import.meta.env.VITE_DEMO_PHONE || '9876543210').replace(/\D/g, '').slice(-10);
export const DEMO_OTP = (import.meta.env.VITE_DEMO_OTP || '123456').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

// Real client when configured
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export interface CommunityProfile {
  id: string;
  alias: string;
  first_name?: string | null;
  language: string;
  onboarded: boolean;
  created_at?: string;
}

// Phone number validator: Indian 10-digit starting with 6-9
export function validateIndianPhone(digitsOnly: string): boolean {
  return /^[6-9]\d{9}$/.test(digitsOnly);
}

// Email validator
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
}

// Safe masking helper: Never exposes full phone or email
export function maskContact(target: string, type: 'phone' | 'email'): string {
  if (!target) return '';
  if (type === 'phone') {
    const clean = target.replace(/\D/g, '');
    const ten = clean.slice(-10);
    if (ten.length === 10) {
      // "+91 98••• ••334" format
      return `+91 ${ten.slice(0, 2)}••• ••${ten.slice(7)}`;
    }
    return '+91 ••••• •••••';
  } else {
    const clean = target.trim().toLowerCase();
    const parts = clean.split('@');
    if (parts.length === 2) {
      const user = parts[0];
      const domain = parts[1];
      const firstChar = user.charAt(0) || 'u';
      return `${firstChar}••••@${domain}`;
    }
    return '••••@••••.com';
  }
}
