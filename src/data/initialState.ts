import {
  UserProfile,
  TrustedContact,
  IncidentRecord,
  EvidenceItem,
  SafetyCheckin,
  SafePlace,
  SafetyPlanItem,
  SupportResource,
  RiskAssessmentResult
} from '../types';

export const initialUserProfile: UserProfile = {
  id: 'usr_default_01',
  name: 'Ananya Sharma',
  phone: '+91 98765 43210',
  email: 'ananya.s@example.org',
  role: 'USER',
  isOnboarded: true,
  discreetMode: false,
  neutralTerminology: false,
  language: 'en',
  continuousLocationSharing: false,
  pinProtectedVault: false,
  autoDeleteEvidenceDays: 90
};

export const initialTrustedContacts: TrustedContact[] = [
  {
    id: 'tc_1',
    name: 'Pooja (Sister)',
    relationship: 'Sister',
    phone: '+91 98111 22334',
    email: 'pooja.s@example.com',
    priority: 1,
    notifyOnSOS: true,
    notifyOnCheckinMiss: true
  },
  {
    id: 'tc_2',
    name: 'Meera Deshmukh (Close Friend)',
    relationship: 'Friend',
    phone: '+91 98222 33445',
    email: 'meera.d@example.com',
    priority: 2,
    notifyOnSOS: true,
    notifyOnCheckinMiss: true
  },
  {
    id: 'tc_3',
    name: 'Adv. Ritu Sen (Legal Support)',
    relationship: 'Legal Advocate',
    phone: '+91 98333 44556',
    email: 'adv.ritu@legalcircle.in',
    priority: 3,
    notifyOnSOS: false,
    notifyOnCheckinMiss: false
  }
];

export const initialSafePlaces: SafePlace[] = [
  {
    id: 'sp_1',
    name: 'Home Residence',
    type: 'HOME',
    address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103',
    contactNumber: '+91 98765 43210',
    latitude: 12.9279,
    longitude: 77.6741,
    notes: '24/7 security guard at gate, CCTV covered lobby'
  },
  {
    id: 'sp_2',
    name: 'Office Campus (RMZ Ecospace)',
    type: 'WORK',
    address: 'Campus 2A, Outer Ring Rd, Bellandur, Bengaluru, Karnataka 560103',
    contactNumber: '+91 80 4000 1234',
    latitude: 12.9260,
    longitude: 77.6830,
    notes: 'Security reception with female guard stationed at entrance'
  },
  {
    id: 'sp_3',
    name: 'Sakhi One Stop Centre (Bangalore District Hospital)',
    type: 'ONE_STOP_CENTRE',
    address: 'Lady Curzon Road, Tasker Town, Shivaji Nagar, Bengaluru 560051',
    contactNumber: '080-22860717',
    latitude: 12.9845,
    longitude: 77.6033,
    notes: 'Integrated medical, legal, psychological counseling & temporary shelter for women'
  },
  {
    id: 'sp_4',
    name: 'Women Police Station (Halasuru)',
    type: 'POLICE_STATION',
    address: 'CMH Road, Halasuru, Bengaluru 560008',
    contactNumber: '080-22942544',
    latitude: 12.9754,
    longitude: 77.6258,
    notes: 'Specialized women help desk available 24/7'
  }
];

export const initialSafetyPlan: SafetyPlanItem[] = [
  {
    id: 'sp_doc_1',
    category: 'DOCUMENTS',
    title: 'Copies of Aadhaar, Passport & PAN',
    detail: 'Photocopies and scanned encrypted digital backup stored in Secure Evidence Vault',
    isCompleted: true
  },
  {
    id: 'sp_doc_2',
    category: 'DOCUMENTS',
    title: 'Bank account records & IFSC details in own name',
    detail: 'Ensure bank statements and passwords are accessible solely from a private browser session',
    isCompleted: true
  },
  {
    id: 'sp_contact_1',
    category: 'CONTACTS',
    title: 'Designate primary emergency contact',
    detail: 'Confirmed Sister (Pooja) has emergency key to apartment and Aegis automated alerts',
    isCompleted: true
  },
  {
    id: 'sp_transport_1',
    category: 'TRANSPORT',
    title: 'Emergency transportation fund & spare key',
    detail: 'Keep emergency cash ₹2,000 and spare transit metro card tucked in secure emergency pouch',
    isCompleted: false
  },
  {
    id: 'sp_places_1',
    category: 'SAFE_PLACES',
    title: 'Identify 2 safe refuge spots within 15 min reach',
    detail: 'Nearest One Stop Centre (Sakhi) and 24/7 cafe at RMZ tech park lobby',
    isCompleted: true
  },
  {
    id: 'sp_medical_1',
    category: 'MEDICAL',
    title: 'Prescription medicines and blood group card',
    detail: 'Keep emergency asthma inhaler and copy of medical insurance card accessible',
    isCompleted: false
  },
  {
    id: 'sp_exit_1',
    category: 'EXIT_PLAN',
    title: 'Discreet exit route & packed essential bag',
    detail: 'Keep duplicate phone charger, change of clothing, and trusted emergency phone numbers written on physical paper',
    isCompleted: false
  }
];

