# Aegis — Women's Safety, Prevention & Early Risk Detection Platform

[![Platform](https://img.shields.io/badge/Platform-PWA%20%7C%20Web-blue)](#)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)](#)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb)](#)
[![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8)](#)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini%203.8--Flash-orange)](#)

Aegis is an offline-first, mobile-optimized progressive web app engineered for women's personal safety, early coercion risk assessment, tamper-evident incident logging with SHA-256 cryptographic hashing, hands-free voice guard, and discreet emergency response.

For complete architectural and technical details, see [DOCUMENTATION.md](./DOCUMENTATION.md).

---

## ✨ Highlights

- **Dual-Theme High Contrast**: 
  - **Cream Mode**: `#FDFBD4` signature canvas with pitch-black typography and crisp borders.
  - **Dark Mode**: `#000000` pitch-black canvas with `#FDFBD4` cream highlights.
- **Emergency SOS Trigger**: 1.5-second hold gesture with simulated multi-channel SMS/WhatsApp location dispatch.
- **Cleanly Aligned Direct Helplines**: Instant access to **112** (Police Emergency) and **181** (Women Helpline).
- **Hands-Free Voice Guard**: Speech recognition listening for emergency trigger words (*"Help me Aegis"*, *"Bachao"*).
- **Cryptographic Incident Vault**: Client-side SHA-256 digital fingerprinting of evidence notes and timestamps.
- **AI Safety Advisor**: Powered by `gemini-3.8-flash` with 5s timeout and offline trauma-informed fallback rules.
- **Fake Job & Trafficking Checker**: Screen suspicious overseas employment offers for coercion red flags.
- **Discreet Calculator Disguise**: Instantly hides the safety platform behind a functional calculator.
- **Full PWA Support**: Installable on iOS/Android home screens; persists data offline.

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
The server will start on port `3000` (http://localhost:3000).

### Production Build
```bash
npm run build
npm start
```

---

## 📖 Complete Documentation

Please refer to [`DOCUMENTATION.md`](./DOCUMENTATION.md) for full endpoint specifications, threat models, safety protocols, and privacy guarantees.
