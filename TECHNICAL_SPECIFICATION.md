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
*   **Manual Override:** A critical human-in-the-loop feature allowing controllers to input ad-hoc text instructions (e.g., track maintenance, emergencies) that the AI must incorporate into its planning as a strict, overriding constraint.
*   **Deterministic Safety Shield:** A simulated validation layer that verifies AI-generated plans against hard-coded safety rules before they are presented to the user.
*   **AI Recommendation Audit Trail:** A log that provides transparency into the system's actions, AI decisions, and controller inputs.
*   **Analytics Dashboard:** A dedicated page visualizing Key Performance Indicators (KPIs) like overall punctuality, average delay, and historical on-time vs. delayed performance.

## Section 2: Complete Technology Stack

### Frontend:
*   **Framework:** Next.js 15.3.3 (with App Router)
*   **UI Library:** React 18.3.1
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS 3.4.1
*   **UI Components:** shadcn/ui (a collection of re-usable components built with Radix UI and Tailwind CSS).
*   **Charting:** `recharts` 2.15.1 for bar charts on the analytics page.
*   **Icons:** `lucide-react` 0.475.0 for most icons, with a custom SVG for the main `TrainIcon`.
*   **State Management:** Primarily React Hooks (`useState`, `useEffect`, `useMemo`). Global state is managed at the root page components (`src/app/page.tsx`, `src/app/analytics/page.tsx`).
*   **Toast Notifications:** Custom hook (`useToast`) for displaying user feedback.

### Backend (AI & Server-side Logic):
*   **AI Toolkit:** Genkit 1.14.1
*   **AI Model Provider:** `@genkit-ai/googleai` 1.14.1, utilizing the 'gemini-2.5-flash' model by default.
*   **Server Environment:** Next.js Server Actions and Route Handlers. AI flows are defined as server-side functions.
*   **Data:** All application data (trains, station layout, etc.) is currently mocked and stored in `src/lib/data.ts`.

### APIs:
*   The application does not use any third-party APIs for its core functionality. It operates as a self-contained simulation.

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
        ```xml
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 4h12v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4Z" />
          <path d="M4 15h16" />
          <path d="M12 4v11" />
          <path d="M6 15h.01" />
          <path d="M18 15h.01" />
          <path d="M8 19h8" />
          <path d="M10 15v4" />
          <path d="M14 15v4" />
        </svg>
        ```
    *   Other icons used: `LayoutDashboard`, `BarChart2`, `Settings`, `ShieldCheck`, `History`, `Train`, `Bell`, `Search`, `UserCircle`, `UploadCloud`, `PlayCircle`, `BrainCircuit`, `Mic`, `FileWarning`, `X`, `AlertTriangle`, `Lightbulb`, `CheckCircle`, `GaugeCircle`, `Clock`, `TrainFront`, `Signal`, `TrafficCone`, `ArrowRight`, `ArrowLeft`, `Users`, `Calendar`. Their placement is detailed in the component breakdown.

*   **Images & Media:** The application currently uses no external raster images or media. The map and charts are pure SVG renders.

### 3.3. Component-by-Component Breakdown:

This section details the custom-composed components in the `src/components/dashboard` directory and the new `AnalyticsPage`.

#### `Header` (`src/components/dashboard/header.tsx`)
*   **Visuals**: A `h-14` (56px) flexible row with a bottom border. Uses `bg-card` color.
*   **Placement**: Fixed at the top of the main content area in all pages.
*   **Content**: Contains the App Logo/Title (`TrainIcon` + "RailVision AI"), a search input, a notification bell button, and a user profile dropdown.

#### `Sidebar` (`src/components/dashboard/sidebar.tsx`)
*   **Visuals**: `w-16` (64px) fixed vertical bar on the left with a right border. `bg-card` color.
*   **Placement**: Fixed to the far left of the viewport on screens wider than `sm`.
*   **Content**: Contains the app icon at the top, followed by a vertical list of navigation icons (`Dashboard`, `Analytics`, etc.).
*   **Behavior**: Uses `TooltipProvider` to show the label for each icon on hover. The active link is highlighted with `bg-accent` based on the current URL pathname.

#### `Map` (`src/components/dashboard/map.tsx`)
*   **Visuals**: A large card containing an SVG element. The SVG has a dark background (`bg-gray-800`) with a light grid pattern.
*   **Placement**: Top-left of the main dashboard grid.
*   **Behavior**:
    *   **Live Clock**: A `<span>` in the header is updated every second with the current system time using `new Date().toLocaleTimeString()`. This is handled client-side to prevent hydration errors.
    *   **Dynamic Trains**: Train icons (`TrainFront`) are dynamically positioned on the SVG canvas based on their `location` string.
    *   **Directional Info**: An arrow icon (`ArrowRight`) and a destination text label are rendered next to each train.

#### `ControlPanel` (`src/components/dashboard/control-panel.tsx`)
*   **Visuals**: A standard card.
*   **Placement**: Top-right of the main dashboard grid.
*   **Content**:
    *   **Manual Override**: A `Textarea` for user input. A "Clear" button (`X` icon) appears when text is present.
    *   **AI Actions**: Buttons for "Run Traffic Prediction" and "Optimize All Routes".
*   **Behavior**:
    *   Buttons are disabled when an AI action is in progress, with specific loading text for each button.
    *   The "Optimize All Routes" button triggers optimization, passing the current text from the `Textarea`.
    *   The "Clear" button resets the `overrideText` state.

