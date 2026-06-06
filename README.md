# 🏃‍♂️ Qadam



![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)

![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?style=for-the-badge&logo=vite)

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)

![Base44 BaaS](https://img.shields.io/badge/Base44-Full_Backend_&_Hosting-orange?style=for-the-badge)



**Qadam** is an innovative mobile Move-to-Earn (M2E) Web application built with deep gamification elements. The platform motivates users to stay active by converting physical steps into digital currency (Q-Coins).



The project seamlessly combines fitness tracking with tactical gaming mechanics: planting virtual bombs on the map, equipping shields to protect your coin balance, completing dynamic missions, and trading on the internal marketplace.



---



## 🏗️ Platform Architecture (Powered by Base44)



The entire server-side infrastructure and deployment of the project are built natively on top of the **Base44** ecosystem. The application operates entirely as a Backend-as-a-Service (BaaS) solution:



* **Full Backend-as-a-Service (BaaS):** Database schemas, entity relationships, security controls, and built-in AI modules are configured and managed directly within the Base44 workspace.

* **Hosting & Cloud Infrastructure:** The application is fully deployed, optimized, and hosted inside the Base44 cloud architecture.

* **Authentication & Guardrails:** User registration, active sessions, and protected route access are handled via an isolated frontend `AuthContext` tightly integrated with the `@base44/sdk`.



---



## 🛠 Tech Stack



### Frontend

* **Core:** React 18, Vite (integrated with `@base44/vite-plugin`)

* **Routing:** React Router DOM v6 (routes secured via a specialized `ProtectedRoute` wrapper)

* **Data Management:** TanStack React Query v5 (server-state caching and synchronization) + React Context API

* **UI & Design System:** Tailwind CSS, Radix UI (Headless primitives), Framer Motion (fluid mobile animations)

* **Maps & Geolocation:** React-Leaflet v4 (interactive maps for rendering routes and live bomb detonation zones)

* **Forms & Validation:** React Hook Form + Zod

* **Data Visualizations:** Recharts



### Backend Infrastructure (Base44 Cloud)

* **Base44 SDK (`@base44/sdk`):** Connects the client interface using a unique `appId` and secure `api_key` to execute direct cloud mutations, analytics, and authentication actions.

* **API Proxying:** Local `/api` requests are automatically routed via Vite configuration to the active Base44 endpoint to bypass CORS restrictions during development.



---



## 📊 Base44 Data Structure



The project database relies on strict JSON schemas and managed tables deployed on the Base44 platform:



1. **`UserProfile`**

   * Manages user profiles, historical stats, level progression, coin balance (Q-Coins), and active inventory components (e.g., active protection shields). Directly tied to Base44 SDK Auth.

2. **`Activity`**

   * Stores physical workout data (walking/running logs). Route paths are recorded in a specialized `JSONB` array of geospatial points (`lat`, `lng`) to cleanly draw lines on the map using `React-Leaflet`.

3. **`Bomb`**

   * Tactical gaming entities deployed onto the interactive map. They contain setup coordinates, explosion radius parameters, placement costs, and coin deduction penalties. Passing players lose coins unless protected.

4. **`Mission`**

   * Daily and weekly targets containing dynamic states (`locked`, `in_progress`, `completed`, `claimed`).

5. **`Achievement`**

   * Global milestone achievements linked directly to the player profile (featuring customizable `badge_color` parameters).



---



## 🚀 Local Deployment



### 1. Prerequisites

Ensure you have the following packages installed locally:

* **Node.js** (v18 or higher)

* **npm** (v9 or higher)

## 👨‍💻 Developers



*   **This application was written by team 'B2'**

*   *Project "Qadam"*



---

*Developed with modern web standards and passion for a healthy lifestyle.*

