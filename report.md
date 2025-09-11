
# RailVision AI - Project Report

This document provides a comprehensive overview of the RailVision AI application, its features, and its technical architecture. It is a living document that will be updated as the project evolves.

## 1. Project Overview

**RailVision AI** is an advanced, AI-powered decision-support tool designed for railway traffic controllers. It provides intelligent predictions and optimized action plans to manage dense railway traffic in real-time, enhancing operational efficiency and safety.

The application is built as a web-based platform that visualizes a live "digital twin" of a railway station, processes real-time train data, and leverages a powerful AI engine to generate optimal traffic flow solutions.

## 2. Core Features Implemented

### 2.1. Live Digital Twin Map
- **Description:** A live, schematic representation of the selected railway station, including platforms, tracks, and signals. It displays the real-time position and status of all active trains in the vicinity.
- **Technical Implementation:**
    - The map is an SVG rendered within the `Map` component (`src/components/dashboard/map.tsx`).
    - Train icons (`TrainFront`) are dynamically positioned based on their status (`Approaching`, `Halted`, `Departed`) fetched from the live data feed.
    - A client-side `useEffect` hook runs a timer to display a live clock, preventing Next.js hydration errors.

### 2.2. Live Train Status Monitoring
- **Description:** A real-time tabular view of all active trains, showing their name, status (On Time, Delayed, Halted), last reported location, and ETA/ETD.
- **Technical Implementation:**
    - The `LiveStatusPanel` component (`src/components/dashboard/live-status-panel.tsx`) displays the data.
    - Data is fetched from the RailRadar API via the `getLiveStationStatus` function in `src/lib/railway-api.ts`.
    - The dashboard automatically refreshes this data every 15 minutes and includes a manual refresh button.

### 2.3. AI-Powered Route Optimization
- **Description:** The core feature where the AI engine generates a safe, conflict-free, and efficient action plan for all trains. The plan is presented as a chronological list of actions (Assign, Hold, Proceed) with clear reasoning.
- **Technical Implementation:**
    - This is powered by a Genkit flow defined in `src/ai/flows/optimize-train-routes.ts`.
    - A detailed prompt instructs the AI model (`gemini-2.5-flash`) on safety rules, constraints, and the required JSON output format.
    - The `AIPanel` component (`src/components/dashboard/ai-panel.tsx`) displays the results in a sorted table.

### 2.4. Manual Override & Scenario Building
- **Description:** A critical "human-in-the-loop" feature allowing controllers to input ad-hoc constraints that the AI must treat as absolute rules. This has evolved from a simple text area to a structured scenario builder.
- **Technical Implementation:**
    - The `ControlPanel` (`src/components/dashboard/control-panel.tsx`) now allows adding specific rules (e.g., platform closures, train delays).
    - These structured rules are formatted into a clear, plain-text instruction that is passed to the `manualOverride` field in the AI prompt.
    - The AI has been specifically prompted to treat these overrides as strict, limiting constraints on its planning.

### 2.5. Dynamic Station Switching
- **Description:** The entire application can be switched to monitor and manage any major railway station in the provided list. This changes the context for live data, maps, and AI optimizations.
- **Technical Implementation:**
    - A React Context (`src/context/station-context.tsx`) provides global state for the currently selected station.
    - The `Settings` page (`src/app/settings/page.tsx`) allows the user to change the active station using the `StationSwitcher` component.
    - All data-fetching functions and UI components (like the Map title) are tied to this context, ensuring they update automatically when the station is changed.

### 2.6. Analytics Dashboard (Prototype)
- **Description:** A dedicated page to visualize Key Performance Indicators (KPIs) and historical performance data.
- **Technical Implementation:**
    - A new page at `/analytics` (`src/app/analytics/page.tsx`).
    - Uses `recharts` for charting and `shadcn/ui` `Card` components to display KPIs.
    - **Note:** Currently, this page uses static, mocked data. It is designed to be connected to a live data source or a data warehouse in the future.

## 3. Technical Architecture

### 3.1. Frontend
- **Framework:** Next.js 15 with the App Router.
- **UI:** React 18 with TypeScript.
- **Styling:** Tailwind CSS with a themable system defined in `src/app/globals.css`.
- **Components:** `shadcn/ui` for the core component library, supplemented by custom-built dashboard components.
- **State Management:** Primarily React Hooks (`useState`, `useEffect`). Global state for the active station is managed via React Context (`StationProvider`).

### 3.2. Backend (AI Engine)
- **Framework:** Genkit 1.14.
- **Model Provider:** `@genkit-ai/googleai`, utilizing the `gemini-2.5-flash` model.
- **Logic:** AI logic is encapsulated in server-side "flows" located in `src/ai/flows/`. These are TypeScript functions that define the AI's prompts, input/output schemas (using Zod), and core processing logic. They are called directly from the frontend as Next.js Server Actions.

### 3.3. Data Flow
1.  **Live Data:** The frontend calls the `getLiveStationStatus` function.
2.  **API Service:** This function (`src/lib/railway-api.ts`) fetches data from the RailRadar API using a secure API key from environment variables.
3.  **Transformation:** The raw API response is transformed into the `LiveTrainStatus` data structure our application uses.
4.  **UI Update:** The fetched data is stored in the main page's state, causing the Map and Live Status Panel to re-render with the latest information.
5.  **AI Optimization:** When the user clicks "Optimize All Routes," the current live train data, station layout, and any manual overrides are sent to the `optimizeTrainRoutes` Genkit flow.
6.  **AI Response:** The AI returns a structured JSON plan, which is then displayed in the AI Operations Console.
