# 📜 Changelog Release History

All notable updates to FitSage AI will be documented in this file.

---

## [1.4.0] - Phase 5.1: Hardening Milestone 4
### Added
- **Route-Level Lazy Loading**: Converted all application routes (`Dashboard`, `Profile`, `Workout`, `Meal`, `Coach`, `Progress`, `Recommendations`, `Login`, `Register`) to dynamic imports using `React.lazy()`.
- **AppSkeleton & Suspense Boundaries**: Configured global Suspense boundary routing fallback with `AppSkeleton` containing responsive loading blocks to prevent screen shifts.
- **Granular Feature Component Lazy Loading**: Enabled dynamic chunk splitting for complex subcomponents (`DashboardOverview`, `InsightsCard`, `WorkoutExerciseCard`, `ShoppingChecklist`, `ChatHistory`, `SuggestedPrompts`, `ProgressAnalytics`) that fetch only when required.
- **Lazy Loaded Custom Markdown**: Configured the markdown render engine component (`Markdown.jsx`) to split into its own lazy chunk, loading dynamically only when active coach chats are rendered.
- **Route Prefetching on Browser Idle**: Structured prefetch threads downloading `Workout`, `Meal`, and `Progress` files during browser idle time using `requestIdleCallback` (with custom timeout fallbacks) to maximize transitions speed.
- **Optimized Recharts & Icon Named Imports**: Standardized all Recharts and React-Icons calls to extract only explicit component modules, preventing whole-module visual footprint overheads.
- **Build Analysis Visualizer Integration**: Integrated `rollup-plugin-visualizer` into the Vite compilation flow to analyze modular chunk dependencies and verify treeshaking output.

## [1.3.0] - Phase 5.1: Hardening Milestone 3
### Added
- **Centralized API Service Layer**: Organized modular API endpoints under `src/api/` (e.g. `authApi.js`, `profileApi.js`, `workoutApi.js`, `mealApi.js`, `recommendationsApi.js`, `coachApi.js`, `progressApi.js`), isolating all Axios HTTP invocations from page routing states.
- **Custom Hooks Isolation**: Decoupled component side-effects, loading statuses, error thresholds, dynamic aggregations, and refresh callbacks into specialized custom hooks (`useDashboard.js`, `useProfile.js`, `useWorkout.js`, `useMeal.js`, `useCoach.js`, `useProgress.js`).
- **Feature-Oriented Page Splitting**: Restructured large orchestrator page views by splitting them into segmented, focused subcomponents inside folder structures (e.g. `WelcomeScreen.jsx`, `SetupLoader.jsx`, `DashboardHero.jsx`, `DashboardStats.jsx`, `DashboardOverview.jsx`, `QuickActions.jsx`, `InsightsCard.jsx` under `Dashboard/components/`).
- **Standardized Component Responsibilities**: Enforced clean separation of concerns where parent views manage layout assembly and consume hooks, hooks execute API operations and state side-effects, and children operate as purely presentational components.

## [1.2.0] - Phase 5.1: Hardening Milestone 2
### Added
- **Parameterless Secure Endpoints**: Migrated profile, update, stats, daily summary, workout, nutrition, recommendations, and coach APIs to secure namespaced GET/POST routes extracting user identity context directly from token claims (`g.user_email`) instead of path parameters.
- **Legacy Compatibility Wrappers**: Standardized duplicate registrations for legacy routing paths, redirecting them internally to parameterless secure handlers to maintain 100% backward compatibility.
- **Unified Telemetry Metrics**: Added active execution timer and database inserts logging `request_id`, status indicators, error details, cache hit flags, model names, and profile state hashes to the telemetry schema.
- **Centralized Version Mappings**: Enabled `API_PREFIX = "/api/v1"` in backend `config.py` as a centralized constant mapped for all Blueprint route initializations.
- **Enhanced Health Payload**: Updated `/api/v1/health` status check returning execution environments, database connections, semantic versions, timestamp clocks, and request IDs.
- **HTTP Header Integration**: Implemented custom response middleware injection returning standard `X-Request-ID` headers to clients.
- **Axios Configuration Sync**: Integrated frontend API base URL update and page handler transitions removing path parameter attributes.