export const initialIncidents: IncidentRecord[] = [
  {
    id: 'inc_01',
    timestamp: '2026-09-08T19:45:00.000Z',
    date: '2026-09-08',
    time: '19:45',
    category: 'stalking',
    severity: 3,
    location: 'Metro Station Entry Gate 2, Indiranagar',
    latitude: 12.9784,
    longitude: 77.6408,
    accuracy: 12,
    description: 'Unknown individual in grey windbreaker was waiting near staircase and followed me for 3 blocks towards my residence. Crossed the road twice; person matched pace until I entered a supermarket.',
    peopleInvolved: 'Unidentified male, approx 30-35 yrs, grey windbreaker',
    witnesses: 'Security guard at Nature Basket store',
    evidenceIds: ['ev_01'],
    notes: 'Same individual was seen near my workplace bus stop 3 days earlier. Escalation pattern noted.',
    reportedToPolice: false
  },
  {
    id: 'inc_02',
    timestamp: '2026-09-11T14:20:00.000Z',
    date: '2026-09-11',
    time: '14:20',
    category: 'cyber_abuse',
    severity: 2,
    location: 'Digital / WhatsApp & Telegram',
    latitude: 12.9716,
    longitude: 77.5946,
    accuracy: 35,
    description: 'Received repeated anonymous messages demanding private contact details and threatening to post altered images on social media if not responded within 24 hours.',
    peopleInvolved: 'Unknown phone number +91 99000 11223',
    witnesses: 'None (Digital)',
    evidenceIds: ['ev_02', 'ev_03'],
    notes: 'Blocked number immediately. Exported raw chat screenshot with full phone headers and calculated SHA-256 hash.',
    reportedToPolice: false
  },
  {
    id: 'inc_03',
    timestamp: '2026-09-14T21:15:00.000Z',
    date: '2026-09-14',
    time: '21:15',
    category: 'harassment',
    severity: 4,
    location: '100ft Road Outer Ring Junction, Koramangala 4th Block',
    latitude: 12.9352,
    longitude: 77.6245,
    accuracy: 10,
    description: 'Verbal street catcalling and intimidation by two individuals in parked SUV near dimly lit footpath. Followed along curb while honking continuously.',
    peopleInvolved: 'Two men in dark SUV, partial registration ending in 4102',
    witnesses: 'Pedestrians near tea stall',
    evidenceIds: [],
    notes: 'Poor street lighting area. Noted down plate numbers and altered walking route through commercial boulevard.',
    reportedToPolice: true
  },
  {
    id: 'inc_04',
    timestamp: '2026-09-16T18:30:00.000Z',
    date: '2026-09-16',
    time: '18:30',
    category: 'workplace_incident',
    severity: 3,
    location: 'Tech Hub Boulevard, Whitefield Main Road',
    latitude: 12.9698,
    longitude: 77.7499,
    accuracy: 15,
    description: 'Repeated non-consensual physical encroachment and threatening comments in office parking garage after late project shift.',
    peopleInvolved: 'Senior contractor colleague',
    witnesses: 'Building parking attendee',
    evidenceIds: [],
    notes: 'HR incident report drafted with timestamped badge access logs.',
    reportedToPolice: false
  }
];

export const initialEvidenceItems: EvidenceItem[] = [
  {
    id: 'ev_01',
    incidentId: 'inc_01',
    filename: 'stalker_street_photo_20260908.jpg',
    fileType: 'image/jpeg',
    fileSize: 1420800,
    uploadedAt: '2026-09-08T20:10:00.000Z',
    sha256Hash: '9e8a71c53d9e0ff3128fa16b0df21034ab7c38e9198642a8b9f1d014c2e64ef8',
    description: 'Photo taken from supermarket window showing the individual waiting outside near lamppost.',
    tags: ['stalking', 'street', 'photographic'],
    isEncrypted: true
  },
  {
    id: 'ev_02',
    incidentId: 'inc_02',
    filename: 'whatsapp_blackmail_screenshot_1.png',
    fileType: 'image/png',
    fileSize: 854200,
    uploadedAt: '2026-09-11T14:35:00.000Z',
    sha256Hash: '43b17c91fa0e729a2862c1d8bc983b6728e104f71a9e338166d1f5e82937a01d',
    description: 'Screenshot displaying incoming anonymous threats and visible sender mobile number.',
    tags: ['cyber_abuse', 'blackmail', 'screenshot'],
    isEncrypted: true
  },
  {
    id: 'ev_03',
    incidentId: 'inc_02',
    filename: 'telegram_handle_export.txt',
    fileType: 'text/plain',
    fileSize: 12400,
    uploadedAt: '2026-09-11T14:40:00.000Z',
    sha256Hash: 'fa50b69107cc623dfd89e5a1b329c0175b98aa38012bcfe1431e78a631f41d99',
    description: 'Exported metadata and user ID profile link from suspected burner account.',
    tags: ['digital_footprint', 'metadata'],
    isEncrypted: true
  }
];

