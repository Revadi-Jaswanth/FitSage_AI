from datetime import datetime, date

def calculate_bmr_and_calories(age, gender, height, weight, activity, goal):
    """
    Calculates BMR using Mifflin-St Jeor Equation and dynamic calorie targets (TDEE).
    """
    try:
        w = float(weight)
        h = float(height)
        a = int(age)
    except (ValueError, TypeError):
        return 1500.0, 2000

    gender_lower = str(gender).lower()
    if gender_lower == "male":
        s = 5
    elif gender_lower == "female":
        s = -161
    else:
        s = -78  # Average of male/female offsets for other/prefer not to say

    bmr = (10 * w) + (6.25 * h) - (5 * a) + s

    # Activity multiplier mapping
    activity_lower = str(activity).lower()
    if "sedentary" in activity_lower:
        multiplier = 1.2
    elif "light" in activity_lower:
        multiplier = 1.375
    elif "moderate" in activity_lower:
        multiplier = 1.55
    elif "very" in activity_lower:
        multiplier = 1.725
    elif "athlete" in activity_lower:
        multiplier = 1.9
    else:
        multiplier = 1.375  # Default fallback

    tdee = bmr * multiplier

    # Goal offset target mapping
    goal_lower = str(goal).lower()
    if "lose" in goal_lower:
        calories_target = tdee - 500
    elif "gain" in goal_lower or "build" in goal_lower:
        calories_target = tdee + 300
    else:
        calories_target = tdee

    # Keep target calories healthy and safe
    calories_target = max(1200, int(round(calories_target)))
    return round(bmr, 1), calories_target

def update_user_streak(cursor, db, email):
    """
    Core streak logic verification. Increments consecutive daily logins, resets streak
    if days were missed, and handles same-day duplicate skips.
    """
    cursor.execute(
        "SELECT last_login_date, current_streak, longest_streak FROM users WHERE email=%s",
        (email,)
    )
    res = cursor.fetchone()
    if not res:
        return
    
    last_login, current_streak, longest_streak = res
    if current_streak is None:
        current_streak = 0
    if longest_streak is None:
        longest_streak = 0

    today = datetime.now().date()
    
    if last_login is None:
        current_streak = 1
        longest_streak = max(1, longest_streak)
        last_login = today
    else:
        if isinstance(last_login, str):
            try:
                last_login_date = datetime.strptime(last_login, "%Y-%m-%d").date()
            except ValueError:
                last_login_date = today
        else:
            last_login_date = last_login
            
        delta = (today - last_login_date).days
        
        if delta == 1:
            current_streak += 1
            longest_streak = max(current_streak, longest_streak)
            last_login = today
        elif delta > 1:
            current_streak = 1
            last_login = today
        # If delta == 0, keep current streak (already logged in today)

    cursor.execute(
        """
        UPDATE users 
        SET last_login_date=%s, current_streak=%s, longest_streak=%s 
        WHERE email=%s
        """,
        (last_login, current_streak, longest_streak, email)
    )
    db.commit()

def update_onboarding_status(cursor, db, email, feature, status):
    """
    Updates the status of a specific onboarding feature generation step:
    'workout', 'meal', 'recommendations', 'insights'
    Valid status values: 'pending', 'running', 'completed', 'failed'
    """
    valid_features = ['workout', 'meal', 'recommendations', 'insights']
    if feature not in valid_features:
        raise ValueError(f"Invalid feature: {feature}")

    column_name = f"{feature}_status"
    cursor.execute(
        f"UPDATE users SET {column_name}=%s WHERE email=%s",
        (status, email)
    )
    db.commit()
    
    # Check if all features are completed to set initial_setup_completed = True
    check_initial_setup_completed(cursor, db, email)

def check_initial_setup_completed(cursor, db, email):
    """
    Checks if all 4 AI sections have completed their status.
    If so, updates initial_setup_completed to True.
    """
    cursor.execute(
        "SELECT workout_status, meal_status, recommendations_status, insights_status FROM users WHERE email=%s",
        (email,)
    )
    res = cursor.fetchone()
    if res:
        w_status, m_status, r_status, i_status = res
        if w_status == 'completed' and m_status == 'completed' and r_status == 'completed' and i_status == 'completed':
            cursor.execute(
                "UPDATE users SET initial_setup_completed=True WHERE email=%s",
                (email,)
            )
            db.commit()
            return True
    return False
