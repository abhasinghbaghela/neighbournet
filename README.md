# CivicQuest – Hyperlocal Community Safety Network (Safety Grid V2.4)

[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-emerald.svg)](https://github.com)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-FFCA28.svg)](https://firebase.google.com/)
[![Express](https://img.shields.io/badge/Backend-Node%20Express-000000.svg)](https://expressjs.com/)
[![Leaflet](https://img.shields.io/badge/Map-Leaflet%20OSM-199900.svg)](https://leafletjs.com/)

CivicQuest is an enterprise-grade, mobile-first Progressive Web Application (PWA) designed for residents of apartments, housing societies, and municipal wards. It allows citizens to report local hazards, verify existing issues through community quorum consensus, receive real-time dispatch alerts, and monitor their neighbourhood safety health score.

---

## 📸 Visual Identity & Design Reference

CivicQuest has been carefully designed to preserve the visual identity from prototype screenshots:
- **Primary Brand Color:** Deep Forest Pine Teal (`#09544c`, `bg-pine-800`), used for active navigation states, primary report actions, and verified statuses.
- **Top Bar:** Features the CivicQuest Shield Emblem, Society/Ward Selector (`Ward 14`), Urgent Alert Ticker (`Water Main Burst on 4th Cross — BWSSB crew on site • Isolation active`), Quick Search, `+ Report Issue` action, and user profile avatar.
- **Left Navigation:** Society live badge (`Ward 14 • Greenwood  Live`), role view toggle switch, user karma badge (`Arvind K. • 485 Karma • Rank #4`), and clean navigation links.
- **Resident Dashboard:** 4 KPI stat cards (`Active In Ward: 4`, `Ward Health: 86/100`, `Avg SLA Speed: 4.2 hrs`, `Your Karma: 485`), Category Filter Chips (`All`, `Critical`, `Water`, `Roads`, `Electrical`, `Sanitation`), Incident Cards with verification progress, and the live `Municipal Dispatch Feed` (BWSSB, BESCOM).
- **Live Community Map:** Clean OpenStreetMap tile layers (free, reliable, zero watermarks), radius circles (100–200m quorum zones), and floating preview cards.
- **Report Incident Channel:** 2x3 Category grid (`Water & Utilities`, `Roads & Potholes`, `Electrical & Lighting`, `Sanitation & Waste`, `Public Safety`, `Others`), 2x2 Severity selector, Gemini AI auto-classification, GPS auto-detection, and canvas photo compression.

---

## 🛠️ Complete Technology Stack

### Frontend:
- **HTML5 & CSS3**
- **Tailwind CSS 3.4** (Custom Pine Teal `#09544c` & Civic Palette)
- **React.js 18.3**
- **Vite 5.4** & **TypeScript 5.6**
- **Lucide React** (icons throughout)
- **Leaflet 1.9** with OpenStreetMap (zero paid Mapbox/Carto keys needed)
- **Framer Motion** & **TanStack Query**
- **PWA Capabilities:** Web App Manifest, Service Worker (`sw.js`), Offline IndexedDB Report Queue

### Backend:
- **Node.js** & **Express.js 5.3**
- **REST APIs:** Robust endpoints for incident ingestion, spatial clustering, quorum voting, authority assignment, and health score calculation
- **Persistent Data Store:** Synchronized JSON master telemetry with automatic database seeding

### Primary Cloud Database & Services:
- **Firebase Authentication:** Email/Password, Google Sign-In, Anonymous Guest Mode
- **Cloud Firestore:** Primary real-time database for incidents, users, votes, societies, and notifications
- **Firebase Storage:** Ground photographic evidence and municipal completion proof uploads
- **Firebase Security Rules:** Production `firestore.rules` and `storage.rules`

### Additional Analytics & AI:
- **MongoDB Analytics Schema:** Advanced aggregation, reporting, and historical exports
- **Gemini API Integration:** Multi-modal category suggestions, incident description refinement, and spatial semantic deduplication

---

## 📂 Project Directory Structure

```
neighbournet/
├── client/
│   ├── public/
│   │   ├── manifest.json            # PWA web app manifest
│   │   └── sw.js                    # Service worker offline caching
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/               # Municipal & Society Admin Portal
│   │   │   ├── clustering/          # Spatial AI Deduplication View
│   │   │   ├── common/              # Notifications, SOS Modal, Tour
│   │   │   ├── feed/                # Incident Dossier Modal & Cards
│   │   │   ├── gamification/        # Karma Leaderboard & Citizen Citadel
│   │   │   ├── health/              # Health Score (0-100) & Trends
│   │   │   ├── home/                # Resident Dashboard (Screenshot 1)
│   │   │   ├── layout/              # Header, Sidebar, MobileNav
│   │   │   ├── map/                 # Live Incident Map (Screenshot 2)
│   │   │   ├── reporting/           # Report Issue Form (Screenshot 3)
│   │   │   └── verification/        # Community Quorum Verification View
│   │   ├── context/                 # AuthContext, IncidentContext, I18nContext
│   │   ├── services/                # Firebase, REST API, AI Vision, HealthScore
│   │   ├── types/                   # TypeScript interfaces
│   │   ├── App.tsx                  # Main router & modal controller
│   │   └── index.css                # CivicQuest styling & custom scrollbars
├── server/
│   ├── data/
│   │   └── incidents.json           # Persistent master telemetry store
│   └── server.js                    # Express.js REST API server
├── firebase/
│   ├── firestore.rules              # Secure Firestore security rules
│   ├── firestore.indexes.json       # Composite query indexes
│   └── storage.rules                # Firebase Storage security rules
├── index.html                       # HTML5 entry with PWA manifest
├── package.json                     # Dependencies & scripts
├── tailwind.config.js               # Theme configuration
├── .env.example                     # Environment template
└── README.md                        # Documentation
```

---

## ⚡ Quick Start & Development

### 1. Installation
```bash
cd "C:\Users\adv danish\.gemini\antigravity\scratch\neighbournet"
npm install
```

### 2. Run the Express Backend Server
```bash
npm run server
```
Server starts on `http://localhost:5000` with live REST endpoints:
- `GET /api/incidents` — Search and filter incidents
- `POST /api/incidents/report` — Report incident with server duplicate auto-clustering
- `POST /api/incidents/:id/verify` — Quorum consensus voting
- `POST /api/incidents/:id/assign` — Municipal crew dispatch
- `PATCH /api/incidents/:id/status` — Status transition (In Progress, Resolved)
- `GET /api/health-score` — Transparent 0-100 algorithmic score
- `POST /api/sos` — Emergency distress beacon broadcast
- `POST /api/ai/suggest` — Gemini AI categorization
- `GET /api/analytics/export` — Aggregation export

### 3. Run the Frontend Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates optimized static bundle in `dist/` ready for Vercel or cloud static hosting.

---

## 🏛️ Application Modules

| Module | Route / Tab | Description |
| :--- | :--- | :--- |
| **Resident Dashboard** | `home` | Personalized overview, 4 KPI stats, incident cards, BWSSB/BESCOM dispatch feed |
| **Live Community Map** | `map` | Interactive Leaflet OpenStreetMap with category layers, 150m radius circles, floating incident cards |
| **Report an Incident** | `report` | 6 categories, 4 severities, GPS auto-detect, photo upload with compression, anonymous toggle |
| **Community Verification** | `verify` | Decentralized quorum voting. 5 resident confirmations trigger priority dispatch |
| **Duplicate Clustering** | `clusters` | Spatial clustering (100–200m) and Gemini AI semantic similarity comparison |
| **Health Score (0–100)** | `health` | Transparent algorithm: severity penalties, SLA bonus, 7-day trend chart |
| **Authority Admin** | `admin` | Work order assignment (BWSSB, BESCOM, PWD), resident onboarding, announcements, CSV export |
| **Emergency SOS** | Top Bar / Modal | One-touch distress beacon broadcasting to police and volunteers with Indian emergency helplines (`112`, `108`, `101`, `1091`) |
| **Citizen Citadel** | `leaderboard` | Community guardian ranks, karma rewards (+25 Karma per honest verification), quests |

---

## 🔐 Security & Privacy
- **Anonymous Reporting:** Ordinary residents see "Anonymous Resident", while secure audit logs are preserved for authorized moderation.
- **Quorum Integrity:** One vote per resident per incident. Prevents self-voting on submitted tickets.
- **Firebase Security Rules:** Documented in `firebase/firestore.rules` and `firebase/storage.rules`.
- **Environment Variables:** All secrets and API credentials reside in `.env`.