## [1.1.0] - Phase 5.1: Hardening Milestone 1
### Added
- **Centralized Configurations**: Created `config.py` in the backend and `constants/index.js` on the frontend for centralized variables and status definitions.
- **Unified Telemetry Logging**: Set up an `ai_generations` log table in the database to record model metrics, cache status, execution times, status indicators, and detailed error messages.
- **Request ID Middleware & Centralized Errors**: Implemented custom headers middleware tracking request context and a central Flask error handler standardizing JSON formats.
- **Backward Compatibility Rewriter**: Formulated path rewriting rules in the request filter to map legacy `/auth/...` URLs to namespaced `/api/v1/auth/...` routes automatically.
- **Health Check Endpoint**: Added `/api/v1/health` providing service metadata and database status details.

## [1.0.0] - Phase 4: Modern SaaS UI & Components Library
### Added
- **Design Tokens**: Standardized responsive font sizes, borders, radii, shadow elevations, and spacing variables in `index.css`.
- **Dynamic Theming Context**: Implemented Sun/Moon theme toggler for Light and Dark modes; state choice is persisted via `localStorage`.
- **Global Toast Alerts Context**: Setup a non-blocking toast stacks component to display slide-in alerts.
- **Atomic UI Components**: Built `Button`, `Card`, `Badge`, `Input`, `Select`, `ProgressRing`, `Skeleton`, `EmptyState`, `LoadingSpinner`, `Avatar`, and `Markdown` components.
- **Collapsible Application Layout**: Collapsible desktop sidebar that compiles to a slide-out hamburger drawer on mobile.
- **SaaS Dashboard**: Displays weight trends, streaks, readiness metrics, overview splits, and quick water logs.
- **Tabbed Workout & Meal Planners**: Monday–Sunday calendars, exercise checklists, macro badge rows, and shopping list checklists.
- **ChatGPT-Style AI Coach**: Scrollable message bubbles, sidebar histories, suggested prompts, auto-scrolling, response copying, and text-to-speech audio capabilities.
- **Recharts Analytics**: Dynamic charts visualizing weight, BMI, water intake, calories consumed, and workout consistency.

---

## [0.3.0] - Phase 3: AI Intelligence & Personalization
### Added
- **Modular AI Service Layer**: Created `services/` isolating providers, prompts, safety controls, and json validation helpers.
- **Decoupled Providers**: Built abstract `BaseAIProvider` and concrete `GeminiProvider` utilizing `.env` variables.
- **Centralized Schema Controls**: Formulated strict schemas for workouts, meals, chat responses, and daily recommendations.
- **Recursive JSON Validator**: Validates required keys and types; handles regex cleanup repairs and static fallbacks on failure.
- **Physical Safety Filter**: Swaps joint-loading exercises (squats) with low-impact options (glute bridges) for injured users, and restricts extreme weight-loss rates.
- **Telemetry Logger**: Telemetry service saving performance latency, cache hits, retries, and errors in JSON Lines logs.
- **Context memory summaries**: Implemented conversational context summary database synchronization.

---

## [0.2.0] - Phase 2: Role-Based Authentication & JWT Cycle
### Added
- **Access/Refresh Token Mechanism**: Setup short-lived access tokens (15m) and long-lived refresh tokens (7d).
- **Silent Token Refresh**: Added an Axios interceptor to catch `401` errors, fetch a new access token, and retry the request automatically.
- **IDOR Security Guard**: Implemented backend decorators matching JWT emails to resource request emails.
- **Role-Based Authorization**: Embedded default `"user"` and RBAC roles in JWT payloads.
- **Persistent Token Store**: Abstracted token operations to ease future cookie migrations.

---

## [0.1.0] - Phase 1: Robust Database Connection Pooling
### Added
- **MySQL Connection Pool**: Swapped simple cursor requests for a thread-safe connection pool with active timeouts.
- **Idempotent Migrations**: Database initialization checks existence before executing creation or column alteration scripts.
