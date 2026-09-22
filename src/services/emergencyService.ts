import { EmergencyEvent, TrustedContact, SafetyCheckin } from '../types';
import { generateId } from '../lib/utils';
import { logAudit } from '../lib/storage';
import { getCachedLocation } from './locationService';

export interface SOSDispatchResult {
  event: EmergencyEvent;
  contactNotifications: Array<{
    contactId: string;
    contactName: string;
    phone: string;
    status: 'SENT' | 'DELIVERED' | 'FAILED';
    messagePreview: string;
  }>;
}

export async function getCurrentCoordinates(): Promise<{
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  addressText: string;
}> {
  const cached = getCachedLocation();
  const fallback = cached || {
    latitude: 12.9279,
    longitude: 77.6741,
    accuracyMeters: 20,
    addressText: 'Outer Ring Rd, Bellandur, Bengaluru 560103'
  };

  return new Promise((resolve) => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: Number(pos.coords.latitude.toFixed(5)),
            longitude: Number(pos.coords.longitude.toFixed(5)),
            accuracyMeters: Math.round(pos.coords.accuracy || 15),
            addressText: `Live GPS: ${Number(pos.coords.latitude.toFixed(4))}, ${Number(pos.coords.longitude.toFixed(4))} (±${Math.round(pos.coords.accuracy || 15)}m)`
          });
        },
        () => {
          // If high accuracy failed or permission denied, try quick coarse location
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              resolve({
                latitude: Number(pos.coords.latitude.toFixed(5)),
                longitude: Number(pos.coords.longitude.toFixed(5)),
                accuracyMeters: Math.round(pos.coords.accuracy || 45),
                addressText: `Cell/Network GPS: ${Number(pos.coords.latitude.toFixed(4))}, ${Number(pos.coords.longitude.toFixed(4))}`
              });
            },
            () => {
              // Graceful fallback to user-cached or metropolitan coordinates so SOS never halts
              resolve(fallback);
            },
            { timeout: 3000, enableHighAccuracy: false }
          );
        },
        { timeout: 4000, enableHighAccuracy: true }
      );
    } else {
      resolve(fallback);
    }
  });
}

/**
 * Triggers the Aegis emergency sequence:
 * 1. Obtains location
 * 2. Generates incident event
 * 3. Simulates dispatch to configured trusted contacts
 * 4. Logs audit entry
 */
export async function triggerEmergencySOS(
  isSilent: boolean = false,
  contacts: TrustedContact[],
  customMessage?: string
): Promise<SOSDispatchResult> {
  const loc = await getCurrentCoordinates();
  const notifyableContacts = contacts.filter(c => c.notifyOnSOS);

  const event: EmergencyEvent = {
    id: generateId('sos'),
    startedAt: new Date().toISOString(),
    status: 'ACTIVE',
    isSilent,
    location: loc,
    notifiedContactIds: notifyableContacts.map(c => c.id),
    dispatchedToServices: false,
    serviceType: '112 National Emergency Readiness (Simulated Gateway)',
    notes: customMessage || (isSilent ? 'Discreet silent SOS activated by user' : 'Standard Emergency SOS triggered')
  };

  const contactNotifications = notifyableContacts.map(contact => {
    const mapsLink = `https://maps.google.com/?q=${loc.latitude},${loc.longitude}`;
    const text = `[AEGIS SAFETY ALERT] Urgent: Ananya has activated ${isSilent ? 'SILENT SOS' : 'EMERGENCY SOS'} at ${new Date().toLocaleTimeString('en-IN')}. Location: ${loc.addressText} (${mapsLink}). Reach immediately or call 112.`;

    return {
      contactId: contact.id,
      contactName: contact.name,
      phone: contact.phone,
      status: 'SENT' as const,
      messagePreview: text
    };
  });

  logAudit(
    isSilent ? 'Silent SOS Triggered' : 'Emergency SOS Triggered',
    `Location: ${loc.latitude}, ${loc.longitude}. Notified ${notifyableContacts.length} trusted contacts.`
  );

  return {
    event,
    contactNotifications
  };
}

