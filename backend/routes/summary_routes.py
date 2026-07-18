from flask import Blueprint, g
from database import db, cursor
from auth import token_required
from utils.response import make_api_response

summary = Blueprint("summary", __name__)

@summary.route("", methods=["GET"])
@token_required
def daily_summary_new():
    email = g.user_email

    # Update/verify streak on summary query to keep daily sessions updated
    try:
        from services.onboarding_service import update_user_streak
        update_user_streak(cursor, db, email)
    except Exception as e:
        print(f"Failed to update streak in summary: {e}")

    cursor.execute(
        """
        SELECT id, name, email, role, profile_completed, initial_setup_completed, 
               workout_status, meal_status, recommendations_status, insights_status, 
               current_streak, longest_streak, bmr, calories_target, ai_insights, goal, diet, activity
        FROM users WHERE email=%s
        """,
        (email,)
    )
    user = cursor.fetchone()
    if not user:
        return make_api_response(
            success=False,
            message="User not found",
            errors={"user": "User record does not exist"},
            status_code=404
        )

    (user_id, name, user_email, role, profile_completed, initial_setup_completed,
     workout_status, meal_status, recommendations_status, insights_status,
     current_streak, longest_streak, bmr, calories_target, ai_insights, goal, diet, activity) = user

    # If profile is not complete, return minimal info to prompt welcome onboarding
    if not profile_completed:
        return make_api_response(
            success=True,
            message="Profile is not completed yet",
            data={
                "profile_completed": False,
                "profile": {
                    "name": name,
                    "email": user_email
                }
            },
            status_code=200
        )

    # Retrieve cached plans
    # Latest Workout
    cursor.execute(
        "SELECT workout_plan FROM workouts WHERE user_id=%s ORDER BY created_at DESC LIMIT 1",
        (user_id,)
    )
    workout = cursor.fetchone()

    # Latest Meal
    cursor.execute(
        "SELECT meal_plan FROM meals WHERE user_id=%s ORDER BY created_at DESC LIMIT 1",
        (user_id,)
    )
    meal = cursor.fetchone()

    # Latest Weight
    cursor.execute(
        "SELECT weight FROM progress WHERE user_id=%s ORDER BY created_at DESC LIMIT 1",
        (user_id,)
    )
    weight = cursor.fetchone()

    # Workouts Completed
    cursor.execute(
        "SELECT COUNT(*) FROM progress WHERE user_id=%s AND workout_completed=1",
        (user_id,)
    )
    workouts_completed = cursor.fetchone()

    # Average Water Intake
    cursor.execute(
        "SELECT AVG(water) FROM progress WHERE user_id=%s",
        (user_id,)
    )
    avg_water = cursor.fetchone()

    return make_api_response(
        success=True,
        message="Daily summary retrieved successfully",
        data={
            "profile_completed": True,
            "initial_setup_completed": bool(initial_setup_completed),
            "workout_status": workout_status,
            "meal_status": meal_status,
            "recommendations_status": recommendations_status,
            "insights_status": insights_status,
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "bmr": bmr,
            "calories_target": calories_target,
            "ai_insights": ai_insights,
            "profile": {
                "name": name,
                "email": user_email,
                "goal": goal,
                "diet": diet,
                "activity": activity
            },
            "dashboard": {
                "current_weight": weight[0] if weight else 0,
                "workouts_completed": workouts_completed[0] if workouts_completed else 0,
                "average_water": round(float(avg_water[0]), 2) if avg_water and avg_water[0] else 0
            },
            "latest_workout": workout[0] if workout else "",
            "latest_meal": meal[0] if meal else ""
        },
        status_code=200
    )

@summary.route("/<email>", methods=["GET"])
@token_required
def daily_summary(email):
    return daily_summary_new()

@summary.route("/generate-insights", methods=["POST"])
@summary.route("/generate_insights", methods=["POST"])
@token_required
def generate_insights_route_new():
    email = g.user_email
    from services.ai_service import generate_dashboard_insights
    try:
        from services.onboarding_service import update_onboarding_status
        update_onboarding_status(cursor, db, email, 'insights', 'running')
        
        res, status_code = generate_dashboard_insights(cursor, db, email)
        if status_code == 200:
            update_onboarding_status(cursor, db, email, 'insights', 'completed')
            return make_api_response(
                success=True,
                message="AI Insights generated successfully",
                data=res,
                status_code=200
            )
        else:
            update_onboarding_status(cursor, db, email, 'insights', 'failed')
            return make_api_response(
                success=False,
                message="Failed to generate AI Insights",
                errors=res,
                status_code=status_code
            )
    except Exception as e:
        from services.onboarding_service import update_onboarding_status
        try:
            update_onboarding_status(cursor, db, email, 'insights', 'failed')
        except:
            pass
        return make_api_response(
            success=False,
            message="Server error during AI Insights generation",
            errors={"detail": str(e)},
            status_code=500
        )

@summary.route("/generate_insights/<email>", methods=["POST"])
@token_required
def generate_insights_route(email):
    return generate_insights_route_new()