# 🧪 Quality Assurance & Testing Specification Manual

This document details the testing suites, automated scripts, manual QA checklists, and regression guards for the FitSage AI application.

---

## 1. Automated Testing Suites

### Backend Unit & Integration Tests
The backend uses **Python Unittest** or **Pytest** to verify routing controllers and AI service filters.
- **Run Backend Tests**:
  ```bash
  cd backend
  python -m unittest discover -s tests
  ```

### Frontend Compilation Checks
Verify frontend React types, modules importing paths, and build scripts:
- **Run Compilation Build**:
  ```bash
  cd frontend
  npm run build
  ```

---

## 2. Targeted Security & Authentication Tests
Automated checks are written inside **[verify_security.py](file:///C:/Users/revad/.gemini/antigravity/brain/87f50257-76df-430e-847a-c08a5a73edcb/scratch/verify_security.py)** and **[verify_auth.py](file:///C:/Users/revad/.gemini/antigravity/brain/87f50257-76df-430e-847a-c08a5a73edcb/scratch/verify_auth.py)**:

1. **IDOR Prevention (Data Isolation)**:
   - Registers two separate users: `userA@example.com` and `userB@example.com`.
   - Log in `userA` to receive their token.
   - Attempts to access `/profile/userB@example.com` with `userA`'s token.
   - **Assertion**: API returns `403 Forbidden` with a security warning.
2. **Access Token Expiry**:
   - Mocks the JWT generation with an expired timestamp (e.g., `exp: now - 1s`).
   - Sends a request to protected paths.
   - **Assertion**: API returns `401 Unauthorized`.
3. **Refresh Token Flow**:
   - Calls `/auth/refresh` with `userA`'s refresh token.
   - **Assertion**: API returns a new access token.

---

## 3. Targeted AI Service Tests
Tested using **[test_ai_service.py](file:///C:/Users/revad/.gemini/antigravity/brain/87f50257-76df-430e-847a-c08a5a73edcb/scratch/test_ai_service.py)**:

1. **Injury Sanity Swapping**:
   - Configures a user with `"Knee Pain"`.
   - Generates a workout plan.
   - **Assertion**: Squats and leg-press exercises are removed and replaced with low-impact alternatives (e.g., glute bridges).
2. **Dynamic Invalidation Caching**:
   - Generates a meal plan for a user (Cache miss).
   - Generates the meal plan again (Cache hit, returns in 0.0s).
   - Updates the user's budget in their profile.
   - Generates the meal plan a third time (Cache miss, regenerates because the profile hash changed).
3. **Weight Loss Limits**:
   - Requests a plan to lose 10 kg in 3 days.
   - **Assertion**: The safety layer intercepts the request, adjusts the target weight-loss rate to a safe range (0.5–1.0 kg/week), and injects a warning message.

---

## 4. Manual QA Verification Checklist

Execute these checks to manually verify the application:

- [ ] **Registration**: Sign up with an invalid email address (e.g., `invalid-email`). Verify client-side warnings are displayed.
- [ ] **Login**: Sign in with incorrect credentials. Verify the app displays "Invalid email or password" and does not redirect.
- [ ] **Theme Switcher**: Click the theme toggle button in the sidebar. Verify the background changes immediately, no layout shifts occur, and selection persists on refresh.
- [ ] **Streaks**: Log weight and water intake on the dashboard. Verify that the streak count increments by 1.
- [ ] **Collapsible Layout**: Reduce browser width to mobile size (<768px). Verify that the desktop sidebar disappears, a top header with a hamburger menu displays, and the drawer overlay behaves correctly.
- [ ] **Shopping Groceries**: Mark items on the shopping list as bought. Verify that the items are crossed out, checkmarks appear, and the toast alert displays.
- [ ] **Interactive Workout Checklist**: Navigate to Workouts, select day tabs, check off exercises. Verify they cross out immediately.
- [ ] **Voice Assistance**: Open AI Coach, click "Listen" on any AI response bubble. Verify text-to-speech audio plays correctly.

---

## 5. Regression Checklist
Run the following steps before submitting code changes:
1. Verify the frontend builds successfully: `npm run build`.
2. Verify all API endpoints return the standard response format: `{"message": "..."}` or `{"error": "..."}`.
3. Verify database tables are not dropped or recreated during server restarts.
4. Verify AI generation requests do not run indefinitely without timeouts.