/**
 * Mock connector to 112 India National Emergency Response Support System (ERSS)
 * Ready for future production REST webhook / CAD integration
 */
export async function connectToEmergencyServices112(event: EmergencyEvent): Promise<{
  success: boolean;
  cadTicketNumber: string;
  dispatchNote: string;
}> {
  // Simulated CAD gateway response
  return {
    success: true,
    cadTicketNumber: `ERSS-112-KA-${Date.now().toString().slice(-6)}`,
    dispatchNote: 'Ready for official 112 ERSS API dispatch. In actual emergencies, direct dial 112.'
  };
}

/**
 * Triggers the automated Overdue Check-in alert pipeline:
 * Sends alert to selected trusted contacts with purpose, note, location, and time.
 * Logs to SMS dispatch log and audit log.
 */
export async function triggerOverdueCheckinAlert(
  checkin: SafetyCheckin,
  contacts: TrustedContact[],
  userName: string = 'Ananya'
): Promise<SOSDispatchResult> {
  const loc = await getCurrentCoordinates();
  const targetIds = checkin.notifyContactIds && checkin.notifyContactIds.length > 0
    ? checkin.notifyContactIds
    : contacts.filter(c => c.notifyOnCheckinMiss).map(c => c.id);

  const notifyableContacts = contacts.filter(c => targetIds.includes(c.id));
  const effectiveContacts = notifyableContacts.length > 0
    ? notifyableContacts
    : (contacts.length > 0 ? [contacts[0]] : []);

  const event: EmergencyEvent = {
    id: generateId('sos_chk'),
    startedAt: new Date().toISOString(),
    status: 'ACTIVE',
    isSilent: false,
    location: loc,
    notifiedContactIds: effectiveContacts.map(c => c.id),
    dispatchedToServices: false,
    serviceType: 'Automated Overdue Check-in Dispatch',
    notes: `Overdue check-in for "${checkin.purpose}". ${checkin.note ? 'Note: ' + checkin.note : ''} Last location: ${loc.addressText}`
  };

  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const mapsLink = `https://maps.google.com/?q=${loc.latitude},${loc.longitude}`;
  const noteInfo = checkin.note ? ` (Note: ${checkin.note})` : '';

  const contactNotifications = effectiveContacts.map(contact => {
    const text = `[ABHAYA SAFETY ALERT] Overdue Check-in: ${userName} did not check in as scheduled for "${checkin.purpose}"${noteInfo} at ${timeStr}. Last known location: ${loc.addressText} (${mapsLink}). Reach immediately or call 112.`;

    return {
      contactId: contact.id,
      contactName: contact.name,
      phone: contact.phone,
      status: 'SENT' as const,
      messagePreview: text
    };
  });

  logAudit(
    'Overdue Check-in Alert Dispatched',
    `Check-in for "${checkin.purpose}" expired with no response. Alert sent to ${effectiveContacts.length} contacts.`
  );

  return {
    event,
    contactNotifications
  };
}

/**
 * Simulates dispatching a "safe" notification if the user enabled "Tell my contacts when I'm safe"
 */
export function simulateSafeCheckinNotification(
  checkin: SafetyCheckin,
  contacts: TrustedContact[],
  userName: string = 'Ananya'
): Array<{
  contactId: string;
  contactName: string;
  phone: string;
  status: 'SENT';
  messagePreview: string;
}> {
  const targetIds = checkin.notifyContactIds && checkin.notifyContactIds.length > 0
    ? checkin.notifyContactIds
    : contacts.filter(c => c.notifyOnCheckinMiss).map(c => c.id);

  const notifyableContacts = contacts.filter(c => targetIds.includes(c.id));
  const effectiveContacts = notifyableContacts.length > 0
    ? notifyableContacts
    : (contacts.length > 0 ? [contacts[0]] : []);

  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return effectiveContacts.map(contact => ({
    contactId: contact.id,
    contactName: contact.name,
    phone: contact.phone,
    status: 'SENT' as const,
    messagePreview: `[ABHAYA] Safe Check-in: ${userName} has arrived safely and closed their check-in for "${checkin.purpose}" at ${timeStr}.`
  }));
}
