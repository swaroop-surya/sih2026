import { DemoScenario } from '../types';

export const demoScenarios: DemoScenario[] = [
  {
    id: 'scenario_stalking',
    title: 'Scenario 1: Physical & Digital Stalking',
    subtitle: 'Repeated unwanted following and persistent burner phone messages',
    category: 'stalking',
    riskLevel: 'HIGH',
    summary: 'A working professional experiences repeated physical surveillance near transit stations paired with anonymous calls. The system demonstrates evidence indexing, escalation detection, and trusted circle coordination.',
    incidents: [
      {
        id: 'inc_sc1_1',
        timestamp: '2026-09-02T19:20:00.000Z',
        date: '2026-09-02',
        time: '19:20',
        category: 'stalking',
        severity: 2,
        location: 'Bus Shelter, MG Road Metro',
        latitude: 12.9755,
        longitude: 77.6066,
        accuracy: 8,
        description: 'Noticeable male individual stood very close and watched intently. When boarding the feeder bus, the same person boarded behind me.',
        peopleInvolved: 'Unidentified male, blue cap, black backpack',
        witnesses: 'Co-commuters',
        evidenceIds: ['ev_sc1_1'],
        notes: 'First time observed this specific person.',
        reportedToPolice: false
      },
      {
        id: 'inc_sc1_2',
        timestamp: '2026-09-06T20:15:00.000Z',
        date: '2026-09-06',
        time: '20:15',
        category: 'stalking',
        severity: 4,
        location: 'Apartment Lane, Koramangala',
        latitude: 12.9352,
        longitude: 77.6245,
        accuracy: 10,
        description: 'Same individual waited at the end of the residential alleyway. Walked towards me whispering unsolicited remarks. Escaped by ducking into apartment security cabin.',
        peopleInvolved: 'Same individual with black backpack',
        witnesses: 'Apartment night security (Ram Singh)',
        evidenceIds: ['ev_sc1_2'],
        notes: 'Escalation from passive following to direct proximity approach within 4 days.',
        reportedToPolice: false
      }
    ],
    evidence: [
      {
        id: 'ev_sc1_1',
        filename: 'bus_stop_cctv_photo.jpg',
        fileType: 'image/jpeg',
        fileSize: 2150000,
        uploadedAt: '2026-09-02T21:00:00.000Z',
        sha256Hash: 'a89c72e410b0f498912e52bca7e89139f40026a28bb7c89134015bc2319ef2a1',
        description: 'Photo showing subject standing behind bus shelter pillar.',
        tags: ['stalking', 'transit'],
        isEncrypted: true
      },
      {
        id: 'ev_sc1_2',
        filename: 'apartment_guard_statement_audio.m4a',
        fileType: 'audio/m4a',
        fileSize: 1840000,
        uploadedAt: '2026-09-06T20:45:00.000Z',
        sha256Hash: '5e4d21cf89a19c41763da1123490924718021dafe91384021389bcfa90321289',
        description: 'Audio recording of security guard describing suspect loitering near gate.',
        tags: ['witness', 'audio_evidence'],
        isEncrypted: true
      }
    ],
    riskResult: {
      id: 'ra_sc1',
      completedAt: '2026-09-06T21:00:00.000Z',
      score: 75,
      level: 'HIGH',
      primaryCategory: 'Stalking & Intimidation',
      detectedIndicators: [
        'Repeated physical following in multiple locations',
        'Direct proximity approach near private residence',
        'Clear escalation in frequency within 5 days'
      ],
      explanation: 'Assessment reveals acute stalking pattern with spatial proximity approaching personal residence. Early police reporting to the 181 Women Helpline or local Women Police Station is advised.',
      recommendedSteps: [
        'File an e-FIR or non-cognizable report with local police using indexed SHA-256 evidence.',
        'Always activate Safety Check-In during daily commute.',
        'Inform apartment security and trusted contacts.'
      ]
    }
  },
  {
    id: 'scenario_domestic',
    title: 'Scenario 2: Domestic Coercive Control',
    subtitle: 'Financial isolation, movement restrictions & document seizure',
    category: 'domestic_violence',
    riskLevel: 'CRITICAL',
    summary: 'A spouse has withheld identity documents, confiscated bank debit cards, and threatens eviction if family is contacted. Demonstrates private safety planning, document checklist, and One Stop Centre routing.',
    incidents: [
      {
        id: 'inc_sc2_1',
        timestamp: '2026-09-05T11:00:00.000Z',
        date: '2026-09-05',
        time: '11:00',
        category: 'domestic_violence',
        severity: 4,
        location: 'Marathahalli Home',
        latitude: 12.9591,
        longitude: 77.6974,
        accuracy: 15,
        description: 'Spouse locked master bedroom drawer holding original passport, Aadhaar card, and jewelry. Stated I am not allowed to travel or visit parents without permission.',
        peopleInvolved: 'Spouse',
        witnesses: 'None',
        evidenceIds: ['ev_sc2_1'],
        notes: 'Financial access completely blocked; phone checks initiated every evening.',
        reportedToPolice: false
      }
    ],
    evidence: [
      {
        id: 'ev_sc2_1',
        filename: 'bank_statement_unauthorized_transfer.pdf',
        fileType: 'application/pdf',
        fileSize: 420000,
        uploadedAt: '2026-09-05T12:30:00.000Z',
        sha256Hash: 'c7482fbc198230ea12b67890123efca456910a123bca9814234509123847abcd',
        description: 'Statement showing entire personal savings balance transferred out without consent.',
        tags: ['financial_abuse', 'documents'],
        isEncrypted: true
      }
    ],
    riskResult: {
      id: 'ra_sc2',
      completedAt: '2026-09-05T13:00:00.000Z',
      score: 88,
      level: 'CRITICAL',
      primaryCategory: 'Domestic Coercive Control',
      detectedIndicators: [
        'Confiscation of passport and state identity documents',
        'Complete control over personal financial assets',
        'Severe restriction of physical movement and familial isolation'
      ],
      explanation: 'High-density coercive control markers identified. Coercive control severely limits autonomous escape. Immediate contact with Sakhi One Stop Centre or 181 Women Helpline recommended for safe emergency sheltering.',
      recommendedSteps: [
        'Keep emergency exit bag and essential numbers hidden in a safe location.',
        'Do not reveal safety planning browsing on shared household devices.',
        'Access confidential legal counseling via One Stop Centre (Sakhi).'
      ]
    }
  },
  {
    id: 'scenario_recruitment',
    title: 'Scenario 3: Suspicious Job Recruitment',
    subtitle: 'High salary overseas offer demanding passport surrender & deposit',
    category: 'trafficking_exploitation',
    riskLevel: 'HIGH',
    summary: 'An attractive overseas hospitality offer in Southeast Asia requiring upfront visa processing deposit and surrender of original educational certificates.',
    incidents: [
      {
        id: 'inc_sc3_1',
        timestamp: '2026-09-09T16:00:00.000Z',
        date: '2026-09-09',
        time: '16:00',
        category: 'trafficking_exploitation',
        severity: 3,
        location: 'Telegram / Online Recruiter',
        description: 'Agency claiming to represent Dubai luxury resort offered ₹1,80,000/mo for entry receptionist with no interview. Demanded ₹45,000 "security bond" and sending original passport by courier within 48 hours.',
        peopleInvolved: 'Agent "Vikram Rao" (Telegram handle @GulfResortHR)',
        witnesses: 'None',
        evidenceIds: ['ev_sc3_1'],
        notes: 'Recruiter refused to provide MEA Registration Certificate number or official company domain email.',
        reportedToPolice: false
      }
    ],
    evidence: [
      {
        id: 'ev_sc3_1',
        filename: 'fraudulent_offer_letter_dubai.pdf',
        fileType: 'application/pdf',
        fileSize: 920000,
        uploadedAt: '2026-09-09T16:20:00.000Z',
        sha256Hash: '7f91823abce12903847561029384756102938475610293847561029384756102',
        description: 'PDF offer letter with mismatched logos and unverified overseas address.',
        tags: ['trafficking_risk', 'recruitment_fraud'],
        isEncrypted: true
      }
    ],
    riskResult: {
      id: 'ra_sc3',
      completedAt: '2026-09-09T17:00:00.000Z',
      score: 82,
      level: 'HIGH',
      primaryCategory: 'Recruitment & Trafficking Risk',
      detectedIndicators: [
        'Demands upfront monetary deposit prior to job placement',
        'Demands submission of original passport and certificates',
        'Disproportionate salary for zero qualifications or interview',
        'Pressure to relocate within 48 hours without verifiable employer registry'
      ],
      explanation: 'Matches hallmark patterns of fraudulent overseas recruitment and debt bondage exploitation. Ministry of External Affairs warns against unregistered recruitment agents.',
      recommendedSteps: [
        'Verify agency on the official eMigrate portal (emigrate.gov.in).',
        'Never surrender original passport to any intermediary.',
        'Report suspected fraudulent recruiter to Anti-Human Trafficking Units (AHTU).'
      ]
    }
  },
  {
    id: 'scenario_blackmail',
    title: 'Scenario 4: Cyber Blackmail & Extortion',
    subtitle: 'Threats to circulate morphed private images to contacts',
    category: 'blackmail',
    riskLevel: 'HIGH',
    summary: 'An anonymous contact acquired private photos and threatens to distribute them to family and employer unless money is wired. Demonstrates cyber safety tools, 1930 helpline routing, and forensic hashing.',
    incidents: [
      {
        id: 'inc_sc4_1',
        timestamp: '2026-09-10T22:15:00.000Z',
        date: '2026-09-10',
        time: '22:15',
        category: 'blackmail',
        severity: 4,
        location: 'Instagram Direct / WhatsApp',
        description: 'Anonymous account sent collages of private photos paired with screenshots of my LinkedIn connections list. Demanded ₹50,000 via UPI within 6 hours.',
        peopleInvolved: 'Account @shadow_user_992 (now deleted) & WhatsApp +91 91234 56789',
        witnesses: 'None',
        evidenceIds: ['ev_sc4_1'],
        notes: 'Preserved original conversation export, URL links, and UPI handle.',
        reportedToPolice: false
      }
    ],
    evidence: [
      {
        id: 'ev_sc4_1',
        filename: 'extortion_chat_thread_with_headers.png',
        fileType: 'image/png',
        fileSize: 1540000,
        uploadedAt: '2026-09-10T22:30:00.000Z',
        sha256Hash: 'b45c928173461029384756102938475610293847561029384756102938475610',
        description: 'High-resolution screenshot with message timestamps, battery status, and sender identifier visible.',
        tags: ['blackmail', 'cybercrime', 'upi_extortion'],
        isEncrypted: true
      }
    ],
    riskResult: {
      id: 'ra_sc4',
      completedAt: '2026-09-10T22:45:00.000Z',
      score: 85,
      level: 'HIGH',
      primaryCategory: 'Cyber Blackmail & Extortion',
      detectedIndicators: [
        'Extortion demand paired with non-consensual image distribution threats',
        'Artificial deadline and financial demands',
        'Targeting victim social and professional network'
      ],
      explanation: 'Clear indicators of criminal cyber extortion under Information Technology Act and Indian Penal Code. Paying extortionists rarely stops harassment and frequently leads to increased demands.',
      recommendedSteps: [
        'Do not transfer money; save all chat threads and transaction UPI identifiers.',
        'File an immediate complaint on the National Cyber Crime Reporting Portal (cybercrime.gov.in) or call 1930.',
        'Utilize StopNCII.org to create hash fingerprints that prevent distribution on major social platforms.'
      ]
    }
  },
  {
    id: 'scenario_emergency',
    title: 'Scenario 5: Immediate Physical Danger (Active SOS)',
    subtitle: 'Real-time emergency activation simulation with location dispatch',
    category: 'other',
    riskLevel: 'CRITICAL',
    summary: 'Demonstrates the active emergency activation workflow: 5-second countdown cancel window, simulated high-accuracy GPS coordinates, SMS dispatch log to trusted circle, and 112 emergency routing.',
    incidents: [
      {
        id: 'inc_sc5_1',
        timestamp: '2026-09-13T02:00:00.000Z',
        date: '2026-09-13',
        time: '02:00',
        category: 'harassment',
        severity: 5,
        location: 'Isolated Service Road, Outer Ring Road near EcoSpace',
        latitude: 12.9260,
        longitude: 77.6762,
        accuracy: 10,
        description: 'Auto-rickshaw driver took unscheduled dark detour, turned off meter, and refused to stop vehicle when demanded. Active SOS triggered by holding emergency button.',
        peopleInvolved: 'Auto driver (KA-01-AB-4321)',
        witnesses: 'None',
        evidenceIds: [],
        notes: 'SOS dispatched to sister (Pooja) and friend (Meera) with live GPS pin.',
        reportedToPolice: true
      }
    ],
    evidence: [],
    riskResult: {
      id: 'ra_sc5',
      completedAt: '2026-09-13T02:01:00.000Z',
      score: 95,
      level: 'CRITICAL',
      primaryCategory: 'Immediate Physical Peril',
      detectedIndicators: [
        'Unauthorized deviation into unlit/isolated corridor',
        'Refusal to allow passenger to exit moving vehicle',
        'High imminent threat to personal physical safety'
      ],
      explanation: 'Immediate emergency protocol activated. Coordinates transmitted to primary emergency circle.',
      recommendedSteps: [
        'Connect directly with 112 National Emergency operator.',
        'Remain on line with emergency dispatcher until responder vehicle arrives.',
        'Keep device awake and silent if confronting perpetrator could provoke violence.'
      ]
    }
  }
];
