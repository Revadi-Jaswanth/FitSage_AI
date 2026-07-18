import re
import os
import bcrypt
import jwt
from flask import Blueprint, request, g

from database import db, cursor
from auth import token_required, generate_tokens, JWT_SECRET
from services.onboarding_service import calculate_bmr_and_calories, update_user_streak
from services.cache_service import get_user_profile_dict, get_profile_hash
from utils.response import make_api_response

auth = Blueprint("auth", __name__)

EMAIL_REGEX = re.compile(r'^[\w\.-]+@[\w\.-]+\.\w+$')

# ---------------- REGISTER ---------------- #

@auth.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    
    # Input validation
    errors = {}
    if not name:
        errors["name"] = "Name is required"
    if not email:
        errors["email"] = "Email is required"
    elif not EMAIL_REGEX.match(email):
        errors["email"] = "Invalid email format"
    if not password:
        errors["password"] = "Password is required"
    elif len(password) < 6:
        errors["password"] = "Password must be at least 6 characters long"
        
    if errors:
        return make_api_response(
            success=False,
            message="Registration failed: validation errors",
            errors=errors,
            status_code=400
        )
        
    # Check uniqueness
    cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
    if cursor.fetchone():
        return make_api_response(
            success=False,
            message="Registration failed: email already in use",
            errors={"email": "Email is already registered"},
            status_code=400
        )
        
    # Hash password
    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )
    
    query = """
    INSERT INTO users
    (name, email, password, role)
    VALUES (%s, %s, %s, %s)
    """
    values = (
        name,
        email,
        hashed_password.decode("utf-8"),
        "user" # default role
    )
    
    try:
        cursor.execute(query, values)
        db.commit()
    except Exception as e:
        return make_api_response(
            success=False,
            message="Server error during registration",
            errors={"database": str(e)},
            status_code=500
        )
        
    return make_api_response(
        success=True,
        message="User Registered Successfully",
        data={},
        status_code=201
    )


# ---------------- LOGIN ---------------- #

@auth.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    
    email = data.get("email", "").strip()
    password = data.get("password", "")
    
    errors = {}
    if not email:
        errors["email"] = "Email is required"
    if not password:
        errors["password"] = "Password is required"
        
    if errors:
        return make_api_response(
            success=False,
            message="Login failed: validation errors",
            errors=errors,
            status_code=400
        )
        
    cursor.execute(
        "SELECT id, name, email, password, role FROM users WHERE email=%s",
        (email,)
    )
    user = cursor.fetchone()
    
    if not user:
        return make_api_response(
            success=False,
            message="Login failed: user not found",
            errors={"email": "No user registered with this email"},
            status_code=404
        )
        
    stored_password = user[3]
    role = user[4]
    
    if bcrypt.checkpw(
        password.encode("utf-8"),
        stored_password.encode("utf-8")
    ):
        try:
            update_user_streak(cursor, db, email)
        except Exception as e:
            print(f"Failed to update streak on login: {e}")
        tokens = generate_tokens(email, role)
        return make_api_response(
            success=True,
            message="Login Successful",
            data={
                "access_token": tokens["access_token"],
                "refresh_token": tokens["refresh_token"],
                "email": email,
                "name": user[1],
                "role": role
            },
            status_code=200
        )
        
    return make_api_response(
        success=False,
        message="Login failed: invalid credentials",
        errors={"password": "Password is incorrect"},
        status_code=401
    )


# ---------------- REFRESH TOKEN ---------------- #

