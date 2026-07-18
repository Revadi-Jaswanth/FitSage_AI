import time
import json
from datetime import datetime

from services.providers import GeminiProvider
from services.prompt_builder import (
    build_workout_prompt,
    build_meal_prompt,
    build_recommendation_prompt,
    build_coach_prompt,
    build_insights_prompt
)
from services.response_validator import (
    validate_against_schema,
    repair_json_string,
    get_fallback_response
)
from schemas.workout_schema import WORKOUT_SCHEMA
from schemas.meal_schema import MEAL_SCHEMA
from schemas.coach_schema import COACH_SCHEMA
from schemas.recommendation_schema import RECOMMENDATION_SCHEMA
from schemas.insights_schema import INSIGHTS_SCHEMA
from services.safety_checker import check_weight_loss_safety, sanitize_workout_safety
from services.cache_service import (
    get_user_profile_dict,
    get_profile_hash,
    check_workout_cache,
    check_meal_cache
)
from services.ai_logger import log_ai_metric

# Instantiate the active provider. Easily swappable for OpenAI / Claude.
provider = GeminiProvider()

# --- BACKWARD COMPATIBLE MARKDOWN FORMATTERS ---

def format_workout_to_markdown(data):
    schedule = data.get("weekly_schedule", [])
    md = ""
    for day in schedule:
        md += f"DAY {day.get('day')} - {day.get('title')} [{day.get('difficulty')}]\n"
        md += f"- Duration: {day.get('duration_minutes')} mins | Est. Calories Burned: {day.get('estimated_calories_burned')} kcal\n"
        md += f"- Target Muscle Groups: {', '.join(day.get('target_muscle_groups', []))}\n"
        md += "- Exercises:\n"
        for ex in day.get("exercises", []):
            md += f"  - {ex.get('name')}: {ex.get('sets')} x {ex.get('reps')} (Rest: {ex.get('rest_seconds')}s)\n"
        md += "\n"
    return md.strip()

def format_meal_to_markdown(data):
    meals = data.get("daily_meals", [])
    md = ""
    for meal in meals:
        md += f"{meal.get('meal_type')}:\n"
        md += f"{meal.get('name')} | Calories: {meal.get('calories')} kcal | Protein: {meal.get('protein_grams')}g | Carbs: {meal.get('carbs_grams')}g | Fat: {meal.get('fat_grams')}g\n"
        md += f"Ingredients: {', '.join([i.get('name', '') + ' (' + i.get('amount', '') + ')' for i in meal.get('ingredients', [])])}\n"
        md += f"Preparation: {meal.get('preparation')}\n\n"
        
    shopping = data.get("shopping_list", [])
    if shopping:
        md += "Shopping List:\n"
        for s in shopping:
            md += f"- {s.get('item')}: {s.get('amount')}\n"
    return md.strip()

def format_recommendations_to_markdown(data):
    recs = data.get("recommendations", [])
    md = ""
    for r in recs:
        md += f"Category: {r.get('category')} ({r.get('priority')} Priority)\n"
        md += f"Description: {r.get('description')}\n"
        md += f"Reasoning: {r.get('reason')}\n\n"
    return md.strip()

def format_coach_to_markdown(data):
    md = f"{data.get('answer')}\n\n"
    
    tips = data.get("tips", [])
    if tips:
        md += "Tips:\n"
        for t in tips:
            md += f"- {t}\n"
        md += "\n"
        
    warnings = data.get("warnings", [])
    if warnings:
        md += "Warnings:\n"
        for w in warnings:
            md += f"- {w}\n"
        md += "\n"
        
    motivation = data.get("motivation")
    if motivation:
        md += f"Motivation:\n*{motivation}*\n\n"
        
    actions = data.get("suggested_next_actions", [])
    if actions:
        md += "Suggested Next Actions:\n"
        for a in actions:
            md += f"- {a}\n"
            
    return md.strip()


# --- ORCHESTRATED AI SERVICES ---

def fetch_user_and_hash(cursor, email):
    """
    Utility helper to fetch latest user record, map to dict, and generate profile checksum hash.
    """
    cursor.execute(
        """
        SELECT id, name, email, age, gender, height, weight, goal, diet, budget, activity, equipment, role, fitness_level, allergies, injuries, workout_duration, profile_completed, initial_setup_completed, workout_status, meal_status, recommendations_status, insights_status, workout_location, medical_conditions, water_goal, sleep_hours, bmr, calories_target, ai_insights, current_streak, longest_streak
        FROM users 
        WHERE email=%s
        """,
        (email,)
    )
    user_tuple = cursor.fetchone()
    if not user_tuple:
        return None, None, None
        
    user_dict = get_user_profile_dict(user_tuple)
    current_hash = get_profile_hash(user_dict)
    
    # Calculate BMI
    height = user_dict.get("height")
    weight = user_dict.get("weight")
    bmi = 22.0
    if height and weight and height > 0:
        bmi = round(weight / ((height / 100) ** 2), 1)
        
    return user_dict, current_hash, bmi

