
# Master Technical Specification Report

This document provides an exhaustive technical specification for the **RailVision AI** web application. It is intended to serve as a complete blueprint for developers to understand, maintain, and extend the application, including creating a 1-to-1, pixel-perfect replica as a cross-platform desktop app.

## Section 1: High-Level Project Overview

### Application Name:
RailVision AI

### Core Purpose & Value Proposition:
RailVision AI is an advanced, AI-powered decision-support tool designed for railway traffic controllers. It solves the complex problem of managing dense railway traffic in real-time by providing intelligent predictions and optimized action plans. The core value is to enhance operational efficiency, ensure safety through deterministic validation, and minimize costly delays across the railway network.

### Target Audience:
The primary users are **Railway Traffic Controllers** and **Operations Managers** responsible for real-time train movements and network scheduling at busy railway stations.

### Primary Features Summary:
*   **Interactive Digital Twin:** A live, visual representation of the railway network, including tracks, platforms, signals, and real-time train positions with a live clock.
*   **Live Status Monitoring:** A real-time feed displaying the status, location, and ETA of all active trains in the station's vicinity.
*   **AI-Powered Traffic Prediction:** An AI flow that analyzes current data to forecast potential future conflicts (e.g., crossing, platform contention).
*   **Intelligent Route Optimization:** A core AI flow that generates a safe, conflict-free, and efficient action plan for all trains, considering schedules, priorities, and physical constraints. The plan is sorted chronologically and includes delay impact analysis.
*   **Manual Override & Scenario Builder:** A critical human-in-the-loop feature allowing controllers to input ad-hoc text instructions and structured rules (e.g., platform closures) that the AI must incorporate into its planning as strict, overriding constraints.
*   **Dynamic Station Switching:** The ability to change the application's focus to any major supported railway station, updating all live data feeds and map visuals accordingly.
*   **Deterministic Safety Shield:** A simulated validation layer that verifies AI-generated plans against hard-coded safety rules before they are presented to the user.
*   **AI Recommendation Audit Trail:** A log that provides transparency into the system's actions, AI decisions, and controller inputs.
*   **Analytics Dashboard:** A dedicated page visualizing Key Performance Indicators (KPIs) like overall punctuality, average delay, and historical on-time vs. delayed performance.
*   **Automatic Data Refresh:** Live data is automatically refreshed every 15 minutes, with a visual countdown timer and a manual override button.

## Section 2: Complete Technology Stack

### Frontend:
*   **Framework:** Next.js 15.3.3 (with App Router)
*   **UI Library:** React 18.3.1
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS 3.4.1
*   **UI Components:** shadcn/ui (a collection of re-usable components built with Radix UI and Tailwind CSS).
*   **Charting:** `recharts` 2.15.1 for bar charts on the analytics page.
*   **Icons:** `lucide-react` 0.475.0 for most icons, with a custom SVG for the main `TrainIcon`.
*   **State Management:**
    *   **Local State:** Primarily React Hooks (`useState`, `useEffect`, `useMemo`).
    *   **Global State:** React Context (`StationProvider` in `src/context/station-context.tsx`) for managing the currently active station across all components.
*   **Toast Notifications:** Custom hook (`useToast`) for displaying user feedback, especially for API errors.

### Backend (AI & Server-side Logic):
*   **AI Toolkit:** Genkit 1.14.1
*   **AI Model Provider:** `@genkit-ai/googleai` 1.14.1, utilizing the 'gemini-1.5-flash' model by default.
*   **Server Environment:** Next.js Server Actions and Route Handlers. AI flows are defined as server-side functions.

### APIs:
*   **Live Data Source:** A custom service (`src/lib/railway-api.ts`) designed to integrate with the **RailRadar API** (fictional). It fetches live station data and transforms it for the application. It includes a fallback to mock data if the API key is not present.
*   **API Key Management:** The API key is securely managed using environment variables (`.env` file).

## Section 3: Granular Frontend UI/UX Specification

### 3.1. Visual Design System:

The visual identity is defined in `src/app/globals.css` using HSL CSS variables for a themable system.

