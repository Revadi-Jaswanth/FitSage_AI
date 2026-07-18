from flask import Blueprint, jsonify, request, g
from database import cursor, db
from auth import token_required
from services.ai_service import generate_workout_plan

workout = Blueprint("workout", __name__)

from utils.response import make_api_response

@workout.route("/generate", methods=["GET", "POST"])
@token_required
def generate_workout_new():
    email = g.user_email
        
    # Check if profile completed
    cursor.execute("SELECT profile_completed FROM users WHERE email=%s", (email,))
    row = cursor.fetchone()
    if not row or not row[0]:
        return make_api_response(
            success=False,
            message="Profile must be completed first",
            errors={"profile": "Incomplete configuration"},
            status_code=400
        )
        
    force_regenerate = request.args.get("force", "false").lower() == "true"
    
    from services.onboarding_service import update_onboarding_status
    try:
        update_onboarding_status(cursor, db, email, 'workout', 'running')
        
        res, status_code = generate_workout_plan(cursor, db, email, force_regenerate)
        if status_code == 200:
            update_onboarding_status(cursor, db, email, 'workout', 'completed')
            return make_api_response(
                success=True,
                message="Workout plan retrieved successfully",
                data=res,
                status_code=200
            )
        else:
            update_onboarding_status(cursor, db, email, 'workout', 'failed')
            return make_api_response(
                success=False,
                message="Failed to generate workout plan",
                errors=res,
                status_code=status_code
            )
    except Exception as e:
        try:
            update_onboarding_status(cursor, db, email, 'workout', 'failed')
        except:
            pass
        return make_api_response(
            success=False,
            message="Server error during workout generation",
            errors={"detail": str(e)},
            status_code=500
        )

@workout.route("/generate/<email>", methods=["GET", "POST"])
@token_required
def generate_workout(email):
    return generate_workout_new()