def call_provider_with_retry(prompt, schema, prompt_type):
    """
    Generates response from provider and validates it.
    If fails validation, retries once.
    If still fails, repairs JSON.
    If repair fails, returns static fallback dict.
    """
    start_time = time.time()
    retries = 0
    validation_status = False
    json_data = None
    model_name = provider.model_name
    error_msg = None
    
    try:
        raw_res, model_name = provider.generate_json(prompt)
        json_data = repair_json_string(raw_res)
        
        if json_data:
            validation_status, errors = validate_against_schema(json_data, schema)
            if not validation_status:
                error_msg = f"First validation failed: {', '.join(errors)}"
                # Try retry logic: regenerate once
                retries = 1
                retry_prompt = f"""
                Your previous response failed JSON schema validation.
                Errors: {errors}
                Previous Response: {raw_res}
                
                Please correct the response and return ONLY valid JSON matching the schema.
                """
                raw_res, _ = provider.generate_json(retry_prompt)
                json_data = repair_json_string(raw_res)
                if json_data:
                    validation_status, errors = validate_against_schema(json_data, schema)
                    if not validation_status:
                        error_msg = f"Retry validation failed: {', '.join(errors)}"
                        # Try fallback recovery
                        json_data = get_fallback_response(schema)
                        validation_status = True
                else:
                    json_data = get_fallback_response(schema)
                    validation_status = True
        else:
            # Try fallback recovery
            error_msg = "Initial response was not parseable as JSON"
            json_data = get_fallback_response(schema)
            validation_status = True
            
    except Exception as e:
        error_msg = str(e)
        json_data = get_fallback_response(schema)
        validation_status = True
        
    latency = time.time() - start_time
    log_ai_metric(
        prompt_type=prompt_type,
        latency_seconds=latency,
        cache_status="MISS",
        retry_count=retries,
        validation_status=validation_status,
        model_name=model_name,
        status="SUCCESS" if error_msg is None else "ERROR",
        error_msg=error_msg
    )
    
    return json_data

