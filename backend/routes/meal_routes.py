from flask import Blueprint, jsonify, request, g
from database import cursor, db
from auth import token_required
from services.ai_service import generate_meal_plan

meal = Blueprint("meal", __name__)

from utils.response import make_api_response

@meal.route("/generate", methods=["GET", "POST"])
@token_required
def generate_meal_new():
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
        update_onboarding_status(cursor, db, email, 'meal', 'running')
        
        res, status_code = generate_meal_plan(cursor, db, email, force_regenerate)
        if status_code == 200:
            update_onboarding_status(cursor, db, email, 'meal', 'completed')
            return make_api_response(
                success=True,
                message="Meal plan retrieved successfully",
                data=res,
                status_code=200
            )
        else:
            update_onboarding_status(cursor, db, email, 'meal', 'failed')
            return make_api_response(
                success=False,
                message="Failed to generate meal plan",
                errors=res,
                status_code=status_code
            )
    except Exception as e:
        try:
            update_onboarding_status(cursor, db, email, 'meal', 'failed')
        except:
            pass
        return make_api_response(
            success=False,
            message="Server error during meal generation",
            errors={"detail": str(e)},
            status_code=500
        )

@meal.route("/generate/<email>", methods=["GET", "POST"])
@token_required
def generate_meal(email):
    return generate_meal_new()