# Aegis — Women's Safety, Prevention & Early Risk Detection Platform

> **Aegis** is an offline-first, mobile-optimized progressive web platform engineered for women's safety, coercion detection, tamper-evident incident documentation, and discreet emergency response.

---

## 🛡️ Core Mission & Vision

Traditional personal safety apps often focus solely on physical panic buttons after an attack has already started. **Aegis** bridges the critical gap by providing **prevention**, **early coercion detection**, **cryptographic evidence preservation**, and **stealth emergency triggers** before physical danger escalates.

---

## 🎨 Design System & Visual Identity

Aegis features a bespoke dual-theme design system engineered for high contrast, maximum legibility in stressful scenarios, and visual minimalism:

### 1. Cream Mode (Signature Light Theme)
- **Canvas / Background**: `#FDFBD4` (warm soft cream)
- **Cards & Surfaces**: Clean white `#FFFFFF` with high-contrast solid black `#000000` borders and neomorphic hard shadows (`shadow-[2px_2px_0px_0px_#000]`).
- **Typography**: Pitch-black text with 100% WCAG AAA contrast ratio.
- **Accents**: Deep black pill badges, subtle neutral fills.

### 2. Dark Mode (Stealth Dark Theme)
- **Canvas / Background**: Deep pitch black `#000000` / `#050505`
- **Cards & Surfaces**: Rich black `#0A0A0A` with `#FDFBD4`/30 borders and subtle highlights.
- **Typography & Accents**: `#FDFBD4` cream text highlights and badges for low eye-strain in dark or discreet conditions.

### 3. Minimalist Iconography
- All icons use geometric, refined line weights (`stroke-[1.8]`).
- Header and navigation controls use circular `rounded-full` touch targets (`h-8 w-8` and `h-10 w-10`).
- Bottom navigation features micro-dot indicators below active tabs.

---

## 🚀 Key Features & Capabilities

### 1. Emergency Response & SOS Engine
- **Hold-to-Activate Trigger**: Requires a deliberate 1.5-second hold gesture on the main dashboard to prevent accidental pocket activation, complete with a smooth visual progress fill.
- **Multi-Channel Dispatch Simulation**: Simulates immediate SMS and WhatsApp broadcasts to configured emergency contacts with real-time GPS coordinates.
- **Siren & Visual Strobe**: High-decibel audio alarm paired with screen strobe for disorienting attackers or drawing public attention.
- **Direct Emergency Helplines**: Dedicated, cleanly aligned one-tap shortcuts to **112** (National Emergency) and **181** (Women Helpline in India).
- **Duress PIN Protection**: If forced to enter a deactivation PIN under coercion, entering the secret Duress PIN displays a normal, harmless deactivation screen while silently keeping emergency services and contacts alerted in the background.

### 2. Hands-Free Voice Guard (Keyword Detection)
- Utilizes the Web Speech Recognition API to continuously listen for customizable distress trigger phrases (e.g., *"Help me Aegis"*, *"Bachao"*, *"Emergency"*).
- Triggers the SOS sequence hands-free if physical access to the device is restricted.

### 3. Discreet Quick Exit (Calculator Disguise)
- One-tap quick hide button (`EyeOff` icon) in the header instantly switches the viewport to a realistic, fully interactive **Calculator app**.
- History and active screens are masked from prying eyes; tap the secret title sequence to return to Aegis.

### 4. Cryptographic Incident Vault
- Secure journal for logging dates, descriptions, perpetrator details, witness accounts, and attached photo evidence.
- Computes a client-side **SHA-256 cryptographic hash** of every incident entry at the moment of creation, providing a verifiable digital audit trail that proves the entry has not been altered after the fact.
- One-tap export as formatted text evidence for legal, counseling, or law enforcement use.

### 5. Early Warning Coercion & Risk Quiz
- A 10-question evaluation instrument measuring subtle signs of emotional abuse, financial deprivation, digital surveillance, movement restriction, and escalating isolation.
- Categorizes risk levels (Low, Moderate, High, Severe) with trauma-informed recommendations and immediate next steps.

### 6. AI Safety & Coercion Advisor (Gemini 3.8-Flash)
- Integrated AI assistant powered by Google's `gemini-3.8-flash` model.
- Trauma-informed system instructions: provides grounded, non-victim-blaming guidance, boundary enforcement strategies, and safety planning tips.
- **Resilient Fallback Matrix**: If API access is restricted or network is offline, a local rule-based safety engine guarantees immediate, helpful responses and emergency helpline numbers without delay.
- Guaranteed 5-second asynchronous timeout race (`withTimeout`) to prevent request hanging.