*   **Color Palette:**
    *   **Background**: `hsl(220, 13%, 96%)` - Very light grey (`#F0F2F5`)
    *   **Foreground**: `hsl(225, 10%, 10%)` - Near-black for text.
    *   **Card**: `hsl(0, 0%, 100%)` - White.
    *   **Primary**: `hsl(225, 50%, 30%)` - Deep navy blue (`#243A73`). Used for primary buttons and key highlights.
    *   **Primary Foreground**: `hsl(0, 0%, 100%)` - White text on primary elements.
    *   **Accent**: `hsl(210, 100%, 73%)` - Vivid sky blue (`#74B9FF`). Used for active states, highlights, and focus rings.
    *   **Accent Foreground**: `hsl(225, 50%, 30%)` - Deep navy blue text on accent elements.
    *   **Destructive**: `hsl(0, 84.2%, 60.2%)` - Red for errors and destructive actions.
    *   **Border**: `hsl(220, 13%, 88%)` - Light grey for borders.
    *   **Input**: `hsl(220, 13%, 88%)` - Light grey for input fields.
    *   **Ring**: `hsl(210, 100%, 73%)` - Vivid sky blue for focus rings.
    *   **Chart Colors**: Defined as CSS variables (`--chart-1` to `--chart-5`) for use in `recharts`.

*   **Typography:**
    *   **Font Family**: `Inter` (sans-serif), managed via `next/font/google` in `src/app/layout.tsx`.
    *   **Headings (`CardTitle`)**: `2xl` (24px), `font-semibold`.
    *   **Sub-headings (`CardDescription`)**: `sm` (14px), `text-muted-foreground`.
    *   **Body Text**: `sm` (14px) or `base` (16px) depending on context.
    *   **Table Text**: `sm` (14px).
    *   **Labels**: `sm` (14px), `font-medium`.
    *   **Badges**: `xs` (12px), `font-semibold`.
    *   **Monospace Text (for times/IDs)**: System monospace font stack, `font-mono`.

*   **Layout & Spacing:**
    *   **Overall Structure**: Two-column layout on desktop: a fixed `16px` width icon-only sidebar (`sm:flex`), and a main content area.
    *   **Main Content Grid (Dashboard)**: A 3-column CSS grid (`lg:grid-cols-3`). The left side takes 2 columns (`lg:col-span-2`), and the right side takes 1 column.
    *   **Base Spacing Unit**: Tailwind's spacing scale is used. Standard gap between grid items is `gap-4` (1rem / 16px) or `lg:gap-8` (2rem / 32px).
    *   **Card Padding**: `p-6` (24px) for CardHeader and CardContent.
    *   **Border Radius**: `var(--radius)` is `0.5rem` (8px) for `lg`. `md` is `6px`, `sm` is `4px`.

### 3.2. Iconography & Assets:

*   **Icons:** All icons are from `lucide-react` unless specified otherwise.
    *   **`TrainIcon`**: A custom SVG component. Location: `src/components/icons/train-icon.tsx`.
    *   Other icons used: `LayoutDashboard`, `BarChart2`, `Settings`, `ShieldCheck`, `History`, `Train`, `Bell`, `Search`, `UserCircle`, `UploadCloud`, `PlayCircle`, `BrainCircuit`, `Mic`, `FileWarning`, `X`, `AlertTriangle`, `Lightbulb`, `CheckCircle`, `GaugeCircle`, `Clock`, `TrainFront`, `Signal`, `TrafficCone`, `ArrowRight`, `ArrowLeft`, `Users`, `Calendar`, `PlusCircle`, `Ban`, `Star`, `RefreshCw`. Their placement is detailed in the component breakdown.

### 3.3. Component-by-Component Breakdown:

#### `Header` (`src/components/dashboard/header.tsx`)
*   **Visuals**: A `h-14` (56px) flexible row with a bottom border. Uses `bg-card` color.
*   **Placement**: Fixed at the top of the main content area in all pages.
*   **Content**: Contains the App Logo/Title, a search input, a notification bell, and a user profile dropdown.
*   **Behavior**: The user profile dropdown now links to `/settings` and provides toast notifications for "Support" and "Logout".

#### `Sidebar` (`src/components/dashboard/sidebar.tsx`)
*   **Visuals**: `w-16` (64px) fixed vertical bar on the left with a right border. `bg-card` color.
*   **Placement**: Fixed to the far left of the viewport on screens wider than `sm`.
*   **Content**: Vertical list of navigation icons (`Dashboard`, `Analytics`, `Rolling Stock`, `Safety Rules`, `Audit Trail`, `Settings`).
*   **Behavior**: Active link is highlighted with `bg-accent`. All links now point to their respective pages.

#### `Map` (`src/components/dashboard/map.tsx`)
*   **Behavior**:
    *   **Dynamic Title**: The map title and description now update dynamically based on the active station from `StationContext`.
    *   **Live Clock**: A `<span>` in the header is updated every second with the current system time.
    *   **Intelligent Train Positioning**: The `getTrainPosition` function has been enhanced to accurately place trains based on their live status (`Approaching`, `Halted`, `Departed`), `event_type`, and `platform_number`.