export const initialCheckins: SafetyCheckin[] = [
  {
    id: 'chk_demo',
    purpose: 'Evening Cab Commute from Office',
    destination: 'Home Residence, Bellandur',
    expectedArrivalTime: '2026-09-13T20:30:00.000Z',
    durationMinutes: 45,
    startedAt: '2026-09-13T19:45:00.000Z',
    expiresAt: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    contactId: 'tc_1',
    status: 'ACTIVE',
    isRecurring: false
  }
];

export const initialVerifiedResources: SupportResource[] = [
  {
    id: 'res_112',
    name: '112 India National Emergency Service',
    category: 'EMERGENCY',
    phone: '112',
    state: 'ALL',
    is24x7: true,
    website: 'https://112.gov.in',
    description: 'Pan-India single emergency response support system (ERSS) for immediate police dispatch, medical ambulance, and fire rescue.',
    whatToExpect: 'Operator answers within seconds. State your current landmark/location first, then brief the emergency. A PCR van will be dispatched.'
  },
  {
    id: 'res_181',
    name: '181 Women Helpline',
    category: 'HELPLINE',
    phone: '181',
    state: 'ALL',
    is24x7: true,
    website: 'https://wcd.nic.in',
    description: 'Toll-free 24/7 confidential helpline for women affected by violence, harassment, or domestic abuse in private or public spaces.',
    whatToExpect: 'Trained female counselors provide immediate crisis counseling, refer you to nearest One Stop Sakhi Centre, and coordinate police protection.'
  },
  {
    id: 'res_1930',
    name: 'National Cyber Crime Reporting Portal & Helpline',
    category: 'CYBER',
    phone: '1930',
    state: 'ALL',
    is24x7: true,
    website: 'https://cybercrime.gov.in',
    description: 'Official Ministry of Home Affairs cyber helpline for financial frauds, online stalking, doxxing, and non-consensual image blackmail.',
    whatToExpect: 'Prompt options for financial fraud vs cyber harassment. Provide suspect phone number, social handles, and complaint summary for docket generation.'
  },
  {
    id: 'res_osc',
    name: 'Sakhi One Stop Centre (Bangalore District Hospital)',
    category: 'SHELTER',
    phone: '080-22860717',
    state: 'Karnataka',
    is24x7: true,
    website: 'https://wcd.nic.in/schemes/one-stop-centre-scheme',
    description: 'Integrated physical sanctuary offering emergency shelter up to 5 days, medical examination, forensic care, legal aid, and counseling under one roof.',
    whatToExpect: 'Walk-ins or referrals accepted 24/7. Immediate medical examination conducted with female doctor; zero police fee; safe room provided.'
  },
  {
    id: 'res_nalsa',
    name: 'National Legal Services Authority (NALSA Free Legal Aid)',
    category: 'LEGAL',
    phone: '15100',
    state: 'ALL',
    is24x7: true,
    website: 'https://nalsa.gov.in',
    description: 'Free legal aid, counsel assignment, and court representation for all women in India regardless of income under Section 12 of Legal Services Authorities Act.',
    whatToExpect: 'Legal aid secretary will assess your case and assign an empaneled legal advocate for FIR filing, 498A, DV Act applications, or child custody.'
  },
  {
    id: 'res_telemanas',
    name: 'Tele-MANAS National Mental Health Helpline',
    category: 'MENTAL_HEALTH',
    phone: '14416',
    state: 'ALL',
    is24x7: true,
    website: 'https://telemanas.mohfw.gov.in',
    description: 'Government of India 24/7 mental health counseling offering trauma-informed support in 20+ regional Indian languages.',
    whatToExpect: 'Interactive voice response allows selecting your preferred regional language (Hindi, Tamil, Telugu, Kannada, etc.). Qualified clinical psychologist speaks with you.'
  },
  {
    id: 'res_ahtu',
    name: 'Anti-Human Trafficking Unit (AHTU Karnataka)',
    category: 'EMERGENCY',
    phone: '080-22942444',
    state: 'Karnataka',
    is24x7: true,
    website: 'https://ksp.karnataka.gov.in',
    description: 'Specialized CID police wing dedicated to investigating recruitment scams, interstate coercion, and cross-border commercial exploitation.',
    whatToExpect: 'Senior investigating officer reviews suspect job offer documents, withheld passport complaints, and conducts raid rescue operations.'
  },
  {
    id: 'res_delhi_1091',
    name: 'Delhi Police Women Helpline',
    category: 'HELPLINE',
    phone: '1091',
    state: 'Delhi',
    is24x7: true,
    description: 'Dedicated women safety emergency desk of Delhi Police for immediate patrolling PCR dispatch and eve-teasing intervention.',
    whatToExpect: 'Direct line to Delhi Police Special Police Unit for Women and Children (SPUWAC).'
  }
];