### 7. Exploitation & Fake Job Offer Checker
- Screens overseas job advertisements, domestic employment offers, modeling castings, and travel opportunities for red flags:
  - Demand for passport or identity document surrender
  - Upfront visa/travel processing fees
  - Unregistered recruitment agents
  - Vague job descriptions or refusal of written contracts

### 8. Timed Commute & Meeting Check-In
- Set a countdown timer when commuting through unsafe areas, taking late-night cabs, or meeting unfamiliar individuals.
- If the timer expires without user confirmation, the system triggers the emergency escalation flow.

### 9. Offline-First Progressive Web App (PWA)
- Full Service Worker support (`sw.js`) and Web App Manifest (`manifest.json`).
- Fully installable to iOS and Android home screens without third-party app stores.
- All core personal safety data, emergency contacts, safety plans, and incident hashes persist offline in `localStorage`.

---

## 🛠️ Architecture & Tech Stack

```
Aegis Architecture
├── Client (Single Page App / PWA)
│   ├── React 18 + TypeScript + Vite
│   ├── Tailwind CSS (Custom #FDFBD4 / #000000 dual themes)
│   ├── Lucide React (Minimalist vector icons)
│   ├── Web Speech API (Hands-free Voice Guard)
│   ├── Web Crypto API (SHA-256 Incident Vault hashing)
│   └── Service Worker (Offline caching & PWA installability)
│
└── Backend (Express Server)
    ├── server.ts (Proxy server listening on port 3000)
    ├── @google/genai SDK (gemini-3.8-flash)
    ├── Rule-Based Safety Engine (Offline & latency fallback)
    └── Vite Dev Middleware / Static production file server
```

---

## 📡 API Endpoints

### 1. `GET /api/health`
Health check and environment verification.
```json
{
  "status": "ok",
  "appName": "Aegis",
  "hasGemini": true,
  "timestamp": "2026-09-17T02:35:55.075Z"
}
```

### 2. `POST /api/ai/chat`
Engage with the trauma-informed AI Safety Advisor.
- **Request Body**:
  ```json
  {
    "message": "Someone took my documents and won't let me leave",
    "history": []
  }
  ```
- **Response**:
  ```json
  {
    "reply": "Restricting identity documents or preventing someone from leaving is a serious warning indicator associated with coercive control...",
    "isFallback": false,
    "disclaimer": "Informational safety tool. Not a substitute for emergency services."
  }
  ```

### 3. `POST /api/ai/analyze-recruitment`
Evaluate a job offer or travel proposal for exploitation indicators.
- **Request Body**:
  ```json
  {
    "text": "Offering high paying job abroad, we will hold your passport during transit."
  }
  ```
- **Response**:
  ```json
  {
    "riskLevel": "HIGH",
    "flags": ["Passport or ID retention requested", "High pressure tactics"],
    "analysis": "Withholding passports is an international red flag for trafficking and coercive debt bondage...",
    "verificationSteps": [
      "Verify recruiter registration with the Ministry of External Affairs",
      "Never surrender original identity documents"
    ]
  }
  ```

---

## 📞 Verified Helplines Integrated in Aegis

| Service | Contact | Coverage |
| :--- | :--- | :--- |
| **National Emergency (Police, Fire, Ambulance)** | `112` | All India (24x7) |
| **Women Helpline** | `181` | Pan-India Toll-Free |
| **National Commission for Women (NCW)** | `7827170170` | 24x7 Domestic Violence Helpline |
| **Women in Distress** | `1091` | Police Emergency Cell |
| **Cyber Crime Portal** | `1930` / `cybercrime.gov.in` | Financial Fraud & Harassment |
| **Childline (Minors & Youth)** | `1098` | 24x7 Support |

---

## 🔒 Security & Privacy Commitments

1. **Client-Side Data Storage**: All contacts, personal notes, journal entries, and safety plans are stored on the user's device (`localStorage`).
2. **Zero Plaintext Cloud Leakage**: No personal journal text is sent to third-party tracking services.
3. **Cryptographic Integrity**: SHA-256 digest calculations occur entirely in the user's browser via the native Web Cryptography API (`crypto.subtle`).
4. **Discreet Operation**: The Quick Exit calculator mode and generic disguised screen allow instant masking in case of device inspection.