@auth.route("/refresh", methods=["POST"])
def refresh():
    data = request.json or {}
    refresh_token = data.get("refresh_token")
    
    if not refresh_token:
        return make_api_response(
            success=False,
            message="Refresh token is missing",
            errors={"refresh_token": "Token required"},
            status_code=400
        )
        
    try:
        payload = jwt.decode(refresh_token, JWT_SECRET, algorithms=["HS256"])
        
        if payload.get("type") != "refresh":
            return make_api_response(
                success=False,
                message="Invalid token type, refresh token required",
                errors={"refresh_token": "Incorrect token type"},
                status_code=400
            )
            
        email = payload["email"]
        
        cursor.execute("SELECT role FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()
        if not user:
            return make_api_response(
                success=False,
                message="User not found",
                errors={"user": "User does not exist"},
                status_code=404
            )
            
        role = user[0]
        tokens = generate_tokens(email, role)
        
        return make_api_response(
            success=True,
            message="Token refreshed successfully",
            data={
                "access_token": tokens["access_token"],
                "refresh_token": refresh_token
            },
            status_code=200
        )
    except jwt.ExpiredSignatureError:
        return make_api_response(
            success=False,
            message="Refresh token has expired",
            errors={"refresh_token": "Token expired"},
            status_code=401
        )
    except jwt.InvalidTokenError:
        return make_api_response(
            success=False,
            message="Invalid refresh token",
            errors={"refresh_token": "Token decoding failed"},
            status_code=401
        )


# ---------------- GET PROFILE ---------------- #

@auth.route("/profile", methods=["GET"])
@token_required
def get_profile_new():
    email = g.user_email
    cursor.execute(
        """
        SELECT id, name, email, age, gender, height, weight, goal, diet, budget, activity, equipment, role, 
               fitness_level, allergies, injuries, workout_duration, profile_completed, initial_setup_completed, 
               workout_status, meal_status, recommendations_status, insights_status, workout_location, 
               medical_conditions, water_goal, sleep_hours, bmr, calories_target, ai_insights, 
               current_streak, longest_streak
        FROM users WHERE email=%s
        """,
        (email,)
    )
    user_tuple = cursor.fetchone()
    
    if not user_tuple:
        return make_api_response(
            success=False,
            message="User not found",
            errors={"user": "Profile does not exist"},
            status_code=404
        )
        
    user_dict = get_user_profile_dict(user_tuple)
    return make_api_response(
        success=True,
        message="Profile retrieved successfully",
        data=user_dict,
        status_code=200
    )

@auth.route("/profile/<email>", methods=["GET"])
@token_required
def get_profile(email):
    # Delegate to secure implementation, ignoring parameter
    return get_profile_new()


# ---------------- UPDATE PROFILE ---------------- #

@auth.route("/update", methods=["PUT"])
@token_required
def update_profile_new():
    email = g.user_email
    data = request.json or {}
    
    # Fetch old profile for comparison
    cursor.execute(
        """
        SELECT id, name, email, age, gender, height, weight, goal, diet, budget, activity, equipment, role, 
               fitness_level, allergies, injuries, workout_duration, profile_completed, initial_setup_completed, 
               workout_status, meal_status, recommendations_status, insights_status, workout_location, 
               medical_conditions, water_goal, sleep_hours, bmr, calories_target, ai_insights, 
               current_streak, longest_streak
        FROM users WHERE email=%s
        """,
        (email,)
    )
    user_tuple = cursor.fetchone()
    if not user_tuple:
        return make_api_response(
            success=False, 
            message="User not found", 
            errors={"user": "Profile does not exist"}, 
            status_code=404
        )
        
    old_profile = get_user_profile_dict(user_tuple)
    old_hash = get_profile_hash(old_profile)
    
    age = data.get("age")
    gender = data.get("gender")
    height = data.get("height")
    weight = data.get("weight")
    goal = data.get("goal")
    diet = data.get("diet")
    budget = data.get("budget")
    activity = data.get("activity")
    equipment = data.get("equipment")
    fitness_level = data.get("fitness_level")
    allergies = data.get("allergies")
    injuries = data.get("injuries")
    workout_duration = data.get("workout_duration")
    workout_location = data.get("workout_location")
    medical_conditions = data.get("medical_conditions")
    water_goal = data.get("water_goal")
    sleep_hours = data.get("sleep_hours")
    
    def parse_budget(b_val):
        if b_val is None:
            return 0
        try:
            return int(b_val)
        except ValueError:
            pass
        b_str = str(b_val).lower()
        if "less than" in b_str:
            return 150
        elif "150" in b_str and "300" in b_str:
            return 300
        elif "300" in b_str and "500" in b_str:
            return 500
        elif "more than" in b_str:
            return 750
        return 0

    parsed_budget = parse_budget(budget)

    # Check required fields
    required_fields = [age, gender, height, weight, goal, diet, budget, activity, equipment, fitness_level, workout_duration, workout_location, water_goal, sleep_hours]
    profile_completed = True
    for val in required_fields:
        if val is None or str(val).strip() == "":
            profile_completed = False
            break
            
    try:
        if age is not None and int(age) <= 0:
            profile_completed = False
        if height is not None and float(height) <= 0:
            profile_completed = False
        if weight is not None and float(weight) <= 0:
            profile_completed = False
    except (ValueError, TypeError):
        profile_completed = False
        
    bmr, calories_target = old_profile.get("bmr"), old_profile.get("calories_target")
    # Always try to calculate BMR & calories target if base fields are available
    if age and gender and height and weight and activity and goal:
        try:
            bmr, calories_target = calculate_bmr_and_calories(
                age, gender, height, weight, activity, goal
            )
        except Exception as e:
            print(f"Failed to calculate BMR/Calories target: {e}")
            
    # Build dictionary representing the new state
    new_profile = {
        **old_profile,
        "age": age,
        "gender": gender,
        "height": height,
        "weight": weight,
        "goal": goal,
        "diet": diet,
        "budget": parsed_budget,
        "activity": activity,
        "equipment": equipment,
        "fitness_level": fitness_level,
        "allergies": allergies,
        "injuries": injuries,
        "workout_duration": workout_duration,
        "workout_location": workout_location,
        "medical_conditions": medical_conditions,
        "water_goal": water_goal,
        "sleep_hours": sleep_hours,
        "profile_completed": profile_completed,
        "bmr": bmr,
        "calories_target": calories_target
    }
    
    new_hash = get_profile_hash(new_profile)
    
    if not profile_completed:
        workout_status = 'pending'
        meal_status = 'pending'
        recommendations_status = 'pending'
        insights_status = 'pending'
        initial_setup_completed = False
    else:
        if new_hash != old_hash:
            # Profile changed: reset statuses to trigger regeneration
            workout_status = 'pending'
            meal_status = 'pending'
            recommendations_status = 'pending'
            insights_status = 'pending'
            initial_setup_completed = False
        else:
            # Profile unchanged: preserve statuses
            workout_status = old_profile.get("workout_status") or 'pending'
            meal_status = old_profile.get("meal_status") or 'pending'
            recommendations_status = old_profile.get("recommendations_status") or 'pending'
            insights_status = old_profile.get("insights_status") or 'pending'
            initial_setup_completed = old_profile.get("initial_setup_completed") or False
            
    try:
        cursor.execute(
            """
            UPDATE users
            SET
            age=%s, gender=%s, height=%s, weight=%s, goal=%s, diet=%s, budget=%s, activity=%s, equipment=%s,
            fitness_level=%s, allergies=%s, injuries=%s, workout_duration=%s, workout_location=%s,
            medical_conditions=%s, water_goal=%s, sleep_hours=%s, profile_completed=%s,
            bmr=%s, calories_target=%s, workout_status=%s, meal_status=%s, 
            recommendations_status=%s, insights_status=%s, initial_setup_completed=%s
            WHERE email=%s
            """,
            (
                new_profile["age"], new_profile["gender"], new_profile["height"], new_profile["weight"],
                new_profile["goal"], new_profile["diet"], new_profile["budget"], new_profile["activity"],
                new_profile["equipment"], new_profile["fitness_level"], new_profile["allergies"],
                new_profile["injuries"], new_profile["workout_duration"], new_profile["workout_location"],
                new_profile["medical_conditions"], new_profile["water_goal"], new_profile["sleep_hours"],
                new_profile["profile_completed"], new_profile["bmr"], new_profile["calories_target"],
                workout_status, meal_status, recommendations_status, insights_status,
                initial_setup_completed, email
            )
        )
        db.commit()
    except Exception as e:
        return make_api_response(
            success=False,
            message="Failed to update profile",
            errors={"database": str(e)},
            status_code=500
        )
        
    return make_api_response(
        success=True,
        message="Profile Updated Successfully",
        data={
            "profile_completed": profile_completed,
            "initial_setup_completed": initial_setup_completed,
            "bmr": bmr,
            "calories_target": calories_target
        },
        status_code=200
    )

@auth.route("/update/<email>", methods=["PUT"])
@token_required
def update_profile(email):
    # Delegate to secure implementation, ignoring parameter
    return update_profile_new()