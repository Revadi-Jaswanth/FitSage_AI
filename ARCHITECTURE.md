# 🏗️ Architecture Design Specification

This document maps out the end-to-end software architecture, frontend state layouts, backend request controls, AI processing pipes, and database relationships of the FitSage AI platform.

---

## 1. High-Level System Architecture

```mermaid
graph LR
    subgraph Client Panel
        UI[React SPA] <--> |Axios Interceptor| Auth[Auth Context]
    end

    subgraph API Gateway
        Route[Flask Blueprints] <--> |JWT Decorators| Guards[Security Context]
    end

    subgraph Service Layer
        AIServ[AI Orchestrator] <--> Cache[Cache Service]
        AIServ <--> Prom[Prompt Builder]
        AIServ <--> Saf[Safety Checker]
        AIServ <--> Val[Validator / Repair]
    end

    subgraph Infrastructure
        Gemini[Google Gemini API]
        DB[(MySQL Connection Pool)]
    end

    UI <--> Route
    Route <--> AIServ
    AIServ <--> Gemini
    AIServ <--> DB
```

---

## 2. Frontend State & Navigation Flow

The frontend utilizes a Centralized State wrapper mapping JWT authentication guards, Toast Alerts, and Theme togglers:

```mermaid
graph TD
    Start([User Visits App]) --> AuthCheck{Logged In?}
    AuthCheck -->|No| Login[Render Login / Register]
    AuthCheck -->|Yes| AppShell[Render Layout Shell]
    
    AppShell --> Sidebar[Collapsible Drawer Sidebar]
    AppShell --> Topbar[Theme Switch / Mobile Header]
    AppShell --> MainContent[Main Content Canvas]
    
    MainContent --> Dash[Dashboard: Streaks & Rings]
    MainContent --> Work[Workout: Calendar Tabs & Checklist]
    MainContent --> Meal[Meal Planner: Macros & Shopping Checklist]
    MainContent --> Coach[AI Coach: Chat Bubbles & Speech Reader]
    MainContent --> Prog[Progress Logs: Recharts Trend Analytics]
```

---

## 3. Backend Request Lifecycle & Blueprint Routing

```mermaid
sequenceDiagram
    autonumber
    actor User as Client Application
    participant API as Flask Blueprint Route
    participant Guard as JWT Token Decryptor
    participant Serv as AI Orchestrator Service
    participant DB as MySQL Connection Pool

    User->>API: HTTP Request (Access Token in Headers)
    API->>Guard: Validate Token Signature & Expiry
    alt Invalid/Expired Token
        Guard-->>User: 401 Unauthorized Response
    else Valid Token (g.user_email bound)
        API->>API: Verify Resource Owner (g.user_email == Target email)
        alt Email Mismatch (Cross-User Exploit)
            API-->>User: 403 Forbidden Response
        else Authorized Access
            API->>Serv: Delegate to AI Service Layer
            Serv->>DB: Fetch user profile & cache metrics
            Serv-->>API: Return formatted Markdown & structured JSON
            API-->>User: HTTP 200 OK (JSON Envelope)
        end
    end
```

---

## 4. AI Processing Pipeline

When the cache misses or the user forces regeneration, the AI engine processes prompts using validation, safety interceptors, and repairs:

```mermaid
flowchart TD
    Start[Request Plan Generation] --> CheckCache{Cache Hit?}
    
    %% Cache Path
    CheckCache -->|Yes| ReturnCache[Load Cached Markdown from DB] --> End([Return Plan to Client])
    
    %% Generation Path
    CheckCache -->|No| BuildPrompt[Prompt Builder compiles profile details]
    BuildPrompt --> SendProvider[Gemini Provider generates JSON]
    SendProvider --> ParseJSON{JSON parseable?}
    
    %% Validation Loop
    ParseJSON -->|Yes| SchemaValidate{Conforms to JSON schema?}
    ParseJSON -->|No| Repair[Regex JSON repair heuristics]
    Repair --> ParseJSON
    
    SchemaValidate -->|Yes| SafetyCheck[Safety Checker scans injuries & limits]
    SchemaValidate -->|No| Retry{Has retried once?}
    
    Retry -->|No| Regene[Query Gemini with error details] --> ParseJSON
    Retry -->|Yes| Fallback[Load safe static schema fallback] --> SafetyCheck
    
    SafetyCheck --> SaveDB[Format Markdown & Save to DB with profile_hash]
    SaveDB --> End
```

---

## 5. Database Schema Relationships (ERD)

```mermaid
erDiagram
    USERS ||--o{ WORKOUTS : generates
    USERS ||--o{ MEALS : generates
    USERS ||--o{ PROGRESS_LOGS : records
    USERS ||--o{ COACH_CHAT : chats
    USERS ||--|| COACH_SUMMARY : summarizes
    
    USERS {
        int id PK
        string name
        string email UNIQUE
        string password
        int age
        string gender
        int height
        int weight
        string goal
        string diet
        int budget
        string activity
        string equipment
        string role
        string fitness_level
        text allergies
        text injuries
        int workout_duration
    }
    
    WORKOUTS {
        int id PK
        int user_id FK
        text workout_plan
        string profile_hash
        timestamp created_at
    }

    MEALS {
        int id PK
        int user_id FK
        text meal_plan
        int calories
        int protein
        int cost
        string profile_hash
        timestamp created_at
    }

    PROGRESS_LOGS {
        int id PK
        int user_id FK
        float weight
        int water_intake
        int calories_consumed
        boolean workout_completed
        date date
        timestamp created_at
    }

    COACH_CHAT {
        int id PK
        int user_id FK
        text user_message
        text ai_response
        timestamp created_at
    }

    COACH_SUMMARY {
        int user_id PK, FK
        text summary
        timestamp updated_at
    }
```

---

## 6. Layout Shell & Coding Patterns
- **Atomic UI Grid Systems**: The layouts scale dynamically through flex/grid boxes mapped to viewport dimensions. No hardcoded pixel widths are used in core canvas components.
- **Provider Pattern**: AI Provider interfaces are decoupled from underlying libraries, allowing the application to replace the Gemini SDK with OpenAI or Claude libraries by editing a single concrete constructor.
- **Checked Checklists**: User checklists (workouts, groceries) leverage local state mapping coordinates, preventing database roundtrips for minor local visual updates.
