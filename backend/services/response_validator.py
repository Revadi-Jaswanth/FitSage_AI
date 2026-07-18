import re
import json

from schemas.workout_schema import WORKOUT_SCHEMA
from schemas.meal_schema import MEAL_SCHEMA
from schemas.coach_schema import COACH_SCHEMA
from schemas.recommendation_schema import RECOMMENDATION_SCHEMA
from schemas.insights_schema import INSIGHTS_SCHEMA

def clean_json_string(raw_str):
    """
    Cleans markdown code fences (```json ... ```) from Gemini outputs.
    """
    if not raw_str:
        return ""
    cleaned = raw_str.strip()
    
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
        
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
        
    return cleaned.strip()

def repair_json_string(raw_str):
    """
    Applies basic heuristic fixes to damaged JSON strings.
    - Closes trailing brackets
    - Fixes escaping
    - Strips garbage prefixes
    """
    cleaned = clean_json_string(raw_str)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Heuristic 1: Remove leading/trailing text outside of outermost curly brackets
    start_idx = cleaned.find("{")
    end_idx = cleaned.rfind("}")
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        candidate = cleaned[start_idx:end_idx + 1]
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            cleaned = candidate

    # Heuristic 2: Remove trailing commas before closing braces/brackets
    cleaned = re.sub(r',\s*([\]}])', r'\1', cleaned)
    
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Heuristic 3: Attempt to force-close missing curly braces
    open_curly = cleaned.count("{")
    close_curly = cleaned.count("}")
    if open_curly > close_curly:
        cleaned += "}" * (open_curly - close_curly)
        
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None

def validate_against_schema(data, schema):
    """
    Custom recursive validator to check fields, types, nested arrays, missing keys, and empty strings.
    Returns (is_valid_bool, list_of_error_strings).
    """
    errors = []
    
    if schema is None:
        return True, []
        
    schema_type = schema.get("type")
    
    if schema_type == "object":
        if not isinstance(data, dict):
            return False, [f"Expected dict, got {type(data).__name__}"]
            
        required_fields = schema.get("required", [])
        for field in required_fields:
            if field not in data:
                errors.append(f"Missing required key: '{field}'")
                
        properties = schema.get("properties", {})
        for key, val in data.items():
            if key in properties:
                val_ok, val_errs = validate_against_schema(val, properties[key])
                if not val_ok:
                    errors.extend([f"[{key}] -> {e}" for e in val_errs])
                    
    elif schema_type == "array":
        if not isinstance(data, list):
            return False, [f"Expected list, got {type(data).__name__}"]
            
        items_schema = schema.get("items", {})
        for idx, item in enumerate(data):
            item_ok, item_errs = validate_against_schema(item, items_schema)
            if not item_ok:
                errors.extend([f"Array index [{idx}] -> {e}" for e in item_errs])
                
    elif schema_type == "integer":
        if not isinstance(data, int) or isinstance(data, bool):
            if isinstance(data, str) and data.isdigit():
                pass
            elif isinstance(data, float):
                # allow converting float to int
                pass
            else:
                return False, [f"Expected integer, got {type(data).__name__}"]
                
    elif schema_type == "string":
        if not isinstance(data, str):
            return False, [f"Expected string, got {type(data).__name__}"]
        if not data.strip():
            errors.append("Empty string value detected")
            
    return len(errors) == 0, errors

def get_fallback_response(schema):
    """
    Generates a safe static fallback dictionary conforming to the schema on validation failure.
    """
    if schema == WORKOUT_SCHEMA:
        return {
            "weekly_schedule": [
                {
                    "day": 1,
                    "title": "Full Body Baseline",
                    "difficulty": "Beginner",
                    "duration_minutes": 30,
                    "estimated_calories_burned": 200,
                    "target_muscle_groups": ["Core", "Legs", "Arms"],
                    "exercises": [
                        {"name": "Bodyweight Squats", "sets": 3, "reps": "12", "rest_seconds": 60},
                        {"name": "Push Ups (Knee pushups if needed)", "sets": 3, "reps": "10", "rest_seconds": 60},
                        {"name": "Plank Hold", "sets": 3, "reps": "30s", "rest_seconds": 45}
                    ]
                }
            ]
        }
    elif schema == MEAL_SCHEMA:
        return {
            "daily_meals": [
                {
                    "meal_type": "Breakfast",
                    "name": "Oatmeal with Almonds",
                    "calories": 350,
                    "protein_grams": 10,
                    "carbs_grams": 55,
                    "fat_grams": 8,
                    "preparation": "Boil oats in water/milk, garnish with almonds and honey.",
                    "ingredients": [
                        {"name": "Rolled Oats", "amount": "50g"},
                        {"name": "Almonds", "amount": "10 pieces"}
                    ]
                },
                {
                    "meal_type": "Lunch",
                    "name": "Dal Tadka with Roti",
                    "calories": 450,
                    "protein_grams": 18,
                    "carbs_grams": 65,
                    "fat_grams": 12,
                    "preparation": "Pressure cook yellow lentils, temper with cumin, garlic and tomatoes. Serve with whole wheat roti.",
                    "ingredients": [
                        {"name": "Toor Dal", "amount": "60g"},
                        {"name": "Whole Wheat Roti", "amount": "2 pieces"}
                    ]
                }
            ],
            "shopping_list": [
                {"item": "Rolled Oats", "amount": "500g"},
                {"item": "Toor Dal", "amount": "1kg"},
                {"item": "Whole Wheat Flour", "amount": "2kg"}
            ]
        }
    elif schema == COACH_SCHEMA:
        return {
            "answer": "Consistency is the key to progress. Keep drinking water and logging daily weight.",
            "tips": ["Prioritize sleep (7-8 hours) for recovery.", "Keep walking 10k steps daily."],
            "warnings": ["Consult a doctor before changing routines if feeling severe muscle fatigue."],
            "motivation": "Make today count.",
            "suggested_next_actions": ["Log water intake", "Review weekly plan details"]
        }
    elif schema == RECOMMENDATION_SCHEMA:
        return {
            "recommendations": [
                {
                    "category": "Workout Tip",
                    "priority": "High",
                    "description": "Maintain correct postural alignment during exercises.",
                    "reason": "Reduces joint strains."
                },
                {
                    "category": "Nutrition Tip",
                    "priority": "Medium",
                    "description": "Eat a palm-sized portion of protein with meals.",
                    "reason": "Aids muscle recovery."
                }
            ]
        }
    elif schema == INSIGHTS_SCHEMA:
        return {
            "insight": "Focus on progressive consistency in your workouts today. Small, structured changes yield cumulative fitness results over time."
        }
    return {}
