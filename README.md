# Abhaya (अभय / അഭയ / ಅಭಯ / அபயம்) — Women's Safety, Prevention & Early Risk Detection Platform

> **"You're not alone."** — A mobile-first Progressive Web Application (PWA) engineered for women's personal safety, coercion detection, tamper-evident incident documentation, and discreet emergency response across India.

[![Platform](https://img.shields.io/badge/Platform-PWA%20%7C%20Mobile--Web-blue.svg)](#)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205.8-3178C6.svg)](#)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg)](#)
[![Vite](https://img.shields.io/badge/Bundler-Vite%206-646CFF.svg)](#)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38BDF8.svg)](#)
[![AI Engine](https://img.shields.io/badge/AI-Google%20GenAI%20SDK%20%28Gemini%29-F58220.svg)](#)
[![Maps](https://img.shields.io/badge/Geospatial-Leaflet%20%2B%20OpenStreetMap-779836.svg)](#)
[![Security](https://img.shields.io/badge/Integrity-Web%20Crypto%20SHA--256-green.svg)](#)
[![License](https://img.shields.io/badge/License-Proprietary%20%2F%20Research-purple.svg)](#)

---

## 1. Executive Overview

Traditional personal safety applications operate almost exclusively as reactive "panic buttons" triggered during or immediately after physical peril occurs. While emergency signaling is vital, it often comes too late to disrupt patterns of stalking, digital blackmail, domestic coercive control, or deceptive human trafficking.

**Abhaya** redefines personal safety by focusing on **prevention, early detection, evidentiary integrity, and discreet escalation**:
- **Proactive Early Detection**: Standardized risk scoring identifying subtle indicators of domestic coercion, digital stalking, and employment fraud before physical danger materializes.
- **Evidentiary Integrity**: Client-side cryptographic fingerprinting (SHA-256 via Web Crypto API) to establish a tamper-evident digital chain of custody for incident logs, screenshots, and audio recordings.
- **Discreet Emergency Response**: Multi-layered safety protocols including a 1.5-second hold-to-activate trigger, silent distress modes, hands-free voice-activated triggers, and an instantaneous disguise screen that transforms the application into an authentic Weather Forecast interface.
- **Localized Support Ecosystem**: Direct routing to verified Indian support helplines (112 National Emergency, 181 Women Helpline, 1930 Cyber Crime, Sakhi One Stop Centres, NALSA Free Legal Aid) paired with multilingual support in English, Telugu, Hindi, and Tamil.

---

## 2. Real vs. Simulated Infrastructure (Technical Demarcation)

To ensure complete transparency for developers, researchers, and safety evaluators, the table below explicitly details which capabilities are functional in the current codebase versus which components operate as simulated prototypes:

| Feature / Subsystem | Status | Technical Implementation Details |
| :--- | :--- | :--- |
| **Emergency SOS Trigger** | **FUNCTIONAL** | 1.5s deliberate touch gesture, 5s countdown cancellation, silent mode toggle, alarm synthesizer via Web Audio API, and screen strobe. |
| **Direct Helpline Calling** | **FUNCTIONAL** | Native browser telephony protocol (`tel:112`, `tel:181`, `tel:1930`, `tel:15100`, etc.) initiating real-world telephone calls on mobile devices. |
| **SMS / WhatsApp SOS Dispatch** | **SIMULATED** | Previews and mock dispatches are generated in state with real GPS coordinates and Google Maps links. *No external SMS carrier or Twilio/WhatsApp Business API is connected.* |
| **112 CAD Gateway Connection** | **SIMULATED** | Demonstrates Computer-Aided Dispatch payload transmission and generates mock CAD tracking tickets (`ERSS-112-KA-xxxxxx`). *No direct integration with State Police control room APIs.* |
| **Geospatial Incident Mapping** | **FUNCTIONAL** | Leaflet (`leaflet` v1.9.4) rendering OpenStreetMap tiles, GPS geolocation polling via HTML5 Geolocation API, dynamic severity markers, and 500m/1000m danger buffer zones. |
| **Tamper-Evident Evidence Vault** | **FUNCTIONAL** | Client-side SHA-256 digest computation via Web Crypto API (`crypto.subtle.digest`), file linking, and JSON evidence manifest export. |
| **Hands-Free Voice Guard** | **FUNCTIONAL** | Web Speech API (`SpeechRecognition`) continuous keyword listener, Screen Wake Lock API (`navigator.wakeLock`), and silent Web Audio buffer loop. |
| **AI Safety & Coercion Advisor** | **FUNCTIONAL** | Server-side Express proxy using `@google/genai` SDK (`gemini-3.1-flash-lite`, `gemini-3.8-flash`, `gemini-flash-latest`) with resilient rule-based offline fallback. |
| **Recruitment Scam Screener** | **FUNCTIONAL** | Deterministic heuristic indicator checks combined with Gemini AI risk assessment and MEA eMigrate verification guidance. |
| **Discreet Weather Disguise** | **FUNCTIONAL** | Full-screen UI camouflage replacing the viewport with an authentic Bengaluru Weather Forecast, unlocked via a discreet triple-tap gesture. |
| **Client-Side Persistence** | **FUNCTIONAL** | Offline-first zero-knowledge storage using browser `localStorage` with JSON state backup/export, audit logging, and local data wiping. |
| **Responder Triage Console** | **SIMULATED** | Local mock caseworker dashboard with priority queues (P1/P2/P3), status updates, and note logging. *Operates on local client state without a shared multi-tenant database.* |

---

## 3. System Architecture

Abhaya operates as an offline-first Single Page Application (SPA) / Progressive Web App (PWA) coupled with a lightweight Node.js/Express backend server that acts as a secure proxy for artificial intelligence capabilities.

```
+-----------------------------------------------------------------------------------+
|                                  BROWSER CLIENT                                   |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                       React 19 + TypeScript + Vite 6                      |   |
|   |   - MobileShell & Kolam Rosette Motif  - Multilingual Engine (en/te/hi/ta)|   |
|   |   - Responsive Tailwind CSS v4 Theme   - Motion Transitions               |   |
|   +---------------------------------------------------------------------------+   |
|          |                         |                           |                  |
|          v                         v                           v                  |
|   +---------------+      +-------------------+      +---------------------+       |
|   | Hardware APIs |      | Geospatial Engine |      | Cryptographic Vault |       |
|   | - Web Speech  |      | - Leaflet Map     |      | - Web Crypto API    |       |
|   | - Wake Lock   |      | - OpenStreetMap   |      |   (SHA-256 Digest)  |       |
|   | - Web Audio   |      | - HTML5 Geolocation|     | - JSON Manifest     |       |
|   | - Telephony   |      | - Buffer Zones    |      | - Local File Preview|       |
|   +---------------+      +-------------------+      +---------------------+       |
|          |                         |                           |                  |
|          +-------------------------+---------------------------+                  |
|                                    |                                              |
|                                    v                                              |
|                    +-------------------------------+                              |
|                    |     Browser localStorage      |                              |
|                    |  (Zero-Knowledge Persistence) |                              |
|                    |  - Incidents & Evidence Meta  |                              |
|                    |  - Contacts & Safe Places     |                              |
|                    |  - Check-ins & Safety Plan    |                              |
|                    |  - Audit Log & Risk Results   |                              |
|                    +-------------------------------+                              |
+-----------------------------------------------------------------------------------+
                                     |
                                     | HTTP REST API (/api/*)
                                     v
+-----------------------------------------------------------------------------------+
|                        BACKEND PROXY SERVER (server.ts)                           |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                    Express.js Router (Port 3000)                          |   |
|   |   - GET  /api/health                                                      |   |
|   |   - POST /api/ai/chat (Trauma-Informed Assistant)                         |   |
|   |   - POST /api/ai/analyze-recruitment (Exploitation Screener)              |   |
|   +---------------------------------------------------------------------------+   |
|          |                                                 |                      |
|          v                                                 v                      |
|   +--------------------------+                  +-------------------------+       |
|   | Google GenAI SDK         |                  | Rule-Based Fallback     |       |
|   | (@google/genai)          |                  | Safety Engine           |       |
|   | - gemini-3.1-flash-lite  | --(On Timeout/-> | - Coercion & Passports  |       |
|   | - gemini-3.8-flash       |     Failure)     | - IT Act & Extortion    |       |
|   | - gemini-flash-latest    |                  | - Stalking & Zero FIR   |       |
|   | - 18s Async Timeout Race |                  | - Deterministic Scorer  |       |
|   +--------------------------+                  +-------------------------+       |
+-----------------------------------------------------------------------------------+
                                     |
                                     | HTTPS API Calls (API Key Protected)
                                     v
+-----------------------------------------------------------------------------------+
|                              GOOGLE GEMINI CLOUD                                  |
|                     (Server-side LLM Inference & Analysis)                        |
+-----------------------------------------------------------------------------------+
```

---

## 4. Implemented Features & Technical Deep-Dive

### 4.1 Emergency Response & SOS Engine
- **Hold-to-Activate Gesture**: The primary emergency button requires a continuous 1.5-second hold (45ms interval sampling with visual circular progress fill) to prevent accidental pocket triggers.
- **5-Second Cancellation Window**: After triggering, a prominent 5-second countdown allows the user to cancel inadvertent alerts before dispatch logs are finalized.
- **Silent SOS Mode**: Toggling silent mode suppresses the Web Audio alarm siren and flashing screen strobe, keeping the device dark and quiet during active danger.
- **Automated Geolocation Capture**: Directly interfaces with `navigator.geolocation.getCurrentPosition` using `enableHighAccuracy: true` and an 8-second timeout, extracting latitude, longitude, and accuracy radius.
- **Simulated Multi-Channel Alerting**: Formats and stages SMS/WhatsApp emergency alerts for designated `TrustedContact` entities, complete with an incident timestamp and a Google Maps pinpoint link (`https://maps.google.com/?q=lat,lng`).
- **Direct-Dial Helplines**: Embedded native `tel:` anchor triggers connecting directly to:
  - **112**: India's National Emergency Response Support System (Police, Fire, Ambulance).
  - **181**: Women Helpline (Ministry of Women and Child Development).
- **Simulated CAD 112 Gateway**: Demonstrates automated Computer-Aided Dispatch ingestion, outputting a formal ticket identifier (`ERSS-112-KA-xxxxxx`) and automated unit assignment log.
- **Duress PIN Safeguard**: Allows setting a decoy deactivation code in the Profile settings. Entering the duress code displays a normal deactivation screen while silently maintaining active distress signals.

### 4.2 Hands-Free Discreet Voice Guard
- **Web Speech Recognition**: Utilizes the browser's `SpeechRecognition` or `webkitSpeechRecognition` interface to maintain a low-profile continuous listening loop.
- **Configurable Trigger Keyword**: Default trigger phrase is `"red umbrella"`, which can be customized by the user (e.g., `"Help me Abhaya"` or `"Bachao"`).
- **Screen Wake Lock Integration**: Acquires a `navigator.wakeLock.request('screen')` sentinel while the voice listener is armed, automatically re-requesting the lock upon visibility state changes.
- **Background Audio Buffer Loop**: Generates a zero-volume Web Audio oscillator loop to prevent mobile browser engines from throttling audio capture threads when running in the background.
- **Instant Silent Escalation**: Recognizing the configured phrase immediately triggers the silent SOS protocol.

### 4.3 Geospatial Incident Logging & Leaflet Mapping
- **Structured Incident Schema**: Captures comprehensive data points including:
  - Categorization: Stalking, Harassment, Unsafe Path, Domestic Violence, Sexual Harassment, Cyber Abuse, Blackmail, Trafficking/Exploitation, Workplace Incident.
  - Severity Rating: 1 to 5 scale with standardized color-coded visual indicators.
  - Granular Evidence: Geolocation (latitude, longitude, GPS accuracy in meters), physical landmarks, people involved, witness statements, and formal police reporting status.
- **Leaflet Integration**: Uses `leaflet` (v1.9.4) and OpenStreetMap tiles (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`), eliminating proprietary map watermarks and external API key requirements.
- **Danger Buffer Radius Zones**: Allows toggling 500-meter and 1000-meter concentric danger buffer rings around high-severity incidents to visualize repeat harassment corridors.
- **Interactive Coordinate Selection**: Clicking any location on the map allows the user to drop an incident marker with coordinates automatically populated into the intake form.

### 4.4 Tamper-Evident Evidence Vault (Chain of Custody)
- **Client-Side SHA-256 Hashing**: When digital evidence (photographs, audio recordings, screenshots, PDFs) is uploaded, Abhaya executes `crypto.subtle.digest('SHA-256', arrayBuffer)` directly inside the browser.
- **Digital Integrity Verification**: Produces an immutable 64-character hexadecimal digest representing the file at that exact timestamp, establishing proof that the media has not been altered or tampered with after recording.
- **Statutory Alignment**: Designed around the evidentiary standards of **Section 65B of the Indian Evidence Act** and **Section 63 of the Bharatiya Sakshya Adhiniyam (BSA)** for electronic record admissibility.
- **Incident Association**: Vault items link directly to corresponding incident identifiers (`incidentId`).
- **JSON Evidence Manifest Export**: Generates an exportable, human-readable JSON evidence package (`abhaya-evidence-YYYY-MM-DD.json`) containing file metadata, timestamps, linked incident IDs, and cryptographic hash fingerprints.

### 4.5 Early Warning Coercion & Risk Quiz
- **10-Indicator Assessment Tool**: A structured diagnostic instrument covering:
  1. *Domestic & Financial Coercion*: Restricting access to earned money or bank accounts (Weight: 15).
  2. *Trafficking & Exploitation*: Confiscation of passport, Aadhaar, or education certificates (Weight: 30).
  3. *Physical Freedom & Movement*: Locked doors, physical confinement, movement restrictions (Weight: 35).
  4. *Digital Surveillance*: Monitoring phone calls, demanding passwords, reading private messages (Weight: 15).
  5. *Intimidation & Abuse*: Threats of physical violence towards victim or family (Weight: 35).
  6. *Stalking & Harassment*: Repeated following, workplace surveillance, location tracking (Weight: 20).
  7. *Forced Labor / Debt Bondage*: Excessive forced labor, unclear or fabricated debt repayment (Weight: 30).
  8. *Sexual Coercion & Assault*: Non-consensual physical or intimate demands (Weight: 40).
  9. *Digital Blackmail & Extortion*: Threats to publish private images or videos (Weight: 30).
  10. *Familial & Social Isolation*: Systematic cut-off from support networks (Weight: 15).
- **Mathematical Scoring Rubric**:
  - Score $\ge 50$: **HIGH RISK** (Immediate helpline routing, safety planning, and secure evidence storage).
  - Score $20 - 49$: **MODERATE RISK** (Commute check-in timers, discreet incident journaling).
  - Score $< 20$: **LOW RISK** (General situational awareness, privacy checklist audits).
- **Trauma-Informed Guidance**: Generates actionable, plain-language recommendations (maximum 4 prioritized steps) without judgmental or victim-blaming language.

### 4.6 AI Safety & Coercion Advisor (`@google/genai`)
- **Backend Architecture**: Secure Express proxy route at `/api/ai/chat` keeping Gemini API keys hidden from client-side bundle inspection.
- **Multi-Model Fallback Hierarchy**: Queries candidate models in order:
  1. `gemini-3.1-flash-lite`
  2. `gemini-3.8-flash`
  3. `gemini-flash-latest`
- **Asynchronous Timeout Guard**: Enforces an 18-second timeout race (`withTimeout`) to prevent long-tail hanging requests during network latency.
- **Trauma-Informed System Prompts**:
  - Prioritizes immediate physical safety and emergency dialing (112 / 181).
  - Strictly prohibits victim blaming or suggesting dangerous direct confrontations with abusers.
  - Distinguishes between informational risk indicators and formal legal/medical diagnoses.
  - **Product Policy Guardrail**: Strictly distinguishes between consensual adult sex work and coercive human trafficking, focusing exclusively on forced labor, document seizure, violence, and movement deprivation.
- **Multilingual Support**: Supports queries and responses in English, Telugu (`te`), Hindi (`hi`), and Tamil (`ta`).
- **Resilient Rule-Based Fallback Engine**: If the Gemini API key is missing, network access is severed, or the AI request times out, a local deterministic safety engine provides instant trauma-informed guidance for:
  - Withheld identity documents / passports.
  - Digital sextortion and cyber blackmail (IT Act Sections 66E/67).
  - Physical following and stalking.
  - Legal rights under Indian law (Zero FIR, NALSA legal aid, Section 164 CrPC/BNSS statements).
  - Domestic abuse and One Stop Centre (Sakhi) access.

### 4.7 Recruitment Scam & Exploitation Screener
- **Endpoint**: `/api/ai/analyze-recruitment`.
- **Deterministic Heuristic Screening**: Analyzes job descriptions, overseas offers, and recruiter messages against weighted red flags:
  - Demands for upfront fees or security deposits (+30).
  - Demands for passport or original certificate retention (+45).
  - Artificial relocation urgency / "fly within 48 hours" (+25).
  - Disproportionate salary for zero qualifications (+25).
  - Recruiter-controlled or isolated housing (+30).
  - Working on a tourist/visit visa rather than a legal work permit (+40).
  - Informal communication channels (Telegram/WhatsApp only) without verifiable company registration (+15).
- **AI-Enhanced Contextual Analysis**: Evaluates nuanced language for deceptive debt bondage and provides official verification steps (e.g., checking the Ministry of External Affairs eMigrate portal at `emigrate.gov.in`).

### 4.8 Automated Safety Check-ins
- **Timed Countdown Timer**: Built for late-night transit, cab rides, or meetings with new individuals.
- **Flexible Configurations**: Purpose, destination, duration in minutes, single-trip or daily recurring modes, and designated guardian contact selection.
- **Smooth Real-Time Ticker**: Independent 1-second interval state ticker updating the remaining time.
- **Automated Escalation Protocol**: If the timer expires without the user clicking "I'm Safe", the status transitions to `EXPIRED`, staging an alert to selected emergency contacts with the last recorded destination and route purpose.

### 4.9 Resource Navigator & Verified Directory
- **Curated Pan-India Helplines**:
  - **112**: National Emergency Response Support System (ERSS).
  - **181**: Women Helpline (24/7 crisis intervention and shelter referral).
  - **1930**: National Cyber Crime Reporting Helpline (financial fraud & cyber blackmail).
  - **Sakhi One Stop Centres (OSC)**: Integrated medical, legal, and temporary emergency shelter (up to 5 days).
  - **15100**: National Legal Services Authority (NALSA) free legal aid.
  - **14416**: Tele-MANAS national mental health counseling in 20+ regional Indian languages.
  - **Anti-Human Trafficking Units (AHTU)**: Specialized CID police wings.
  - **1091**: Delhi Police Women Helpline.
- **Dynamic Search & Filtering**: Filter by category (Emergency, Helpline, Legal, Shelter, Mental Health, Cyber) and region (All India, Karnataka, Delhi, Maharashtra, Telangana, Tamil Nadu, "Near me").
- **"What to Expect" Guides**: Tactical walkthroughs explaining exact call center flows, language options, and what details to have ready.

### 4.10 Discreet Quick Exit & Weather Forecast Disguise
- **Instant Camouflage**: Clicking the `EyeOff` icon in the navigation header or pressing the `Escape` key immediately unmounts the safety interface and displays a realistic **National Forecast / Weather App**.
- **Authentic Weather UI**: Displays Bengaluru, IN temperature (24°C), humidity, wind speed, AQI metrics, and a full 5-day weather outlook.
- **Discreet Multi-Tap Unlock**: Returning to the Abhaya interface requires a rapid triple-tap gesture on the weather sun icon, preventing accidental discovery by unauthorized parties.

### 4.11 Safety Plan & Personal Organizer
- **Modular Readiness Sections**:
  1. *Documents & Legal Papers*: Scans of Aadhaar, Passport, PAN, bank records in personal name.
  2. *Emergency Shelters*: Pre-identified trusted locations and Sakhi One Stop Centres.
  3. *Transportation*: Cab hailing backup funds, transit cards, spare vehicle keys.
  4. *Health & Prescriptions*: Critical medication copies and medical history records.
  5. *Trusted Network*: Safe contacts and advocates.
  6. *Emergency Bag*: Pre-packed essentials stored in an accessible secondary location.
- **Discreet View Toggle**: Instantly renames sensitive sections to innocuous titles (*"Important Files"*, *"Saved Locations"*, *"Travel Itinerary"*, *"Wellness Notes"*, *"Personal Directory"*, *"Travel Kit"*) to protect users undergoing device inspections by coercive partners.

### 4.12 Cyber Safety & Defense Hub
- **Blackmail & Sextortion Protocols**: Step-by-step guidance discouraging ransom payments, preserving unedited chat logs, and routing to official reporting channels.
- **StopNCII.org Referral**: Guidance on generating non-reversible perceptual image hashes to proactively prevent intimate image distribution on Meta, Instagram, and Reddit.
- **Suspicious Link Scanner**: Regex-based pattern scanner checking for shortened URLs (`bit.ly`, `tinyurl`, `t.me`), unofficial APK downloads, and credential-harvesting subdomains.
- **Device Privacy Checklist**: Step-by-step audit for two-factor authentication, social media privacy locks, location permission audits, and unfamiliar logged-in devices.

### 4.13 Responder & Caseworker Console
- **Multi-Role Switching**: Seamless role transition between `USER`, `RESPONDER`, and `ADMIN` in the Profile settings.
- **Caseworker Triage Queue**: Displays incoming mock cases categorized by priority:
  - `P1_IMMEDIATE`: Active SOS triggers or physical following incidents.
  - `P2_URGENT`: Overdue commute check-ins requiring guardian contact.
  - `P3_FOLLOWUP`: Cyber extortion cases with cryptographic evidence packages.
- **Lifecycle Status Management**: Move cases through `NEW`, `ACKNOWLEDGED`, `IN_PROGRESS`, and `RESOLVED` states with timestamped casework note logging.

### 4.14 Zero-PII Safety Analytics
- **Client-Side Aggregation**: Computes overall metrics (total documented incidents, check-in success rates, fingerprinted evidence items, active risk score) directly from the client's local storage.
- **Category Distribution Visualizer**: Pure CSS/Tailwind bar charts illustrating incident breakdown without sending telemetry to external analytics servers.
- **Zero-PII Privacy Policy**: Guarantees that personal names, telephone numbers, and exact coordinates are never broadcast to third-party telemetry or ad networks.

### 4.15 Multilingual Localization & Indic Typography
- **Supported Languages**: Full UI localization across:
  - English (`en`)
  - Telugu (`te`)
  - Hindi (`hi`)
  - Tamil (`ta`)
- **Typography Optimization**: Configured with Google Noto Sans and Noto Serif font families supporting Devanagari, Tamil, and Telugu scripts for optical clarity and legibility during high-stress usage.

### 4.16 Preloaded Demonstration Scenarios
Abhaya includes 5 realistic preloaded safety scenarios to facilitate evaluation, training, and demonstrations without manual data entry:
1. **Scenario 1: Physical & Digital Stalking**: Transit following near MG Road Metro escalating to residential alleyway surveillance, paired with CCTV evidence and audio recordings.
2. **Scenario 2: Domestic Coercive Control**: Document confiscation (passport, Aadhaar) and financial starvation with unauthorized bank transfer evidence.
3. **Scenario 3: Suspicious Job Recruitment**: Fraudulent overseas hospitality position demanding upfront deposits and passport surrender.
4. **Scenario 4: Cyber Blackmail & Extortion**: Anonymous extortion demands threatening non-consensual image leaks with forensic chat screenshots.
5. **Scenario 5: Immediate Physical Danger**: Night transit detour in a commercial vehicle triggering active SOS and coordinate dispatch.

---

## 5. Technology Stack & Dependencies

### Frontend Core
- **Framework**: React 19 (`react` v19.0.1, `react-dom` v19.0.1)
- **Language**: TypeScript (`typescript` v5.8.2)
- **Build Tool**: Vite (`vite` v6.2.3)
- **Styling**: Tailwind CSS v4 (`tailwindcss` v4.1.14, `@tailwindcss/vite` v4.1.14)
- **Component Animation**: Motion (`motion` v12.23.24)
- **Icons**: Lucide React (`lucide-react` v0.546.0)
- **QR Code Generation**: QRCode (`qrcode` v1.5.4, `@types/qrcode` v1.5.6)
- **Class Utilities**: `clsx` (v2.1.1), `tailwind-merge` (v3.7.0)

### Mapping & Geospatial
- **Mapping Library**: Leaflet (`leaflet` v1.9.4, `@types/leaflet` v1.9.22)
- **Map Tiles**: OpenStreetMap standard raster tile layer (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`)
- **Hardware Integration**: W3C Geolocation API (`navigator.geolocation`)

### Cryptography & Browser APIs
- **Cryptographic Hashing**: W3C Web Crypto API (`crypto.subtle.digest('SHA-256')`)
- **Speech Recognition**: W3C Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)
- **Screen Management**: W3C Screen Wake Lock API (`navigator.wakeLock`)
- **Audio Synthesis**: W3C Web Audio API (`AudioContext`, `AudioBufferSourceNode`)
- **Telephony Protocol**: RFC 3966 `tel:` URI scheme

### Backend Server
- **Runtime**: Node.js 18+ (ES Module execution via `tsx` v4.21.0)
- **Web Framework**: Express (`express` v4.21.2, `@types/express` v4.17.21)
- **Environment Management**: Dotenv (`dotenv` v17.2.3)
- **Bundler & Compiler**: ESBuild (`esbuild` v0.25.0) for self-contained `dist/server.cjs` production builds

### Artificial Intelligence
- **SDK**: `@google/genai` (v2.4.0)
- **Candidate Models**:
  - `gemini-3.1-flash-lite` (Preferred for speed and low-latency safety prompts)
  - `gemini-3.8-flash`
  - `gemini-flash-latest`

### Progressive Web App (PWA)
- **PWA Plugin**: `vite-plugin-pwa` (v1.3.0)
- **Service Worker Engine**: Workbox with runtime font caching (`google-fonts-cache`, `gstatic-fonts-cache`)
- **Display Modes**: Standalone portrait layout with custom web manifest icons (192x192, 512x512, maskable)

---

## 6. Repository File Structure

```
.
├── .env.example                     # Environment variable template (GEMINI_API_KEY)
├── .gitignore                       # Git exclusion rules
├── DOCUMENTATION.md                 # System architecture & design notes
├── README.md                        # Complete technical documentation
├── bun.lock                         # Bun lockfile
├── index.html                       # HTML5 entry point with Noto font imports & PWA meta
├── metadata.json                    # Google AI Studio application metadata
├── package.json                     # NPM dependencies, scripts, and package declarations
├── public/                          # Static assets & PWA manifest icons
│   ├── apple-touch-icon.png         # iOS home screen icon
│   ├── icon.svg                     # Vector Kolam rosette brand logo
│   ├── pwa-192x192.png              # Standard PWA launcher icon (192px)
│   ├── pwa-512x512.png              # High-resolution PWA launcher icon (512px)
│   └── pwa-maskable-512x512.png     # Android adaptive maskable icon (512px)
├── scripts/
│   └── generate-icons.js            # Node/Sharp script generating PNG icons from SVG
├── server.ts                        # Express API server, AI proxy routes & Vite middleware
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite bundler, Tailwind v4 plugin, and PWA configuration
└── src/
    ├── App.tsx                      # Root component, routing, and quick-exit disguise host
    ├── index.css                    # Tailwind CSS v4 entry point & design tokens
    ├── main.tsx                     # React DOM client entry point
    ├── components/
    │   ├── common/
    │   │   ├── AbhayaLogo.tsx       # Brand vector emblem
    │   │   ├── DiscreetQuickExit.tsx# Quick hide eye-toggle button & Escape key listener
    │   │   ├── DiscreetVoiceGuardModal.tsx # Voice listener permission & configuration modal
    │   │   ├── DisguisedScreen.tsx  # Interactive weather forecast disguise interface
    │   │   ├── FormattedSafetyText.tsx # Markdown/structured safety response parser
    │   │   ├── KolamRosette.tsx     # Traditional geometric protective rosette badge
    │   │   ├── MobileDownloadModal.tsx # PWA installation instructions modal
    │   │   ├── OfflineIndicator.tsx # Offline status badge
    │   │   ├── PWAInstallButton.tsx # Native Add to Home Screen trigger
    │   │   └── ThemeToggle.tsx      # Light/Dark/System theme switcher
    │   ├── incidents/
    │   │   └── IncidentMapView.tsx  # Leaflet interactive map with OSM tiles & buffer rings
    │   ├── layout/
    │   │   ├── BottomNav.tsx        # 5-tab mobile bottom navigation bar
    │   │   ├── Header.tsx           # Global navigation header with disguise & voice triggers
    │   │   └── MobileShell.tsx      # Responsive mobile-first device container
    │   └── voice/
    │       └── DiscreetVoiceModal.tsx # Hands-free voice trigger status dialog
    ├── context/
    │   ├── ThemeContext.tsx         # Theme provider (light/dark/system)
    │   └── VoiceTriggerContext.tsx  # SpeechRecognition and Wake Lock state provider
    ├── data/
    │   ├── demoScenarios.ts         # 5 preloaded real-world safety demonstration cases
    │   ├── initialState.ts          # Seed data for contacts, safe places, and risk quiz
    │   └── translations.ts          # Multilingual string dictionaries (en, te, hi, ta)
    ├── hooks/
    │   ├── useAegisState.tsx        # Central application state manager & storage dispatcher
    │   ├── useDiscreetVoiceTrigger.ts # SpeechRecognition & Web Audio hook
    │   ├── useOnlineStatus.ts       # Browser network connectivity observer
    │   ├── usePWAInstall.ts         # BeforeInstallPromptEvent handler
    │   └── useTranslation.ts        # Language switching hook
    ├── lib/
    │   ├── crypto.ts                # Web Crypto API SHA-256 calculation & hash truncation
    │   ├── storage.ts               # localStorage loader, saver, audit logger & state wiper
    │   └── utils.ts                 # Date formatting, ID generation, and class merging
    ├── pages/
    │   ├── AIAssistantPage.tsx      # Trauma-informed Gemini safety chat interface
    │   ├── AnalyticsDashboardPage.tsx # Zero-PII incident metrics & pattern charts
    │   ├── CyberSafetyPage.tsx      # Sextortion defense, StopNCII guide & link scanner
    │   ├── EmergencyPage.tsx        # SOS hold trigger, silent mode, siren & 112 direct call
    │   ├── EvidenceVaultPage.tsx    # Cryptographic media hashing, linking & JSON export
    │   ├── HomePage.tsx             # Daily safety hub, quick actions & check-in widget
    │   ├── IncidentsPage.tsx        # Incident journal, Leaflet map toggle & intake modal
    │   ├── LocationSafetyPage.tsx   # Safe places directory & location privacy guarantees
    │   ├── OnboardingPage.tsx       # Initial setup walkthrough & permission grants
    │   ├── ProfilePage.tsx          # Settings, language switch, duress PIN & state export/wipe
    │   ├── RecruitmentCheckerPage.tsx # Job offer exploitation screening tool
    │   ├── ResourceNavigatorPage.tsx# Verified Indian helplines (112, 181, 1930, Sakhi)
    │   ├── ResponderDashboardPage.tsx # Sakhi One Stop caseworker triage console
    │   ├── RiskAssessmentPage.tsx   # 10-question early warning risk quiz & recommendations
    │   ├── SafetyCheckinPage.tsx    # Commute countdown timer & automated escalation
    │   └── SafetyPlanPage.tsx       # 6-section readiness checklist with discreet labels
    ├── services/
    │   ├── aiService.ts             # Client API callers for chat & recruitment endpoints
    │   └── emergencyService.ts      # Simulated SMS/WhatsApp & CAD 112 dispatch dispatcher
    └── types/
        └── index.ts                 # Core TypeScript interfaces, types, and enums
```

---

## 7. Backend API Specification

The Express backend (`server.ts`) listens on port `3000` (required by container ingress) and provides three primary endpoints:

### 7.1 Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Verifies backend server status and confirms whether the Gemini API key is configured in the environment.
- **Sample Response**:
  ```json
  {
    "status": "ok",
    "appName": "Abhaya",
    "hasGemini": true,
    "timestamp": "2026-09-20T06:15:00.000Z"
  }
  ```

### 7.2 AI Safety Chat
- **Endpoint**: `POST /api/ai/chat`
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "message": "My supervisor at work took my passport and won't return it.",
    "conversationHistory": [
      {
        "id": "msg_1",
        "sender": "user",
        "text": "Hello, I need legal advice."
      }
    ],
    "language": "en"
  }
  ```
- **Response**:
  ```json
  {
    "reply": "Restricting personal identity documents (such as withholding your passport or Aadhaar) is a serious violation associated with coercive control and forced labor.\n\nKey Steps:\n1. Under Indian law, no employer has the legal right to confiscate your original papers.\n2. Contact the National Emergency Number at 112 or the Women Helpline at 181.\n3. Seek free legal guidance through NALSA (dial 15100).",
    "isFallback": false,
    "disclaimer": "Informational safety tool. Not a substitute for emergency services."
  }
  ```

### 7.3 Recruitment Offer & Scam Analysis
- **Endpoint**: `POST /api/ai/analyze-recruitment`
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "text": "Urgent overseas job in Cambodia. ₹1.5 Lakh salary, no experience required. Surrender original passport and ₹25,000 security deposit. Contact on Telegram.",
    "url": "https://t.me/OverseasQuickJobs"
  }
  ```
- **Response**:
  ```json
  {
    "riskLevel": "CRITICAL",
    "riskScore": 100,
    "detectedIndicators": [
      "Demands upfront fee, security deposit, or payment prior to employment",
      "Demands retention of original identification or passport documents",
      "Disproportionately high compensation for zero qualifications or vague roles",
      "Informal communication channels without verifiable registered entity"
    ],
    "explanation": "This job offer contains multiple severe red flags associated with debt bondage, overseas employment scams, and human trafficking.",
    "recommendations": [
      "Never surrender your passport, Aadhaar, or educational certificates to any agency.",
      "Verify overseas recruiters through the Ministry of External Affairs eMigrate portal (emigrate.gov.in).",
      "Insist on a legitimate, written employment contract before accepting travel arrangements.",
      "Share recruiter details and destination address with a trusted contact before traveling."
    ],
    "disclaimer": "This screening tool highlights warning patterns. It is not an official legal adjudication or guarantee."
  }
  ```

---

## 8. Installation, Configuration & Running

### 8.1 Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **NPM**: Version 9.0.0 or higher (or `bun` / `pnpm`)

### 8.2 Environment Configuration
Create a `.env` file in the root directory by copying `.env.example`:
```bash
cp .env.example .env
```

Define the optional Google Gemini API key:
```env
# Server-side Gemini API key (never exposed to client bundle)
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note**: If `GEMINI_API_KEY` is not provided, Abhaya gracefully shifts to its local rule-based safety engine. All core safety features, emergency SOS flows, cryptographic hashing, and offline resources continue to function seamlessly.

### 8.3 Installing Dependencies
```bash
npm install
```

### 8.4 Running the Development Server
```bash
npm run dev
```
- Boots the Express server with TypeScript support using `tsx`.
- Automatically mounts Vite development middleware.
- Accessible locally at `http://localhost:3000`.

### 8.5 Code Quality & Verification
Run TypeScript type-checking to verify zero compilation or interface errors:
```bash
npm run lint
```

### 8.6 Production Build & Execution
```bash
# Build the client-side SPA and bundle server.ts into dist/server.cjs
npm run build

# Launch the production Node.js server
npm start
```
The production start command runs `node dist/server.cjs`, serving the optimized static assets from `dist/` and handling `/api/*` requests on port `3000`.

---

## 9. Progressive Web App (PWA) Deployment & Offline Use

Abhaya is configured for full offline availability as a Progressive Web App:
- **Service Worker Lifecycle**: Configured via `vite-plugin-pwa` with `registerType: 'autoUpdate'`.
- **Precached Assets**: HTML entry point, compiled JavaScript bundles, CSS stylesheets, SVGs, and Google Web Fonts (`Noto Sans`, `Noto Serif`).
- **Home Screen Installation**: Supports the native Web App Install banner (`beforeinstallprompt`) on Android Chrome and provides visual "Add to Home Screen" instructions for iOS Safari.
- **Standalone Display**: Launches in dedicated `standalone` portrait mode without browser URL address bars or browser navigation chrome, reinforcing a native mobile application experience.

---

## 10. Future Scope & Planned Features

The following capabilities are **planned for future releases** and are explicitly documented here to distinguish them from the currently implemented codebase:

1. **Production Carrier SMS & WhatsApp Integration**:
   - Integration with enterprise SMS gateways (e.g., Twilio, Infobip, Gupshup) or the Meta WhatsApp Cloud API to enable automated carrier-grade SMS and WhatsApp message transmission to trusted contacts.
2. **State Police 112 ERSS CAD API Integration**:
   - Secure server-to-server API bridge with State Emergency Response Support System (ERSS) dispatch centers for verified automated distress ticket ingestion.
3. **End-to-End Encrypted Cloud Synchronization**:
   - Zero-knowledge encrypted cloud backup (e.g., using user-derived AES-GCM-256 keys) allowing users to recover incident logs and evidence across devices without server operators having access to raw data.
4. **On-Device Acoustic Event Detection**:
   - Lightweight TensorFlow.js or ONNX acoustic models running in the browser to detect ambient distress indicators (e.g., glass breakage, sudden acoustic spikes, screams) without recording raw continuous audio to disk.
5. **Hardware BLE Wearable Pairing**:
   - Web Bluetooth API integration to pair discreet physical panic triggers (smart jewelry, discreet keyfobs, smart rings).
6. **Statutory Section 65B / 63 BSA Forensic Certificate Generator**:
   - Automated generation of court-admissible PDF evidence packages signed with cryptographic x509 timestamp certificates detailing system clock offsets, browser user-agent signatures, and device hashes.

---

## 11. Security, Privacy & Ethical Principles

- **Zero-Knowledge Architecture**: All personal identifiers, contact numbers, incident entries, and uploaded evidence files reside strictly within the user's browser `localStorage`. No user data is stored on backend databases or transmitted to third-party tracking servers.
- **Client-Side Hashing**: Evidence fingerprints are computed locally before any network interaction occurs.
- **Privacy Guarantees**: Coordinates are queried only upon deliberate user actions (Emergency SOS, check-in initiation, or manual incident tagging). Background continuous tracking is strictly prohibited.
- **Non-Judgmental Safety Ethics**: Abhaya's guidance and classification rules are designed with trauma-informed care principles, ensuring users are never blamed, questioned, or exposed to dangerous escalations.
