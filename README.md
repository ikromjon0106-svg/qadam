# 🏃‍♂️ Qadam 

![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![Base44](https://img.shields.io/badge/Base44-SDK_Integrated-black?style=for-the-badge)

**Qadam** is an innovative mobile Move-to-Earn (M2E) Web platform with gamification elements. The application motivates users to move more by converting their steps into digital coins. The project combines fitness tracking with unique tactical game mechanics: planting virtual bombs on the map, using shields to protect your balance, completing missions, and trading on the internal marketplace.

---

## 🛠 Tech Stack

### Frontend
*   **Core:** React 18, Vite (with `@base44/vite-plugin`)
*   **Routing:** React Router DOM v6
*   **State Management & Caching:** TanStack React Query v5, React Context API
*   **Styling & UI:** Tailwind CSS, Radix UI (Headless UI), Framer Motion (animations)
*   **Maps & Geolocation:** React-Leaflet v4 (integration of interactive maps for bomb and route mechanics)
*   **Forms & Validation:** React Hook Form + Zod
*   **Charts:** Recharts

### Backend Infrastructure
*   **Database:** Supabase (PostgreSQL)
*   **BaaS / SDK:** Base44 SDK (`@base44/sdk`) — authentication, sessions, and server-side functions management
*   **Authentication:** Isolated `AuthContext`, proxying requests to `/api/apps/public` via Vite configuration

---

## 🏗 Architecture and Data Logic

The application is built using a modular architecture with a clear separation of logic (Hooks/API) and presentation (Components/Pages). Routing is protected by the `ProtectedRoute` component, which is seamlessly integrated with `base44.auth.me()` for session verification.

### Core Entities and Data Schemas

1.  **`UserProfile`**
    *   Stores user statistics, current coin balance (Q-Coins), level, and active equipped items (e.g., shields).
    *   Linked to Base44 SDK authentication.
2.  **`Activity` (Route)**
    *   Records walking or running sessions.
    *   **Data:** Route coordinates are stored in `JSONB` format (GeoJSON LineString) for rendering the track on the map using `React-Leaflet`. It also includes metrics: time, distance, average speed, and earned coins.
3.  **`Bomb` & `Shield` (Tactical Elements)**
    *   `Bomb`: Objects on the map (`MapTracking`) that have `lat/lng` coordinates, a blast radius, and a timer. If another user enters the blast radius without a shield, they lose a portion of their earned coins.
    *   `Shield`: An inventory item providing temporary or one-time immunity from bombs.
4.  **`Mission`**
    *   Daily and weekly tasks (e.g., "Walk 10,000 steps", "Plant 2 bombs").
    *   Have statuses: `locked`, `in_progress`, `completed`, `claimed`.
5.  **`Achievement`**
    *   Global rewards for long-term goals. Linked to the profile table (1-to-Many relation).

---

## 🚀 Local Setup

### 1. Prerequisites
*   Node.js (v18 or higher)
*   npm (v9 or higher)

### 2. Clone and install dependencies
```bash
git clone <your-repository>
cd qadam
npm install
```

### 3. Environment Variables
Create an `.env` file in the root directory of the project and add the following keys, which are necessary for the Base44 SDK to function correctly and for request proxying:

```env
VITE_BASE44_APP_BASE_URL=https://api.base44.io
VITE_BASE44_APP_ID=6a2270f9b1e691bc8ab87bf6
VITE_BASE44_API_KEY=e61be199655e4b4082a21d46745b077d
# If using a specific functions version
VITE_BASE44_FUNCTIONS_VERSION=v1 
```

> **Important:** `vite.config.js` is configured to proxy the local `/api` to `VITE_BASE44_APP_BASE_URL` to bypass CORS restrictions during development.

### 4. Run the development server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📦 NPM Scripts

The following commands are configured in `package.json`:

*   `npm run dev` — Starts the local development server with HMR (Hot Module Replacement).
*   `npm run build` — Creates an optimized production build in the `dist` folder.
*   `npm run preview` — Locally previews the built production version.
*   `npm run lint` — Runs code linting using ESLint.
*   `npm run lint:fix` — Automatically fixes code-style errors.
*   `npm run typecheck` — Checks TypeScript types (via `jsconfig.json`).

---

## 📂 Project Structure

```text
qadam/
├── public/                 # Static assets
├── src/
│   ├── api/                # API initialization and clients (base44Client.js)
│   ├── components/         # Reusable UI components (Radix UI + Tailwind)
│   │   ├── layout/         # Page layouts (MobileLayout)
│   │   └── ui/             # Basic atomic elements
│   ├── hooks/              # Custom React Hooks
│   ├── lib/                # Utilities, Contexts (AuthContext), and settings (app-params)
│   ├── pages/              # Main application screens (MapTracking, Dashboard, etc.)
│   ├── utils/              # Helper formatting functions
│   ├── App.jsx             # Root component with routing
│   ├── index.css           # Global styles and Tailwind theme variables
│   └── main.jsx            # React entry point
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind design system configuration
└── vite.config.js          # Bundler and proxy settings
```

---

## 👨‍💻 Developers

*   **This application was written by team 'B2'**
*   *Project "Qadam"*

---
*Developed with modern web standards and passion for a healthy lifestyle.*
