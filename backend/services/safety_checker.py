import re

def check_weight_loss_safety(goal_text):
    """
    Checks user's weight loss requests for extreme, dangerous rates.
    If detected (e.g. lose 10kg in 1 week), returns (False, warning_data).
    Otherwise returns (True, None).
    """
    if not goal_text:
        return True, None
        
    goal_text_lower = goal_text.lower()
    
    if "lose" in goal_text_lower and ("kg" in goal_text_lower or "kilo" in goal_text_lower or "lbs" in goal_text_lower):
        numbers = [int(n) for n in re.findall(r'\b\d+\b', goal_text_lower)]
        if len(numbers) >= 2:
            try:
                target_loss = numbers[0]
                timeframe = numbers[1]
                
                # Check timeframe units (weeks vs days)
                is_days = any(d in goal_text_lower for d in ["day", "days"])
                weeks = timeframe / 7 if is_days else timeframe
                
                if weeks > 0:
                    weekly_rate = target_loss / weeks
                    # A rate of > 1.5 kg per week is considered extreme and unsafe
                    if weekly_rate > 1.5:
                        return False, {
                            "warning": f"Unsafe weight loss rate requested ({round(weekly_rate, 1)} kg/week).",
                            "recommendation": "The recommended safe weight loss rate is 0.5 to 1.0 kg per week.",
                            "explanation": "Losing weight faster than 1.5 kg/week can lead to muscle wasting, nutritional deficiencies, and gallstones."
                        }
            except Exception:
                pass
                
    return True, None

def sanitize_workout_safety(user_injuries, workout_plan_dict):
    """
    Scans workout plan exercises and replaces exercises that trigger injury alerts with safe alternatives.
    """
    if not user_injuries or not workout_plan_dict:
        return workout_plan_dict
        
    injuries_lower = user_injuries.lower()
    
    # Common injuries and their rules
    safety_rules = [
        {
            "injury_keywords": ["knee", "meniscus", "acl", "patellar", "joint pain"],
            "unsafe_exercises": ["squats", "lunges", "jump squats", "burpees", "box jumps", "jump ropes"],
            "safe_alternative": "Low-impact glute bridges / clamshells / leg raises (modified for knee safety)"
        },
        {
            "injury_keywords": ["shoulder", "rotator cuff", "dislocation"],
            "unsafe_exercises": ["overhead press", "shoulder press", "dips", "bench press", "handstand"],
            "safe_alternative": "Light resistance band face-pulls / wall slides / lateral raises (avoid overhead overload)"
        },
        {
            "injury_keywords": ["back", "spine", "lumbar", "herniated", "sciatica", "slipped disc"],
            "unsafe_exercises": ["deadlift", "heavy squats", "crunches", "situps", "sit-ups"],
            "safe_alternative": "Planks / bird-dogs / deadbugs / glute bridges (focus on neutral spine core strength)"
        }
    ]
    
    weekly_schedule = workout_plan_dict.get("weekly_schedule", [])
    modified = False
    
    for day in weekly_schedule:
        exercises = day.get("exercises", [])
        for ex in exercises:
            name_lower = ex.get("name", "").lower()
            for rule in safety_rules:
                # Check if user has an injury keyword match
                if any(kw in injuries_lower for kw in rule["injury_keywords"]):
                    # Check if the exercise is flagged as unsafe
                    if any(unsafe in name_lower for unsafe in rule["unsafe_exercises"]):
                        ex["name"] = f"Modified Exercise: {rule['safe_alternative']}"
                        ex["rest_seconds"] = max(ex.get("rest_seconds", 60), 90)  # extend rest
                        ex["reps"] = "10-12 controlled"
                        modified = True
                        
    return workout_plan_dict
