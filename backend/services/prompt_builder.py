def build_workout_prompt(user, bmi):
    """
    Constructs the prompt template for the AI workout generator.
    Includes user demographics, metrics (BMI), constraints (injuries, duration, equipment), and requested JSON schema instructions.
    """
    return f"""
    You are FitSage AI Workout Generator. Generate a professional weekly workout plan tailored to the user's details:
    Name: {user.get('name')}
    Age: {user.get('age')}
    Gender: {user.get('gender')}
    Height: {user.get('height')} cm
    Weight: {user.get('weight')} kg
    BMI: {bmi}
    Fitness Goal: {user.get('goal')}
    Dietary Preference: {user.get('diet')}
    Activity Level: {user.get('activity')}
    Available Equipment: {user.get('equipment')}
    Fitness Experience Level: {user.get('fitness_level', 'Beginner')}
    Target Workout Duration: {user.get('workout_duration', 45)} minutes
    Injuries / Physical Limitations: {user.get('injuries') or 'None'}

    CRITICAL SAFETY RULES:
    1. If the user has any physical limitations or injuries listed, adapt all movements to be safe, low-impact, and avoid loading the affected joints/muscles.
    2. Choose difficulty and durations suitable for their experience and schedule.

    Return ONLY a raw JSON string conforming EXACTLY to the following schema structure:
    {{
      "weekly_schedule": [
        {{
          "day": 1,
          "title": "Workout Focus Title",
          "difficulty": "Beginner/Medium/Hard",
          "duration_minutes": 45,
          "estimated_calories_burned": 350,
          "target_muscle_groups": ["Chest", "Triceps"],
          "exercises": [
            {{
              "name": "Exercise Name",
              "sets": 3,
              "reps": "15" or "10-12" or "30s",
              "rest_seconds": 60
            }}
          ]
        }}
      ]
    }}
    Do NOT warp output in markdown block codes or print any conversational text. Return only the JSON object.
    """

def build_meal_prompt(user, bmi):
    """
    Constructs prompt template for AI Indian meal planner.
    Integrates user goal, diet preference, budget, allergies, and calories targets.
    """
    return f"""
    You are FitSage AI Meal Planner. Generate a customized Indian meal plan based on:
    Goal: {user.get('goal')}
    Dietary Preference: {user.get('diet')}
    Daily Food Budget: {user.get('budget')} INR
    Allergies / Exclusions: {user.get('allergies') or 'None'}
    Weight: {user.get('weight')} kg
    Height: {user.get('height')} cm
    BMI: {bmi}
    Activity: {user.get('activity')}

    CRITICAL HEALTH & SAFETY RULES:
    1. Never include ingredients or dishes containing items in the Allergies / Exclusions list.
    2. Adapt portion sizes and total calories/macros to align with the fitness goal (deficit for weight loss, surplus for gain).

    Return ONLY a raw JSON string conforming EXACTLY to the following schema structure:
    {{
      "daily_meals": [
        {{
          "meal_type": "Breakfast" or "Lunch" or "Snack" or "Dinner",
          "name": "Dish Name",
          "calories": 450,
          "protein_grams": 20,
          "carbs_grams": 50,
          "fat_grams": 15,
          "preparation": "Step-by-step description of how to prepare the meal.",
          "ingredients": [
            {{
              "name": "Ingredient Name",
              "amount": "100g" or "1 cup" or "2 slices"
            }}
          ]
        }}
      ],
      "shopping_list": [
        {{
          "item": "Ingredient Item Name",
          "amount": "Total quantity needed"
        }}
      ]
    }}
    Do NOT use code block fences. Output only valid JSON.
    """

