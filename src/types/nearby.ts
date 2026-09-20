export type NearbyKind = 'chat' | 'alert' | 'system';

export type NearbyAlertCategory =
  | 'no_street_light'
  | 'dark_unsafe_stretch'
  | 'suspicious_activity'
  | 'harassment'
  | 'crowd_eve_teasing'
  | 'road_blocked'
  | 'unsafe_transport'
  | 'police_patrol_here'
  | 'safe_spot';

export interface NearbyArea {
  id: string; // geohash 5 chars (~5km x 5km)
  name: string;
  center_lat: number;
  center_lng: number;
  sw_label?: string | null;
  ne_label?: string | null;
  created_at?: string;
}

export interface NearbyMessage {
  id: string;
  area_id: string;
  author_id: string;
  author_alias: string;
  kind: NearbyKind;
  category?: NearbyAlertCategory | null;
  body: string;
  pin_geohash?: string | null; // 7 chars (~150m)
  confirm_count: number;
  fixed_count: number;
  report_count: number;
  hidden: boolean;
  created_at: string;
  isSample?: boolean;
  userConfirmed?: boolean;
  userFixed?: boolean;
}

export interface NearbyBlock {
  blocker_id: string;
  blocked_id: string;
}

export interface NearbyConfirmation {
  message_id: string;
  user_id: string;
  kind: 'confirm' | 'fixed';
}