def log_ai_generation_telemetry(cursor, db, user_id, gen_type, model_name, temp, time_ms, cache_hit, profile_hash, status, error_msg=None):
    from flask import g
    import uuid
    request_id = getattr(g, "request_id", str(uuid.uuid4()))
    try:
        cursor.execute(
            """
            INSERT INTO ai_generations
            (user_id, generation_type, model_name, temperature, generation_time_ms, cache_hit, profile_hash, status, error_message)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (user_id, gen_type, model_name, temp, time_ms, cache_hit, profile_hash, status, error_msg)
        )
        db.commit()
    except Exception as e:
        print(f"Failed to log AI telemetry: {e}")

def generate_workout_plan(cursor, db, email, force_regenerate=False):
    """
    Retrieves or generates a personalized weekly workout plan.
    """
    user_dict, current_hash, bmi = fetch_user_and_hash(cursor, email)
    if not user_dict:
        return {"error": "User not found"}, 404
        
    # Check cache first
    if not force_regenerate:
        cached_plan = check_workout_cache(cursor, user_dict["id"], current_hash)
        if cached_plan:
            log_ai_metric(
                prompt_type="Workout Generation",
                latency_seconds=0.0,
                cache_status="HIT",
                retry_count=0,
                validation_status=True,
                model_name=provider.model_name,
                status="SUCCESS"
            )
            # Log telemetry
            log_ai_generation_telemetry(
                cursor, db, user_dict["id"], "workout", provider.model_name, 
                provider.temperature, 0, True, current_hash, "completed"
            )
            return {
                "message": "Showing cached workout plan",
                "source": "cache",
                "workout_plan": cached_plan
            }, 200
            
    # Cache miss: generate plan
    start_time = time.time()
    try:
        prompt = build_workout_prompt(user_dict, bmi)
        json_data = call_provider_with_retry(prompt, WORKOUT_SCHEMA, "Workout Generation")
        
        # Adjust for safety (injuries, limits)
        json_data = sanitize_workout_safety(user_dict.get("injuries"), json_data)
        
        # Convert to formatted markdown
        markdown_plan = format_workout_to_markdown(json_data)
        
        # Cache back to database
        cursor.execute(
            """
            INSERT INTO workouts
            (user_id, workout_plan, profile_hash)
            VALUES (%s, %s, %s)
            """,
            (user_dict["id"], markdown_plan, current_hash)
        )
        db.commit()
        
        time_ms = int((time.time() - start_time) * 1000)
        # Log telemetry
        log_ai_generation_telemetry(
            cursor, db, user_dict["id"], "workout", provider.model_name, 
            provider.temperature, time_ms, False, current_hash, "completed"
        )
        
        return {
            "message": "Workout Generated Successfully",
            "source": "gemini",
            "workout_plan": markdown_plan
        }, 200
    except Exception as e:
        time_ms = int((time.time() - start_time) * 1000)
        # Log failure telemetry
        log_ai_generation_telemetry(
            cursor, db, user_dict["id"], "workout", provider.model_name, 
            provider.temperature, time_ms, False, current_hash, "failed", str(e)
        )
        raise e

def generate_meal_plan(cursor, db, email, force_regenerate=False):
    """
    Retrieves or generates a personalized Indian meal plan.
    """
    user_dict, current_hash, bmi = fetch_user_and_hash(cursor, email)
    if not user_dict:
        return {"error": "User not found"}, 404
        
    # Check cache first
    if not force_regenerate:
        cached_plan = check_meal_cache(cursor, user_dict["id"], current_hash)
        if cached_plan:
            log_ai_metric(
                prompt_type="Meal Generation",
                latency_seconds=0.0,
                cache_status="HIT",
                retry_count=0,
                validation_status=True,
                model_name=provider.model_name,
                status="SUCCESS"
            )
            # Log telemetry
            log_ai_generation_telemetry(
                cursor, db, user_dict["id"], "meal", provider.model_name, 
                provider.temperature, 0, True, current_hash, "completed"
            )
            return {
                "meal_plan": cached_plan,
                "source": "cache"
            }, 200
            
    # Cache miss
    start_time = time.time()
    try:
        prompt = build_meal_prompt(user_dict, bmi)
        json_data = call_provider_with_retry(prompt, MEAL_SCHEMA, "Meal Generation")
        
        # Parse calories/macros to save in meals table
        calories = 0
        protein = 0
        cost = 0
        
        meals_list = json_data.get("daily_meals", [])
        for m in meals_list:
            calories += m.get("calories", 0)
            protein += m.get("protein_grams", 0)
            
        shopping_list = json_data.get("shopping_list", [])
        
        markdown_plan = format_meal_to_markdown(json_data)
        
        # Save to database
        cursor.execute(
            """
            INSERT INTO meals
            (user_id, meal_plan, calories, protein, cost, profile_hash)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (user_dict["id"], markdown_plan, calories, protein, cost, current_hash)
        )
        db.commit()
        
        time_ms = int((time.time() - start_time) * 1000)
        # Log telemetry
        log_ai_generation_telemetry(
            cursor, db, user_dict["id"], "meal", provider.model_name, 
            provider.temperature, time_ms, False, current_hash, "completed"
        )
        
        return {
            "meal_plan": markdown_plan,
            "source": "gemini"
        }, 200
    except Exception as e:
        time_ms = int((time.time() - start_time) * 1000)
        # Log failure telemetry
        log_ai_generation_telemetry(
            cursor, db, user_dict["id"], "meal", provider.model_name, 
            provider.temperature, time_ms, False, current_hash, "failed", str(e)
        )
        raise e

def generate_recommendations(cursor, db, email):
    """
    Generates daily suggestions.
    """
    user_dict, _, _ = fetch_user_and_hash(cursor, email)
    if not user_dict:
        return {"error": "User not found"}, 404
        
    start_time = time.time()
    try:
        prompt = build_recommendation_prompt(user_dict)
        json_data = call_provider_with_retry(prompt, RECOMMENDATION_SCHEMA, "Recommendations Generation")
        
        markdown_recs = format_recommendations_to_markdown(json_data)
        time_ms = int((time.time() - start_time) * 1000)
        
        log_ai_generation_telemetry(
            cursor, db, user_dict["id"], "recommendations", provider.model_name,
            provider.temperature, time_ms, False, None, "completed"
        )
        return {
            "recommendations": markdown_recs,
            "source": "gemini"
        }, 200
    except Exception as e:
        time_ms = int((time.time() - start_time) * 1000)
        log_ai_generation_telemetry(
            cursor, db, user_dict["id"], "recommendations", provider.model_name,
            provider.temperature, time_ms, False, None, "failed", str(e)
        )
        raise e

