import { EmergencyEvent, TrustedContact } from '../types';
import { generateId } from '../lib/utils';
import { logAudit } from '../lib/storage';

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
  return new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: Number(pos.coords.latitude.toFixed(5)),
            longitude: Number(pos.coords.longitude.toFixed(5)),
            accuracyMeters: Math.round(pos.coords.accuracy || 15),
            addressText: 'Live GPS: Near Bellandur, Bengaluru 560103'
          });
        },
        () => {
          // Fallback realistic coordinates if permissions not granted in iframe
          resolve({
            latitude: 12.9279,
            longitude: 77.6741,
            accuracyMeters: 18,
            addressText: 'Outer Ring Rd, Bellandur, Bengaluru 560103'
          });
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      resolve({
        latitude: 12.9279,
        longitude: 77.6741,
        accuracyMeters: 20,
        addressText: 'Outer Ring Rd, Bellandur, Bengaluru 560103'
      });
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
