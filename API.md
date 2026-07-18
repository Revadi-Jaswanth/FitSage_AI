# 📞 API Specification Reference Manual

All endpoints communicate via JSON payloads. Standard success messages follow a unified structure.

---

## 1. Authentication Endpoints

### Register Account
Creates a user profile with default "user" role permissions.
- **Method**: `POST`
- **Route**: `/auth/register`
- **Authentication Required**: No
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Example**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully."
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "Email is already registered."
  }
  ```

---

### Login Session
Validates credentials and generates access & refresh tokens.
- **Method**: `POST`
- **Route**: `/auth/login`
- **Authentication Required**: No
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Example**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Login successful",
    "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "email": "jane@example.com",
    "role": "user"
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  {
    "error": "Invalid email or password"
  }
  ```

---

### Refresh Access Token
Issues a new short-lived access token using a valid refresh token.
- **Method**: `POST`
- **Route**: `/auth/refresh`
- **Authentication Required**: No (Token provided in payload)
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Example**:
  ```json
  {
    "refresh_token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  {
    "error": "Invalid or expired refresh token"
  }
  ```

---

### Logout Session
Invalidates current tokens.
- **Method**: `POST`
- **Route**: `/auth/logout`
- **Authentication Required**: Yes
- **Headers**:
  ```http
  Authorization: Bearer <access_token>
  ```
- **Request Example**: *Empty Body*
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

## 2. Profile & Summary Endpoints

### Fetch Profile details
Retrieves user metrics and personalization filters.
- **Method**: `GET`
- **Route**: `/profile/<email>`
- **Authentication Required**: Yes (Must own resource email)
- **Headers**:
  ```http
  Authorization: Bearer <access_token>
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "age": 28,
    "gender": "Female",
    "height": 165,
    "weight": 62,
    "goal": "Weight Loss",
    "diet": "Vegetarian",
    "budget": 2000,
    "activity": "Moderate",
    "equipment": "Dumbbells Only",
    "fitness_level": "Intermediate",
    "allergies": "Peanuts",
    "injuries": "Knee Pain",
    "workout_duration": 45
  }
  ```
- **Error Response (403 Forbidden)**:
  ```json
  {
    "error": "You do not have permission to access this resource."
  }
  ```

---

### Update Profile
Saves new user metrics.
- **Method**: `PUT`
- **Route**: `/profile/<email>`
- **Authentication Required**: Yes (Must own resource email)
- **Request Example**:
  ```json
  {
    "age": 29,
    "gender": "Female",
    "height": 165,
    "weight": 60,
    "goal": "Muscle Gain",
    "diet": "Vegetarian",
    "budget": 2000,
    "activity": "High",
    "equipment": "Full Gym",
    "fitness_level": "Advanced",
    "allergies": "Peanuts",
    "injuries": "None",
    "workout_duration": 60
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Profile updated successfully."
  }
  ```

---

### Fetch Summary Stats
Retrieves aggregated dashboard logs.
- **Method**: `GET`
- **Route**: `/summary/<email>`
- **Authentication Required**: Yes
- **Success Response (200 OK)**:
  ```json
  {
    "profile": {
      "name": "Jane Doe",
      "goal": "Weight Loss",
      "height": 165,
      "weight": 62
    },
    "dashboard": {
      "current_weight": 62.0,
      "average_water": 2500,
      "workouts_completed": 8
    },
    "latest_workout": "DAY 1 - Full Body [Beginner]...",
    "latest_meal": "Breakfast: Oatmeal with Milk..."
  }
  ```

---

## 3. AI Generation Endpoints

### Generate Workout Routine
Calculates workouts, filtering joint injuries.
- **Method**: `GET`
- **Route**: `/workout/generate/<email>`
- **Parameters**: `?force=true` (Optional, bypasses cache)
- **Authentication Required**: Yes
- **Success Response (200 OK)**:
  ```json
  {
    "workout_plan": "DAY 1 - Core Stability [Beginner]\n- Duration: 40 mins | Est. Calories Burned: 220 kcal\n- Target Muscle Groups: Core, Glutes\n- Exercises:\n  - Glute Bridge: 3 x 15 (Rest: 60s)\n  - Bird Dog: 3 x 12 (Rest: 45s)\n",
    "source": "database"
  }
  ```

---

### Generate Meal Planner
Generates Indian menus, checking diet/allergies.
- **Method**: `GET`
- **Route**: `/meal/generate/<email>`
- **Parameters**: `?force=true` (Optional)
- **Authentication Required**: Yes
- **Success Response (200 OK)**:
  ```json
  {
    "meal_plan": "Breakfast:\nOatmeal with Almonds | Calories: 350 kcal | Protein: 10g | Carbs: 55g | Fat: 8g\nIngredients: Oats (50g), Almonds (10g), Skimmed Milk (200ml)\nPreparation: Boil oats in milk and garnish with sliced almonds.\n\nShopping List:\n- Oats\n- Almonds\n- Skimmed Milk\n",
    "source": "generation"
  }
  ```

---

## 4. AI Coach Endpoints

### Send Message
Asks coach questions and retrieves recommendations.
- **Method**: `POST`
- **Route**: `/coach/chat`
- **Authentication Required**: Yes
- **Request Example**:
  ```json
  {
    "email": "jane@example.com",
    "message": "Can I replace squats if my knees hurt?"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "reply": "Yes, you should avoid deep knee loading. Try replacing squats with Glute Bridges or Planks to target your legs and core safely."
  }
  ```

---

### Fetch Chat logs history
Loads past conversations chronologically.
- **Method**: `GET`
- **Route**: `/coach/history/<email>`
- **Authentication Required**: Yes
- **Success Response (200 OK)**:
  ```json
  [
    {
      "user_message": "Can I replace squats if my knees hurt?",
      "ai_response": "Yes, you should avoid deep knee loading...",
      "date": "2026-07-16T13:00:00Z"
    }
  ]
  ```

---

## 5. Progress Tracking Endpoints

### Log Daily Metrics
Saves weight, water, and workouts.
- **Method**: `POST`
- **Route**: `/progress/log`
- **Authentication Required**: Yes
- **Request Example**:
  ```json
  {
    "email": "jane@example.com",
    "date": "2026-07-16",
    "weight": 61.5,
    "water_intake": 2750,
    "calories_consumed": 1800,
    "workout_completed": true
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Progress metrics logged successfully."
  }
  ```

---

### Fetch History Logs
Retrieves all logs for graphing.
- **Method**: `GET`
- **Route**: `/progress/history/<email>`
- **Authentication Required**: Yes
- **Success Response (200 OK)**:
  ```json
  [
    {
      "date": "2026-07-16",
      "weight": 61.5,
      "water_intake": 2750,
      "calories_consumed": 1800,
      "workout_completed": true
    }
  ]
  ```