def coach_chat(cursor, db, email, message, session_id="default"):
    """
    Handles interactive coaching chat with context memory and safety filters.
    """
    user_dict, _, _ = fetch_user_and_hash(cursor, email)
    if not user_dict:
        return {"error": "User not found"}, 404
        
    # Get conversational memory window (last 5 turns) scoped by session_id
    cursor.execute(
        """
        SELECT user_message, ai_response
        FROM coach_chat
        WHERE user_id=%s AND session_id=%s
        ORDER BY created_at DESC
        LIMIT 5
        """,
        (user_dict["id"], session_id)
    )
    rows = cursor.fetchall()
    recent_history = []
    for r in reversed(rows):
        recent_history.append({
            "user_message": r[0],
            "ai_response": r[1]
        })
        
    # Get conversation summary
    cursor.execute("SELECT summary FROM coach_summary WHERE user_id=%s", (user_dict["id"],))
    summary_res = cursor.fetchone()
    old_summary = summary_res[0] if summary_res else None
    
    # Generate new summary if history accumulates for this session
    new_summary = old_summary
    cursor.execute("SELECT COUNT(*) FROM coach_chat WHERE user_id=%s AND session_id=%s", (user_dict["id"], session_id))
    count_turns = cursor.fetchone()[0]
    
    if count_turns > 0 and count_turns % 5 == 0:
        # Generate updated summary
        summary_prompt = f"""
        Summarize the user's fitness goals, topics discussed, and recommendations in 2-3 sentences.
        Old Summary: {old_summary or 'None'}
        Recent turns: {recent_history}
        Return JSON with key "summary".
        """
        raw_sum, _ = provider.generate_json(summary_prompt)
        try:
            summary_data = json.loads(raw_sum)
            new_summary = summary_data.get("summary", old_summary)
            # Update summary in DB
            cursor.execute(
                """
                INSERT INTO coach_summary (user_id, summary)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE summary=%s
                """,
                (user_dict["id"], new_summary, new_summary)
            )
            db.commit()
        except:
            pass
            
    # Apply weight loss safety filters to inputs
    is_safe, safety_feedback = check_weight_loss_safety(message)
    if not is_safe:
        safety_json = {
            "answer": f"I notice you requested help with rapid weight reduction. {safety_feedback['warning']} {safety_feedback['recommendation']} {safety_feedback['explanation']}",
            "tips": ["Set healthy weight-loss targets of 0.5-1 kg/week.", "Focus on progressive strength training."],
            "warnings": ["Avoid extreme calorie deficits (<1200 kcal/day)."],
            "motivation": "Consistency beats extreme shortcuts.",
            "suggested_next_actions": ["Adjust daily calorie targets", "Focus on walking 8k steps"]
        }
        markdown_reply = format_coach_to_markdown(safety_json)
        
        # Save chat log with session_id
        cursor.execute(
            """
            INSERT INTO coach_chat (user_id, user_message, ai_response, session_id)
            VALUES (%s, %s, %s, %s)
            """,
            (user_dict["id"], message, markdown_reply, session_id)
        )
        db.commit()
        
        return {"reply": markdown_reply}, 200
        
    # Standard generation
    prompt = build_coach_prompt(user_dict, message, recent_history, new_summary)
    json_data = call_provider_with_retry(prompt, COACH_SCHEMA, "Coach Conversation")
    
    markdown_reply = format_coach_to_markdown(json_data)
    
    # Save chat history with session_id
    cursor.execute(
        """
        INSERT INTO coach_chat (user_id, user_message, ai_response, session_id)
        VALUES (%s, %s, %s, %s)
        """,
        (user_dict["id"], message, markdown_reply, session_id)
    )
    db.commit()
    
    return {"reply": markdown_reply}, 200

def generate_dashboard_insights(cursor, db, email):
    """
    Generates personalized daily health insights and stores them in the users table.
    """
    user_dict, _, bmi = fetch_user_and_hash(cursor, email)
    if not user_dict:
        return {"error": "User not found"}, 404
        
    start_time = time.time()
    try:
        prompt = build_insights_prompt(user_dict, bmi)
        json_data = call_provider_with_retry(prompt, INSIGHTS_SCHEMA, "Insights Generation")
        
        insight_text = json_data.get("insight", "Consistency is the key to unlocking your fitness goals.")
        
        # Save to user profile directly
        cursor.execute(
            "UPDATE users SET ai_insights=%s WHERE email=%s",
            (insight_text, email)
        )
        db.commit()
        
        time_ms = int((time.time() - start_time) * 1000)
        log_ai_generation_telemetry(
            cursor, db, user_dict["id"], "insights", provider.model_name,
            provider.temperature, time_ms, False, None, "completed"
        )
        
        return {
            "insight": insight_text,
            "source": "gemini"
        }, 200
    except Exception as e:
        time_ms = int((time.time() - start_time) * 1000)
        log_ai_generation_telemetry(
            cursor, db, user_dict["id"], "insights", provider.model_name,
            provider.temperature, time_ms, False, None, "failed", str(e)
        )
        raise e
