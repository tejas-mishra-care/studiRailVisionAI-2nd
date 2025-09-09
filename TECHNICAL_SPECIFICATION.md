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
*   **Interactive Digital Twin:** A live, visual representation of the railway network, including tracks, platforms, signals, and real-time train positions.
*   **Live Status Monitoring:** A real-time feed displaying the status, location, and ETA of all active trains in the station's vicinity.
*   **AI-Powered Traffic Prediction:** An AI flow that analyzes current data to forecast potential future conflicts (e.g., crossing, platform contention).
*   **Intelligent Route Optimization:** A core AI flow that generates a safe, conflict-free, and efficient action plan for all trains, considering schedules, priorities, and physical constraints.
*   **Manual Override:** A critical human-in-the-loop feature allowing controllers to input ad-hoc information (e.g., track maintenance, emergencies) that the AI must incorporate into its planning.
*   **Deterministic Safety Shield:** A simulated validation layer that verifies AI-generated plans against hard-coded safety rules before they are presented to the user.
*   **AI Recommendation Audit Trail:** A log that provides transparency into the system's actions, AI decisions, and controller inputs.

## Section 2: Complete Technology Stack

### Frontend:
*   **Framework:** Next.js 15.3.3 (with App Router)
*   **UI Library:** React 18.3.1
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS 3.4.1
*   **UI Components:** shadcn/ui (a collection of re-usable components built with Radix UI and Tailwind CSS).
*   **Icons:** `lucide-react` 0.475.0 for most icons, with a custom SVG for the main `TrainIcon`.
*   **State Management:** Primarily React Hooks (`useState`, `useEffect`, `useMemo`). Global state is managed at the root page component (`src/app/page.tsx`).
*   **Form Management:** `react-hook-form` 7.54.2 (though not used in a complex form setup).
*   **Toast Notifications:** Custom hook (`useToast`) inspired by `react-hot-toast` for displaying user feedback.

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
    *   **Main Content Grid**: A 3-column CSS grid (`lg:grid-cols-3`). The left side takes 2 columns (`lg:col-span-2`), and the right side takes 1 column.
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
    *   Other icons used: `LayoutDashboard`, `BarChart2`, `Settings`, `ShieldCheck`, `History`, `Train`, `Bell`, `Search`, `UserCircle`, `UploadCloud`, `PlayCircle`, `BrainCircuit`, `Mic`, `FileWarning`, `X`, `AlertTriangle`, `Lightbulb`, `CheckCircle`, `GaugeCircle`, `Clock`, `TrainFront`, `Signal`, `TrafficCone`, `ArrowRight`, `ArrowLeft`. Their placement is detailed in the component breakdown.

*   **Images & Media:** The application currently uses no external raster images or media. The map is a pure SVG render.

### 3.3. Component-by-Component Breakdown:

This section details the custom-composed components in the `src/components/dashboard` directory. The base UI elements (Button, Card, etc.) are from `shadcn/ui` and their detailed spec can be found in the `src/components/ui` directory.

#### `Header` (`src/components/dashboard/header.tsx`)
*   **Visuals**: A `h-14` (56px) flexible row with a bottom border. Uses `bg-card` color.
*   **Placement**: Fixed at the top of the main content area.
*   **Content**: Contains the App Logo/Title (`TrainIcon` + "RailVision AI"), a search input, a notification bell button, and a user profile dropdown.
*   **States**:
    *   Search Input: Standard input states (focus with ring).
    *   Buttons: Ghost variant with hover/active states (`bg-accent`).
    *   Dropdown: Triggers a `DropdownMenu` on click.

#### `Sidebar` (`src/components/dashboard/sidebar.tsx`)
*   **Visuals**: `w-16` (64px) fixed vertical bar on the left with a right border. `bg-card` color.
*   **Placement**: Fixed to the far left of the viewport on screens wider than `sm`.
*   **Content**: Contains the app icon at the top, followed by a vertical list of navigation icons.
*   **Behavior**: Uses `TooltipProvider` to show the label for each icon on hover. The active link is highlighted with `bg-accent`.

