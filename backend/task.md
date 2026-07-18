# Tasks - Phase 5.1: Architecture Hardening & Production Improvements

- [x] Milestone 1: Centralized Configuration, Constants, Standard Responses & Error Handling
    - [x] Create centralized backend environment `config.py` loading database, model and version attributes.
    - [x] Centralize enums and statuses in backend `constants.py` and frontend `constants/index.js`.
    - [x] Add `ai_generations` telemetry log migration inside `database.py`.
    - [x] Implement centralized standard JSON response helper `make_api_response`.
    - [x] Configure request-id generation middleware, centralized error handlers, and `/api/v1/health` status check.

- [x] Milestone 2: Secure Route Refactoring & API Modernization
    - [x] Implement secure parameterless API routes under `/api/v1` namespace utilizing `g.user_email` token identity context.
    - [x] Convert old path-parameter based routes into deprecated wrapper endpoints that delegate request parameters to secure handlers.
    - [x] Update frontend Axios configurations setting API baseURL to `/api/v1` and removing URL email parameter mappings.
    - [x] Add global response headers registering `X-Request-ID`.
    - [x] Integrate database log writes to `ai_generations` telemetry table during AI workout/meal/recommendations/insights generation.
    - [x] Update health endpoint `/api/v1/health` to expose system environment, version, database status, API status, request ID, and timestamps.
    - [x] Verify legacy and Namespaced paths compile and function perfectly with zero regressions.

- [x] Milestone 3: Feature-Oriented React Page Splitting
    - [x] Split large page files (Dashboard, Profile, Workout, Meal, Coach, Progress) into feature-oriented subcomponents inside subfolders.
    - [x] Extract state, data queries, and mutations out of pages into dedicated custom hooks (`useDashboard`, `useProfile`, `useWorkout`, `useMeal`, `useCoach`, `useProgress`).
    - [x] Set up an API service layer encapsulating all Axios invocations (`authApi`, `profileApi`, `workoutApi`, etc.) so components never call Axios directly.

- [x] Milestone 4: Lazy Loading & Route Code Splitting
    - [x] Lazy load all primary routes in `App.jsx` using `React.lazy()` and Suspense boundaries.
    - [x] Build an `AppSkeleton` visual fallback component that matches page layouts and prevents layout shift.
    - [x] Dynamically lazy load feature modules (`DashboardOverview`, `SuggestedPrompts`, `ShoppingChecklist`, `WorkoutExerciseCard`, `ProgressAnalytics`) and the `Markdown` renderer.
    - [x] Integrate prefetch mechanisms loading `Workout`, `Meal`, and `Progress` chunks during browser idle time using `requestIdleCallback`.
    - [x] Install build visualizer plugin checking modular bundle distribution sizes inside `stats.html`.
    - [x] Verify that the production compilation completes successfully and reduces the initial bundle.

- [ ] Milestone 5: AI Telemetry & Metadata Integrations
- [ ] Milestone 6: Automated Testing Suite & Performance Audits
