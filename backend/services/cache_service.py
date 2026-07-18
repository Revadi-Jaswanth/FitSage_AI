import hashlib
import json

def get_user_profile_dict(user_tuple):
    """
    Standardizes database users tuple into structured dict to protect index changes.
    Matches the schema: id, name, email, age, gender, height, weight, goal, diet, budget, activity, equipment, role, fitness_level, allergies, injuries, workout_duration
    """
    if not user_tuple:
        return {}
    
    # Safely unpack database tuple into a dictionary using matching indices
    return {
        "id": user_tuple[0],
        "name": user_tuple[1],
        "email": user_tuple[2],
        "age": user_tuple[3],
        "gender": user_tuple[4],
        "height": user_tuple[5],
        "weight": user_tuple[6],
        "goal": user_tuple[7],
        "diet": user_tuple[8],
        "budget": user_tuple[9],
        "activity": user_tuple[10],
        "equipment": user_tuple[11],
        "role": user_tuple[12],
        "fitness_level": user_tuple[13] if len(user_tuple) > 13 else "Beginner",
        "allergies": user_tuple[14] if len(user_tuple) > 14 else None,
        "injuries": user_tuple[15] if len(user_tuple) > 15 else None,
        "workout_duration": user_tuple[16] if len(user_tuple) > 16 else 45,
        "profile_completed": bool(user_tuple[17]) if len(user_tuple) > 17 else False,
        "initial_setup_completed": bool(user_tuple[18]) if len(user_tuple) > 18 else False,
        "workout_status": user_tuple[19] if len(user_tuple) > 19 else 'pending',
        "meal_status": user_tuple[20] if len(user_tuple) > 20 else 'pending',
        "recommendations_status": user_tuple[21] if len(user_tuple) > 21 else 'pending',
        "insights_status": user_tuple[22] if len(user_tuple) > 22 else 'pending',
        "workout_location": user_tuple[23] if len(user_tuple) > 23 else None,
        "medical_conditions": user_tuple[24] if len(user_tuple) > 24 else None,
        "water_goal": user_tuple[25] if len(user_tuple) > 25 else None,
        "sleep_hours": user_tuple[26] if len(user_tuple) > 26 else None,
        "bmr": user_tuple[27] if len(user_tuple) > 27 else None,
        "calories_target": user_tuple[28] if len(user_tuple) > 28 else 2000,
        "ai_insights": user_tuple[29] if len(user_tuple) > 29 else None,
        "current_streak": user_tuple[30] if len(user_tuple) > 30 else 0,
        "longest_streak": user_tuple[31] if len(user_tuple) > 31 else 0
    }

def get_profile_hash(user_dict):
    """
    Generates a stable sha256 checksum of user profile characteristics.
    Used to track whether plans need to be regenerated due to profile changes.
    """
    # Exclude metadata like id, name, email, role
    personalization_keys = [
        "age", "gender", "height", "weight", "goal", "diet", "budget",
        "activity", "equipment", "fitness_level", "allergies", "injuries", 
        "workout_duration", "workout_location", "medical_conditions", "water_goal", "sleep_hours"
    ]
    sub_dict = {k: user_dict.get(k) for k in personalization_keys}
    serialized = json.dumps(sub_dict, sort_keys=True, default=str)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()

def check_workout_cache(cursor, user_id, current_hash):
    """
    Queries workouts table for user.
    Returns cached workout_plan if profile hash matches, else returns None.
    """
    cursor.execute(
        "SELECT workout_plan, profile_hash FROM workouts WHERE user_id=%s ORDER BY created_at DESC LIMIT 1",
        (user_id,)
    )
    res = cursor.fetchone()
    if res:
        cached_plan, cached_hash = res
        if cached_hash == current_hash:
            return cached_plan
    return None

def check_meal_cache(cursor, user_id, current_hash):
    """
    Queries meals table for user.
    Returns cached meal_plan if profile hash matches, else returns None.
    """
    cursor.execute(
        "SELECT meal_plan, profile_hash FROM meals WHERE user_id=%s ORDER BY created_at DESC LIMIT 1",
        (user_id,)
    )
    res = cursor.fetchone()
    if res:
        cached_plan, cached_hash = res
        if cached_hash == current_hash:
            return cached_plan
    return None