#### `Map` (`src/components/dashboard/map.tsx`)
*   **Visuals**: A large card containing an SVG element. The SVG has a dark background (`bg-gray-800`) with a light grid pattern. Tracks are grey, signals are red/green, and trains are colored based on status.
*   **Placement**: Top-left of the main content grid.
*   **Behavior**:
    *   **Live Clock**: A `<span>` in the header is updated every second with the current system time using `new Date().toLocaleTimeString()`.
    *   **Dynamic Trains**: Train icons (`TrainFront`) are dynamically positioned on the SVG canvas based on logic in `getTrainPosition`. This function calculates `x` and `y` coordinates based on the train's `location` string (e.g., "Approaching", "NDLS P-9", "Departed").
    *   **Directional Info**: An arrow icon (`ArrowRight`) and a destination text label are rendered next to each train, showing its direction and target.

#### `ControlPanel` (`src/components/dashboard/control-panel.tsx`)
*   **Visuals**: A standard card.
*   **Placement**: Top-right of the main content grid.
*   **Content**:
    *   **Manual Override**: A `Textarea` for user input. A "Clear" button (`X` icon) appears when text is present.
    *   **AI Actions**: Two primary buttons: "Run Traffic Prediction" and "Optimize All Routes".
    *   **Data Management**: One outline button: "Import Static Data".
*   **Behavior**:
    *   Buttons are disabled when any AI action (`loadingState`) is in progress.
    *   The "Optimize All Routes" button triggers the `onRunOptimization` callback, passing the current text from the `Textarea`.
    *   The "Clear" button resets the `overrideText` state to an empty string.

#### `LiveStatusPanel` (`src/components/dashboard/live-status-panel.tsx`)
*   **Visuals**: A card containing a `Table`.
*   **Placement**: Below the `ControlPanel` in the right-hand column.
*   **Content**: A table listing live trains from `trainData`. Columns are: Train, Status, Location, ETA.
*   **Behavior**: The status `Badge` color and icon change based on the train's status string (e.g., 'Delayed' is destructive, 'On Time' is default).

#### `AIPanel` (`src/components/dashboard/ai-panel.tsx`)
*   **Visuals**: A large card containing a `Tabs` component.
*   **Placement**: Below the `Map` in the left-hand columns.
*   **Content**:
    *   **Tabs**: "Optimization", "Prediction", "Audit Trail".
    *   **Optimization Tab**: Displays the AI-generated action plan in a `Table`. Columns: Time, Train, Action, Target, Impact, Reasoning.
    *   **Prediction Tab**: Shows potential conflicts in an `Alert` component.
    *   **Audit Trail Tab**: Shows a static list of system events in a `Table`.
*   **Behavior**:
    *   When `isLoading` is true, `Skeleton` components are shown.
    *   The optimization plan is sorted by `start_time` before rendering.
    *   Action icons (`GaugeCircle`, `AlertTriangle`, `CheckCircle`) and Impact badges (`On Time`, `X min`) are dynamically rendered based on the plan data.
    *   If a `manualOverride` is passed, a warning `Alert` is displayed showing the override text.

## Section 4: Detailed Frontend Functionality & User Flows

### Main User Flow: Running an Optimization

1.  **Initial State**: The user sees the main dashboard. The "AI Operations Console" is empty.
2.  **(Optional) Input Override**: The user types a specific instruction into the "Manual Override" `Textarea` in the "Control Center". For example, "Platform 10 is closed for cleaning."
3.  **Trigger AI**: The user clicks the "Optimize All Routes" button.
4.  **State Change**:
    *   The `handleRunOptimization` function is called in `src/app/page.tsx`.
    *   The `isLoading` state is set to `'optimization'`. This disables the action buttons in the `ControlPanel`.
    *   The `optimization` state is cleared (`setOptimization(null)`).
    *   `AIPanel` receives `isLoading=true` and displays skeleton loaders.
5.  **Backend Call**:
    *   The `optimizeTrainRoutes` server function is called with the current `stationLayoutData`, `liveTrainStatuses`, and the `manualOverride` string.
    *   This function is located in `src/ai/flows/optimize-train-routes.ts`.