export const verifiedResources = initialVerifiedResources;

export const initialRiskQuestions = [
  {
    id: 'q_fin_1',
    category: 'Domestic & Financial Coercion',
    indicatorText: 'Someone controls or restricts my access to my earned money, bank accounts, or personal funds.',
    weight: 15
  },
  {
    id: 'q_doc_1',
    category: 'Trafficking & Exploitation',
    indicatorText: 'Someone has confiscated or is holding my passport, Aadhaar card, certificates, or identity papers.',
    weight: 30
  },
  {
    id: 'q_move_1',
    category: 'Physical Freedom & Movement',
    indicatorText: 'Someone locks doors, prevents me from leaving the premises, or dictates whom I can meet.',
    weight: 35
  },
  {
    id: 'q_phone_1',
    category: 'Digital Surveillance',
    indicatorText: 'Someone monitors my phone calls, demands my passwords, or reads my personal chats without consent.',
    weight: 15
  },
  {
    id: 'q_threat_1',
    category: 'Intimidation & Abuse',
    indicatorText: 'Someone has threatened physical harm towards me, my children, or my family members.',
    weight: 35
  },
  {
    id: 'q_follow_1',
    category: 'Stalking & Harassment',
    indicatorText: 'Someone repeatedly follows me, watches my residence or workplace, or tracks my physical location.',
    weight: 20
  },
  {
    id: 'q_work_1',
    category: 'Forced Labor / Debt Bondage',
    indicatorText: 'Someone is forcing me to work excessive hours or demanding repayment of an unreasonable or unclear debt before releasing me.',
    weight: 30
  },
  {
    id: 'q_intimate_1',
    category: 'Sexual Coercion & Assault',
    indicatorText: 'Someone forces or coerces unwanted physical or sexual acts against my consent or will.',
    weight: 40
  },
  {
    id: 'q_blackmail_1',
    category: 'Digital Blackmail & Extortion',
    indicatorText: 'Someone has threatened to publish private images, videos, or confidential material unless I comply with demands.',
    weight: 30
  },
  {
    id: 'q_isolate_1',
    category: 'Isolation',
    indicatorText: 'Someone has systematically cut me off from contacting my friends, parents, or support circle.',
    weight: 15
  }
];

export const initialLatestRiskResult: RiskAssessmentResult = {
  id: 'ra_initial',
  completedAt: '2026-09-10T16:30:00.000Z',
  score: 35,
  level: 'MODERATE',
  primaryCategory: 'Stalking & Cyber Harassment',
  detectedIndicators: [
    'Repeated uninvited physical following around transit hubs',
    'Anonymous threatening digital messages on messaging platforms'
  ],
  explanation: 'Your responses indicate elevated patterns of targeted digital surveillance and physical following. While this is not an official diagnostic judgment, early intervention and systematic documentation are strongly recommended.',
  recommendedSteps: [
    'Save and compute cryptographic SHA-256 hashes of all digital screenshots in your Evidence Vault.',
    'Share your live check-in with your sister or trusted contact when leaving transit points.',
    'Familiarize yourself with the 181 Women Helpline and nearby One Stop Sakhi Centre locations.',
    'Review your device privacy checklist and disable unfamiliar shared location toggles.'
  ],
  recommendations: [
    'Save and compute cryptographic SHA-256 hashes of all digital screenshots in your Evidence Vault.',
    'Share your live check-in with your sister or trusted contact when leaving transit points.',
    'Familiarize yourself with the 181 Women Helpline and nearby One Stop Sakhi Centre locations.',
    'Review your device privacy checklist and disable unfamiliar shared location toggles.'
  ]
};
