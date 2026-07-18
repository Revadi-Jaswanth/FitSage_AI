from flask import Blueprint, jsonify, g
from database import cursor, db
from auth import token_required
from services.ai_service import generate_recommendations

recommendations = Blueprint("recommendations", __name__)

from utils.response import make_api_response

@recommendations.route("", methods=["GET"])
@token_required
def get_recommendations_new():
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
        
    from services.onboarding_service import update_onboarding_status
    try:
        update_onboarding_status(cursor, db, email, 'recommendations', 'running')
        
        res, status_code = generate_recommendations(cursor, db, email)
        if status_code == 200:
            update_onboarding_status(cursor, db, email, 'recommendations', 'completed')
            return make_api_response(
                success=True,
                message="Recommendations retrieved successfully",
                data=res,
                status_code=200
            )
        else:
            update_onboarding_status(cursor, db, email, 'recommendations', 'failed')
            return make_api_response(
                success=False,
                message="Failed to generate recommendations",
                errors=res,
                status_code=status_code
            )
    except Exception as e:
        try:
            update_onboarding_status(cursor, db, email, 'recommendations', 'failed')
        except:
            pass
        return make_api_response(
            success=False,
            message="Server error during recommendations generation",
            errors={"detail": str(e)},
            status_code=500
        )

@recommendations.route("/<email>", methods=["GET"])
@token_required
def get_recommendations(email):
    return get_recommendations_new()