6.  **AI Processing**:
    *   Inside the flow, a prompt is constructed using the provided data.
    *   A call is made to the Google AI (Gemini) model via Genkit.
    *   The model processes the inputs and the detailed prompt instructions and returns a JSON array of action objects.
7.  **Response Handling**:
    *   The `handleRunOptimization` function receives the array of plan objects.
    *   On success, the `optimization` state is updated with the result (`setOptimization(result)`).
    *   The `isLoading` state is set back to `null`.
    *   On error, a `Toast` notification appears with a failure message.
8.  **UI Update**:
    *   The `AIPanel` receives the new `optimizationPlanData`.
    *   It sorts the data by time and renders the full action plan in the table.
    *   The `SafetyShieldStatus` animation plays.
    *   If an override was used, the yellow `Alert` box is displayed showing the override text.
    *   The buttons in the `ControlPanel` are re-enabled.

## Section 5: Complete Backend (AI) Architecture

The backend logic is entirely contained within the Next.js application using Genkit for AI orchestration.

### 5.1. Genkit Configuration (`src/ai/genkit.ts`)
*   **Configuration**: A global `ai` object is configured to use the `@genkit-ai/googleai` plugin.
*   **Default Model**: `googleai/gemini-2.5-flash` is set as the default model for all AI interactions.
    ```typescript
    import {genkit} from 'genkit';
    import {googleAI} from '@genkit-ai/googleai';

    export const ai = genkit({
      plugins: [googleAI()],
      model: 'googleai/gemini-2.5-flash',
    });
    ```

### 5.2. AI Flows (`src/ai/flows/`)

#### `predict-future-traffic.ts`
*   **Purpose**: Analyzes station layout and live train data to predict potential future conflicts.
*   **Input (`PredictFutureTrafficInput`)**:
    *   `stationLayout`: `z.string()` (JSON string)
    *   `liveTrainStatuses`: `z.string()` (JSON string)
*   **Output (`PredictFutureTrafficOutput`)**: An object containing a single key:
    *   `predictedTrafficConditions`: `z.string()` (A JSON string containing arrays of `conflicts` and `estimatedArrivals`).
*   **Core Logic**: A single prompt (`predictFutureTrafficPrompt`) is defined. It instructs the AI to act as a traffic expert and return a JSON object with predicted conflicts and ETAs. A `.transform()` is used on the output schema to stringify the final JSON.

#### `optimize-train-routes.ts`
*   **Purpose**: The core function to generate a complete, safe, and efficient action plan for all trains.
*   **Input (`OptimizeTrainRoutesInput`)**:
    *   `stationLayout`: `z.string()` (JSON)
    *   `liveTrainStatuses`: `z.string()` (JSON)
    *   `trackRestrictions`: `z.string().optional()` (JSON)
    *   `trainSchedules`: `z.string().optional()` (JSON)
    *   `trainPriorities`: `z.string().optional()` (JSON)
    *   `manualOverride`: `z.string().optional()` (Plain text instruction)
*   **Output (`OptimizeTrainRoutesOutput`)**: A Zod schema for an `array` of action objects. Each object contains:
    *   `train_id`: `z.string()`
    *   `action`: `z.enum(['ASSIGN', 'HOLD', 'PROCEED'])`
    *   `target_node`: `z.string()`
    *   `start_time`: `z.string()`
    *   `end_time`: `z.string()`
    *   `reasoning`: `z.string()`
    *   `delay_impact_minutes`: `z.number().optional()`
*   **Core Logic**: The flow defines a highly detailed prompt (`optimizeTrainRoutesPrompt`) that instructs the AI, "SAARATHI", on its role, context data, unbreakable rules (safety, platform fit, scheduled halts), and required output format. It specifically highlights the `manualOverride` as the most critical instruction, which must be treated as a new, absolute constraint. The flow calls the prompt and returns the structured output directly.
```

I have created the technical specification as `TECHNICAL_SPECIFICATION.md` in the root of your project. This document provides a comprehensive blueprint of the application's current state and should be an invaluable resource for future development.