#### `ControlPanel` (`src/components/dashboard/control-panel.tsx`)
*   **Visuals**: A standard card containing data refresh controls and AI triggers.
*   **Content**:
    *   **Data Management**: A "Refresh Live Data" button and a **countdown timer** showing the time until the next automatic 15-minute refresh.
    *   **Scenario Builder**: A system for adding structured rules like "Platform Closure", "Add Delay", or "Prioritize Train".
    *   **Manual Override**: A `Textarea` for free-form user instructions that work in tandem with the structured rules.
    *   **AI Actions**: Buttons for "Optimize All Routes" and "Run Traffic Prediction".
*   **Behavior**:
    *   Buttons are disabled when an AI action or data refresh is in progress.
    *   The countdown timer resets whenever data is fetched.
    *   "Optimize All Routes" combines structured rules and manual override text into a single prompt for the AI.

#### `AIPanel` (`src/components/dashboard/ai-panel.tsx`)
*   **Behavior**:
    *   When an optimization is run with a `manualOverride`, a prominent yellow warning `Alert` is displayed showing the override text that was used for the plan.
    *   A `SafetyShieldStatus` component simulates the AI's validation process, providing a better UX.

#### `SettingsPage` (`src/app/settings/page.tsx`)
*   **Placement**: Accessible via the `/settings` route.
*   **Content**:
    *   **Station Configuration**: Displays the currently active station's name, code, and **railway zone**.
    *   **Station Switcher**: A `StationSwitcher` component that opens a dialog, allowing the user to search for and select a new active station from a predefined list.
    *   **Static Data Management**: A button to import station layout data (currently shows a "feature in development" toast).

## Section 4: Detailed Frontend Functionality & User Flows

### Main User Flow: Switching Stations and Running Optimization

1.  **Initial State**: The user sees the main dashboard for "New Delhi" (`NDLS`). Live data is displayed.
2.  **Navigate to Settings**: The user clicks the `Settings` icon in the sidebar.
3.  **Change Station**:
    *   The user clicks the "Change Station" button, which opens the `StationSwitcher` dialog.
    *   The user searches for and selects "Mumbai Central" (`MMCT`).
    *   The `setStation` function from `StationContext` is called, updating the global state.
4.  **Automatic Update**:
    *   The user navigates back to the main dashboard.
    *   A `useEffect` hook in `src/app/page.tsx` detects the change in `station.code`.
    *   It immediately triggers `fetchLiveTrainData(true)`, now calling the API for station `MMCT`.
    *   Skeleton loaders are shown while the new data is fetched.
5.  **UI Re-renders**:
    *   The `Map` component's title changes to "MMCT Digital Twin".
    *   The `LiveStatusPanel` and `Map` re-render with the live train data for Mumbai Central.
6.  **Run Optimization**:
    *   The user types "Platform 5 is reserved for a VIP train" into the "Manual Override" `Textarea`.
    *   The user clicks "Optimize All Routes".
7.  **Backend Call**: The `optimizeTrainRoutes` server function is called with the live data for `MMCT` and the manual override string.
8.  **UI Update**: The `AIPanel` displays the new, context-specific optimization plan for Mumbai Central, along with a warning alert showing the manual override that was enforced.

## Section 5: Complete Backend (AI) Architecture

### 5.1. Genkit Configuration (`src/ai/genkit.ts`)
*   **Configuration**: A global `ai` object is configured to use the `@genkit-ai/googleai` plugin.
*   **Default Model**: `googleai/gemini-1.5-flash` is set as the default model.

### 5.2. AI Flows (`src/ai/flows/`)

#### `optimize-train-routes.ts`
*   **Purpose**: To generate a complete, safe, and efficient action plan for all trains.
*   **Input (`OptimizeTrainRoutesInput`)**: JSON strings for station layout and train statuses, plus an optional `manualOverride` string.
*   **Output (`OptimizeTrainRoutesOutput`)**: A Zod schema for an `array` of action objects.
*   **Core Logic**:
    *   **Crucial Instruction**: The prompt has been updated to emphasize that the `manualOverride` is a **strict constraint that limits options**. For example, if an override mentions a platform is closed, the AI is explicitly told it CANNOT use that platform. This improves the AI's interpretation of negative or restrictive commands.
    *   **Rules**: Unbreakable rules for safety and platform fit are defined. Train length calculation is specified as `length_coaches` * 25 meters.
    *   **Output Format**: The prompt strictly enforces the JSON output schema.