#### `LiveStatusPanel` (`src/components/dashboard/live-status-panel.tsx`)
*   **Visuals**: A card containing a `Table`.
*   **Placement**: Below the `ControlPanel` on the dashboard.
*   **Content**: A table listing live trains from `trainData`. Columns: Train, Status, Location, ETA.

#### `AIPanel` (`src/components/dashboard/ai-panel.tsx`)
*   **Visuals**: A large card containing a `Tabs` component.
*   **Placement**: Below the `Map` on the dashboard.
*   **Content**:
    *   **Tabs**: "Optimization", "Prediction", "Audit Trail".
    *   **Optimization Tab**: Displays the AI-generated action plan in a `Table`, sorted chronologically by `start_time`. Columns: Time, Train, Action, Target, Impact, Reasoning.
    *   **Prediction Tab**: Shows potential conflicts in an `Alert` component.
*   **Behavior**:
    *   When `isLoading` is true, `Skeleton` components are shown.
    *   If a `manualOverride` is passed, a warning `Alert` is displayed showing the override text.
    *   Action icons (`GaugeCircle`, `AlertTriangle`, `CheckCircle`) and Impact badges (`On Time`, `X min`) are dynamically rendered.

#### `AnalyticsPage` (`src/app/analytics/page.tsx`)
*   **Visuals**: A full-page component within the standard Sidebar/Header layout.
*   **Placement**: Accessible via the `/analytics` route.
*   **Content**:
    *   **KPI Cards**: Four `Card` components at the top displaying key metrics: Overall Punctuality (92.5%), Average Delay (4.8 min), Section Throughput (1,254 Trains), and Platform Utilization (78%).
    *   **Punctuality Chart**: A large `Card` containing a `RechartsBarChart` that visualizes "On Time" vs. "Delayed" trains over the last 6 months.
*   **Behavior**: The page is currently static, using mocked data for the KPIs and chart. It is designed to be connected to a live data source.

## Section 4: Detailed Frontend Functionality & User Flows

### Main User Flow: Running an Optimization with Manual Override

1.  **Initial State**: The user sees the main dashboard. The "AI Operations Console" is empty.
2.  **Input Override**: The user types a specific instruction into the "Manual Override" `Textarea`. Example: "Platform 2 is closed for cleaning."
3.  **Trigger AI**: The user clicks the "Optimize All Routes" button.
4.  **State Change**:
    *   The `handleRunOptimization` function is called in `src/app/page.tsx`.
    *   The `isLoading` state is set to `'optimization'`. This disables the action buttons and shows "Optimizing Routes..." on the button.
    *   `AIPanel` receives `isLoading=true` and displays skeleton loaders.
5.  **Backend Call**: The `optimizeTrainRoutes` server function is called with station layout, train statuses, and the `manualOverride` string.
6.  **AI Processing**:
    *   Inside the `optimizeTrainRoutes` flow, a detailed prompt instructs the AI to treat the `manualOverride` as a new, absolute constraint.
    *   A call is made to the Gemini model via Genkit.
7.  **Response Handling**:
    *   `handleRunOptimization` receives the array of plan objects.
    *   On success, the `optimization` state is updated with the result.
    *   The `isLoading` state is set back to `null`.
    *   On error, a `Toast` notification appears.
8.  **UI Update**:
    *   The `AIPanel` receives the new `optimizationPlanData`.
    *   It sorts the data by `start_time` and renders the full action plan.
    *   The yellow `Alert` box is displayed showing the override text that was used.
    *   The buttons in the `ControlPanel` are re-enabled.

## Section 5: Complete Backend (AI) Architecture

### 5.1. Genkit Configuration (`src/ai/genkit.ts`)
*   **Configuration**: A global `ai` object is configured to use the `@genkit-ai/googleai` plugin.
*   **Default Model**: `googleai/gemini-2.5-flash` is set as the default model.
    ```typescript
    import {genkit} from 'genkit';
    import {googleAI} from '@genkit-ai/googleai';

    export const ai = genkit({
      plugins: [googleAI()],
      model: 'googleai/gemini-2.5-flash',
    });
    ```

### 5.2. AI Flows (`src/ai/flows/`)

#### `optimize-train-routes.ts`
*   **Purpose**: To generate a complete, safe, and efficient action plan for all trains.
*   **Input (`OptimizeTrainRoutesInput`)**: JSON strings for station layout and train statuses, plus an optional `manualOverride` string.
*   **Output (`OptimizeTrainRoutesOutput`)**: A Zod schema for an `array` of action objects, each containing `train_id`, `action`, `target_node`, `start_time`, `end_time`, `reasoning`, and `delay_impact_minutes`.
*   **Core Logic**: The flow defines a highly detailed prompt that instructs the AI, "SAARATHI".
    *   **Crucial Instruction**: The prompt has been updated to emphasize that the `manualOverride` is a **strict constraint that limits options**. For example, if an override mentions a platform is closed, the AI is explicitly told it CANNOT use that platform. This improves the AI's interpretation of negative or restrictive commands.
    *   **Rules**: Unbreakable rules for safety and platform fit are defined. Train length calculation is specified as `length_coaches` * 25 meters.
    *   **Output Format**: The prompt strictly enforces the JSON output schema. The flow calls the prompt and returns the structured output directly as a JSON object (the unnecessary stringification has been removed).
```