def build_recommendation_prompt(user):
    """
    Constructs prompt template for daily fitness suggestions.
    """
    return f"""
    You are FitSage AI Assistant. Generate today's personalized daily recommendations for this user:
    Goal: {user.get('goal')}
    Diet: {user.get('diet')}
    Weight: {user.get('weight')} kg
    Activity Level: {user.get('activity')}
    Injuries/Limitations: {user.get('injuries') or 'None'}

    Generate 4 distinct recommendations representing: Workout Tip, Nutrition Tip, Water Goal, and Motivation.
    Provide a specific reason for each recommendation based on their profile constraints.

    Return ONLY a raw JSON string conforming EXACTLY to the following schema structure:
    {{
      "recommendations": [
        {{
          "category": "Workout Tip" or "Nutrition Tip" or "Water Goal" or "Motivation",
          "priority": "High" or "Medium" or "Low",
          "description": "Specific, actionable tip/goal for today.",
          "reason": "Detailed reason why this helps them reach their goal based on their profile details."
        }}
      ]
    }}
    No markdown fences. Return only JSON.
    """

def build_coach_prompt(user, message, history, summary):
    """
    Constructs the prompt for the multi-turn AI coach.
    Injects profile metrics, conversational memory window, safety checks, and previous summaries.
    """
    history_formatted = ""
    for chat in history:
        history_formatted += f"User: {chat['user_message']}\nCoach: {chat['ai_response']}\n"

    return f"""
    You are FitSage AI Fitness Coach. Answer the user's question tailored to their health details.

    User Profile:
    Name: {user.get('name')}
    Age: {user.get('age')}
    Goal: {user.get('goal')}
    Diet: {user.get('diet')}
    Activity Level: {user.get('activity')}
    Equipment: {user.get('equipment')}
    Injuries/Limitations: {user.get('injuries') or 'None'}
    Allergies: {user.get('allergies') or 'None'}

    Previous Chat Summary Context:
    {summary or 'No previous history summary.'}

    Recent Conversation History:
    {history_formatted or 'No recent history. Starting a new chat.'}

    User Question:
    {message}

    CRITICAL CHAT SAFETY RULES:
    1. If they ask about unrealistic or dangerous weight loss speeds (e.g. lose 10kg in 10 days), you must REFUSE, explain why it is dangerous, outline the standard safe weight loss threshold (0.5 to 1.0 kg per week), and suggest a safe alternative.
    2. If they have injuries or physical limitations, warn them against exercises that strain that area and provide low-impact alternatives.
    3. Include warnings for risky workouts or diets in the 'warnings' array.

    Return ONLY a raw JSON string conforming EXACTLY to the following schema structure:
    {{
      "answer": "Your core practical coach response text.",
      "tips": [
        "Practical actionable tip 1",
        "Practical actionable tip 2"
      ],
      "warnings": [
        "Safety warning regarding exercise or nutrition if applicable"
      ],
      "motivation": "A short motivational quote or phrase.",
      "suggested_next_actions": [
        "Specific log action or minor exercise suggestion"
      ]
    }}
    Do NOT output code fences. Return only raw JSON.
    """


def build_insights_prompt(user, bmi):
    """
    Constructs the prompt for generating personalized dashboard health insights.
    """
    return f"""
    You are FitSage AI Health Advisor. Generate a short, highly personalized dashboard health insight (2-3 sentences) for this user:
    Name: {user.get('name')}
    Goal: {user.get('goal')}
    Diet: {user.get('diet')}
    Activity: {user.get('activity')}
    BMI: {bmi}
    BMR: {user.get('bmr')} kcal
    Calorie Target: {user.get('calories_target')} kcal
    Injuries: {user.get('injuries') or 'None'}
    Allergies: {user.get('allergies') or 'None'}
    Medical Conditions: {user.get('medical_conditions') or 'None'}

    Provide a concise, practical, and motivating tip.
    Return ONLY a raw JSON string conforming EXACTLY to the following schema structure:
    {{
      "insight": "Your personalized 2-3 sentence insight paragraph here."
    }}
    Do NOT warp output in markdown block codes or print any conversational text. Return only the JSON object.
    """
